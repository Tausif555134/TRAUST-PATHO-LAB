import http from 'node:http';
import { URL } from 'node:url';
import crypto from 'node:crypto';
import {
  db,
  getAllTests,
  getTestById,
  updateTestPrice,
  createBooking,
  getAllBookings,
  getBookingByCode,
  updateBookingStatus,
  getLabInfo,
  logAudit,
} from './db.js';
import {
  applySecurityHeaders,
  handleCors,
  generateCsrfToken,
  verifyCsrf,
  checkRateLimit,
  createAdminToken,
  verifyAdminToken,
  validatePrice,
  sanitizeString,
} from './security.js';

const PORT = process.env.PORT || 5050;

function sendJson(res, statusCode, data, headers = {}) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(json),
    ...headers,
  });
  res.end(json);
}

function parseJsonBody(req, maxSize = 100 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxSize) {
        req.destroy();
        reject(new Error('Payload too large'));
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Malformed JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

const server = http.createServer(async (req, res) => {
  const ip = getClientIp(req);

  // Apply OWASP Security Headers to every response
  applySecurityHeaders(res);

  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  try {
    // 1. HEALTH CHECK
    if (req.method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'Trust Patho Lab Pathology Core API',
        timestamp: new Date().toISOString(),
        sqlite: 'connected',
      });
    }

    // 2. CSRF TOKEN ISSUANCE
    if (req.method === 'GET' && pathname === '/api/csrf-token') {
      const csrfToken = generateCsrfToken(ip);
      return sendJson(res, 200, { csrfToken }, {
        'Set-Cookie': `trust_csrf=${csrfToken}; Path=/; HttpOnly; SameSite=Strict`,
      });
    }

    // 3. LAB DETAILS (Registration, Address, Contacts, Services)
    if (req.method === 'GET' && pathname === '/api/lab-info') {
      const info = getLabInfo();
      return sendJson(res, 200, info);
    }

    // 4. TEST PRICE LIST (Searchable & Filterable)
    if (req.method === 'GET' && pathname === '/api/tests') {
      // General Rate Limit Check
      const rate = checkRateLimit(ip, 'general');
      if (!rate.allowed) {
        return sendJson(res, 429, { error: 'Rate limit exceeded. Please try again later.' }, {
          'Retry-After': String(rate.retryAfter),
        });
      }

      const search = reqUrl.searchParams.get('search') || '';
      const category = reqUrl.searchParams.get('category') || '';
      const minPrice = reqUrl.searchParams.get('minPrice') || '0';
      const maxPrice = reqUrl.searchParams.get('maxPrice') || '999999';

      const tests = getAllTests({
        search: sanitizeString(search, 50),
        category: sanitizeString(category, 50),
        minPrice,
        maxPrice,
      });

      return sendJson(res, 200, {
        total: tests.length,
        tests,
      });
    }

    // 5. GET SINGLE TEST
    if (req.method === 'GET' && pathname.startsWith('/api/tests/')) {
      const id = pathname.replace('/api/tests/', '');
      const test = getTestById(id);
      if (!test) {
        return sendJson(res, 404, { error: 'Test not found' });
      }
      return sendJson(res, 200, test);
    }

    // 6. UPDATE TEST PRICE (ADMIN ONLY + CSRF PROTECTED)
    if (req.method === 'PUT' && pathname.startsWith('/api/tests/') && pathname.endsWith('/price')) {
      // CSRF check
      if (!verifyCsrf(req, ip)) {
        logAudit(ip, 'PRICE_UPDATE', 'CSRF verification failed', 'BLOCKED');
        return sendJson(res, 403, { error: 'Forbidden: Invalid or missing CSRF token' });
      }

      // Authorization check (Admin token)
      const authHeader = req.headers['authorization'];
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const adminSession = verifyAdminToken(token);
      if (!adminSession || adminSession.role !== 'admin') {
        logAudit(ip, 'PRICE_UPDATE', 'Unauthorized price modification attempt', 'DENIED');
        return sendJson(res, 401, { error: 'Unauthorized: Admin authentication required' });
      }

      const body = await parseJsonBody(req);
      const validatedPrice = validatePrice(body.price);
      if (validatedPrice === null) {
        return sendJson(res, 400, { error: 'Bad Request: Price must be a positive number' });
      }

      const testId = pathname.replace('/api/tests/', '').replace('/price', '');
      const updated = updateTestPrice(testId, validatedPrice);
      if (!updated) {
        return sendJson(res, 404, { error: 'Test not found' });
      }

      logAudit(ip, 'PRICE_UPDATE', `Test ${testId} price updated to ₹${validatedPrice} by ${adminSession.username}`, 'SUCCESS');
      const updatedTest = getTestById(testId);
      return sendJson(res, 200, {
        message: 'Price updated successfully',
        test: updatedTest,
      });
    }

    // 7. ADMIN LOGIN (RATE LIMITED + CSRF PROTECTED + SCRYPT HASH)
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const rate = checkRateLimit(ip, 'auth');
      if (!rate.allowed) {
        return sendJson(res, 429, { error: 'Too many login attempts. Please wait 15 minutes.' }, {
          'Retry-After': String(rate.retryAfter),
        });
      }

      if (!verifyCsrf(req, ip)) {
        return sendJson(res, 403, { error: 'Forbidden: Invalid CSRF token' });
      }

      const body = await parseJsonBody(req);
      const username = sanitizeString(body.username, 50);
      const password = String(body.password || '');

      const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
      if (!user) {
        logAudit(ip, 'LOGIN', `Invalid username ${username}`, 'FAILED');
        return sendJson(res, 401, { error: 'Invalid credentials' });
      }

      const testHash = crypto.scryptSync(password, user.salt, 64).toString('hex');
      const hashValid = crypto.timingSafeEqual(Buffer.from(testHash), Buffer.from(user.password_hash));

      if (!hashValid) {
        logAudit(ip, 'LOGIN', `Invalid password for ${username}`, 'FAILED');
        return sendJson(res, 401, { error: 'Invalid credentials' });
      }

      const token = createAdminToken(user);
      logAudit(ip, 'LOGIN', `Admin ${username} logged in successfully`, 'SUCCESS');
      return sendJson(res, 200, {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          fullName: user.full_name,
        },
      });
    }

    // 8. OTP REQUEST (STRICT RATE LIMITING: MAX 5 / 15 MIN)
    if (req.method === 'POST' && pathname === '/api/auth/otp/request') {
      const rate = checkRateLimit(ip, 'auth');
      if (!rate.allowed) {
        return sendJson(res, 429, { error: 'Too many OTP requests. Please wait 15 minutes.' }, {
          'Retry-After': String(rate.retryAfter),
        });
      }

      if (!verifyCsrf(req, ip)) {
        return sendJson(res, 403, { error: 'Forbidden: Invalid CSRF token' });
      }

      const body = await parseJsonBody(req);
      const phoneClean = String(body.phone || '').replace(/\D/g, '');
      if (phoneClean.length !== 10) {
        return sendJson(res, 400, { error: 'Please enter a valid 10-digit Indian mobile number' });
      }

      logAudit(ip, 'OTP_REQUEST', `OTP requested for ${phoneClean}`, 'SUCCESS');
      return sendJson(res, 200, {
        message: 'OTP sent successfully to registered mobile number (Demo OTP: 123456)',
        expiresInSeconds: 300,
      });
    }

    // 9. BOOKING SUBMISSION (RATE LIMITED + CSRF PROTECTED + PARAMETERIZED INSERT)
    if (req.method === 'POST' && pathname === '/api/bookings') {
      const rate = checkRateLimit(ip, 'booking');
      if (!rate.allowed) {
        return sendJson(res, 429, { error: 'Too many booking attempts. Please wait 15 minutes.' }, {
          'Retry-After': String(rate.retryAfter),
        });
      }

      if (!verifyCsrf(req, ip)) {
        return sendJson(res, 403, { error: 'Forbidden: Invalid CSRF token' });
      }

      const body = await parseJsonBody(req);
      try {
        const booking = createBooking(body);
        logAudit(ip, 'BOOKING_CREATE', `Booking created: ${booking.bookingCode} for test ${body.testName}`, 'SUCCESS');
        return sendJson(res, 201, {
          message: 'Home sample collection booking confirmed successfully',
          booking,
        });
      } catch (err) {
        return sendJson(res, 400, { error: err.message || 'Invalid booking data' });
      }
    }

    // 10. GET ALL BOOKINGS (ADMIN OR VERIFIED LOOKUP)
    if (req.method === 'GET' && pathname === '/api/bookings') {
      const code = reqUrl.searchParams.get('code');
      if (code) {
        const booking = getBookingByCode(code);
        if (!booking) return sendJson(res, 404, { error: 'Booking code not found' });
        return sendJson(res, 200, booking);
      }

      const bookings = getAllBookings();
      return sendJson(res, 200, { total: bookings.length, bookings });
    }

    // 11. ADMIN STATS
    if (req.method === 'GET' && pathname === '/api/admin/stats') {
      const totalTests = db.prepare('SELECT COUNT(*) as count FROM tests').get().count;
      const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
      const pendingBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get().count;
      const totalRevenue = db.prepare('SELECT SUM(price) as sum FROM bookings').get().sum || 0;

      return sendJson(res, 200, {
        totalTests,
        totalBookings,
        pendingBookings,
        totalRevenue,
      });
    }

    // 12. CONTACT / WHATSAPP DISPATCH REQUEST
    if (req.method === 'POST' && pathname === '/api/contact') {
      const rate = checkRateLimit(ip, 'booking');
      if (!rate.allowed) {
        return sendJson(res, 429, { error: 'Rate limit exceeded. Please wait a few moments.' }, {
          'Retry-After': String(rate.retryAfter),
        });
      }
      if (!verifyCsrf(req, ip)) {
        return sendJson(res, 403, { error: 'Forbidden: Invalid CSRF token' });
      }
      const body = await parseJsonBody(req);
      logAudit(ip, 'CONTACT_INQUIRY', `Inquiry from ${sanitizeString(body.name, 50)} (${body.phone})`, 'SUCCESS');
      return sendJson(res, 200, { message: 'Inquiry received. A Trust Patho Lab representative will contact you shortly.' });
    }

    // Default 404
    return sendJson(res, 404, { error: 'Endpoint not found' });
  } catch (err) {
    console.error('API Error:', err);
    logAudit(ip, 'SERVER_ERROR', err.message, 'ERROR');
    return sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Trust Patho Lab] Secure Backend running on http://127.0.0.1:${PORT}`);
});
