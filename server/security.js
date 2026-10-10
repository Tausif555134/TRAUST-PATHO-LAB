import crypto from 'node:crypto';

// Secret key for HMAC token signing (kept exclusively on server, never exposed to client)
const SERVER_HMAC_SECRET = process.env.TRUST_SERVER_SECRET || crypto.randomBytes(32).toString('hex');

// In-memory sliding window rate limiter store
const rateLimitBuckets = new Map();

// Active CSRF token store (token -> { createdAt, ip })
const activeCsrfTokens = new Map();

// Whitelist of allowed origins
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5050',
  'http://127.0.0.1:5050',
];

/**
 * 1. Security Headers Middleware
 */
export function applySecurityHeaders(res) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; connect-src 'self' http://localhost:* http://127.0.0.1:*;");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
}

/**
 * 2. Strict CORS Middleware
 */
export function handleCors(req, res) {
  const origin = req.headers['origin'];
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token, Authorization, X-Requested-With');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true; // Preflight handled
  }
  return false;
}

/**
 * 3. CSRF Protection
 */
export function generateCsrfToken(ip) {
  const token = crypto.randomBytes(32).toString('hex');
  activeCsrfTokens.set(token, {
    createdAt: Date.now(),
    ip,
  });

  // Prune tokens older than 2 hours
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  for (const [t, data] of activeCsrfTokens.entries()) {
    if (data.createdAt < twoHoursAgo) {
      activeCsrfTokens.delete(t);
    }
  }

  return token;
}

export function verifyCsrf(req, ip) {
  // Safe HTTP read methods don't mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return true;
  }

  // Origin / Referer validation for mutation methods
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  let originValid = false;

  if (origin) {
    originValid = ALLOWED_ORIGINS.includes(origin);
  } else if (referer) {
    try {
      const parsed = new URL(referer);
      originValid = ALLOWED_ORIGINS.includes(parsed.origin);
    } catch {
      originValid = false;
    }
  }

  // Verify CSRF token header
  const submittedToken = req.headers['x-csrf-token'];
  if (!submittedToken || typeof submittedToken !== 'string') {
    return false;
  }

  const stored = activeCsrfTokens.get(submittedToken);
  if (!stored) {
    return false;
  }

  // Token expired after 2 hours
  if (Date.now() - stored.createdAt > 2 * 60 * 60 * 1000) {
    activeCsrfTokens.delete(submittedToken);
    return false;
  }

  return originValid;
}

/**
 * 4. Sliding-Window Rate Limiting Middleware
 */
export function checkRateLimit(ip, tier = 'general') {
  const limits = {
    auth: { max: 5, windowMs: 15 * 60 * 1000 },      // 5 requests per 15 min for login/OTP
    booking: { max: 10, windowMs: 15 * 60 * 1000 },   // 10 bookings per 15 min
    general: { max: 150, windowMs: 15 * 60 * 1000 },  // 150 requests per 15 min
  };

  const config = limits[tier] || limits.general;
  const key = `${ip}:${tier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let timestamps = rateLimitBuckets.get(key) || [];
  // Filter out timestamps outside current sliding window
  timestamps = timestamps.filter(t => t > windowStart);

  if (timestamps.length >= config.max) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + config.windowMs - now) / 1000);
    return {
      allowed: false,
      retryAfter: Math.max(1, retryAfterSeconds),
      remaining: 0,
    };
  }

  timestamps.push(now);
  rateLimitBuckets.set(key, timestamps);

  return {
    allowed: true,
    retryAfter: 0,
    remaining: config.max - timestamps.length,
  };
}

/**
 * 5. Role-Based Authentication & Token Management
 */
export function createAdminToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SERVER_HMAC_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SERVER_HMAC_SECRET).update(payloadB64).digest('base64url');

  if (signature.length !== expectedSig.length) return null;
  const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  if (!valid) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * 6. Input Sanitization Helpers
 */
export function sanitizeString(val, maxLen = 255) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '') // strip < and > to prevent HTML injection
    .trim()
    .slice(0, maxLen);
}

export function validatePrice(price) {
  const num = Number(price);
  if (isNaN(num) || num <= 0 || num > 500000) {
    return null;
  }
  return Math.round(num * 100) / 100;
}
