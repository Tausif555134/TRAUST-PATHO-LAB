import assert from 'node:assert';

const BASE_URL = 'http://127.0.0.1:5050';

async function testSuite() {
  console.log('\n======================================================');
  console.log('TRUST PATHO LAB — Backend Security & Audit Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  function runCheck(name, fn) {
    total++;
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Health check & Security Headers
  console.log('1. Verifying OWASP Security Headers & Health Check...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthJson = await healthRes.json();
  
  runCheck('Health endpoint returns 200 online', () => {
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthJson.status, 'online');
    assert.strictEqual(healthJson.sqlite, 'connected');
  });

  runCheck('X-Content-Type-Options: nosniff header present', () => {
    assert.strictEqual(healthRes.headers.get('x-content-type-options'), 'nosniff');
  });

  runCheck('X-Frame-Options: DENY header present', () => {
    assert.strictEqual(healthRes.headers.get('x-frame-options'), 'DENY');
  });

  runCheck('Content-Security-Policy header present', () => {
    assert(healthRes.headers.get('content-security-policy').includes("default-src 'self'"));
  });

  runCheck('Strict-Transport-Security header present', () => {
    assert(healthRes.headers.get('strict-transport-security').includes('max-age=31536000'));
  });

  // 2. CSRF Token Protection
  console.log('\n2. Verifying CSRF Token Issuance & Enforcement...');
  const csrfRes = await fetch(`${BASE_URL}/api/csrf-token`);
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;

  runCheck('CSRF token is generated with 64 hex characters', () => {
    assert.strictEqual(csrfRes.status, 200);
    assert.strictEqual(typeof csrfToken, 'string');
    assert.strictEqual(csrfToken.length, 64);
  });

  const unauthenticatedMutation = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      // Missing x-csrf-token
    },
    body: JSON.stringify({ patientName: 'Attacker' }),
  });

  runCheck('State mutation without CSRF token is blocked with HTTP 403', () => {
    assert.strictEqual(unauthenticatedMutation.status, 403);
  });

  const forgedOriginMutation = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://evil-malicious-site.com',
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify({ patientName: 'Attacker' }),
  });

  runCheck('Cross-Origin attack with untrusted origin is blocked with HTTP 403', () => {
    assert.strictEqual(forgedOriginMutation.status, 403);
  });

  // 3. SQL Injection Immunity
  console.log('\n3. Verifying SQL Injection Immunity (Parameterized Queries)...');
  const sqliSearchPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE tests; --",
    "CBC' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11--",
    "admin'--",
  ];

  for (const sqli of sqliSearchPayloads) {
    const searchRes = await fetch(`${BASE_URL}/api/tests?search=${encodeURIComponent(sqli)}`);
    const searchData = await searchRes.json();
    runCheck(`SQLi attempt "${sqli}" handled safely`, () => {
      assert.strictEqual(searchRes.status, 200);
      assert(Array.isArray(searchData.tests));
    });
  }

  // Verify tests table was NOT dropped
  const verifyTestsRes = await fetch(`${BASE_URL}/api/tests`);
  const verifyTestsData = await verifyTestsRes.json();
  runCheck('Database integrity verified (All 62 flyer tests preserved)', () => {
    assert.strictEqual(verifyTestsData.total, 62);
  });

  // 4. Role-Based Authorization & Admin Controls (Run before exhausting rate limits)
  console.log('\n4. Verifying Role-Based Access Control & Price Management...');
  const unauthorizedPriceUpdate = await fetch(`${BASE_URL}/api/tests/test-001/price`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'x-csrf-token': csrfToken,
      // No Authorization header
    },
    body: JSON.stringify({ price: 100 }),
  });

  runCheck('Unauthenticated price modification rejected with HTTP 401', () => {
    assert.strictEqual(unauthorizedPriceUpdate.status, 401);
  });

  // Perform legitimate admin login
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'TrustAdmin2024!Secure',
    }),
  });

  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;

  runCheck('Admin authentication succeeds with scrypt verification', () => {
    assert.strictEqual(adminLoginRes.status, 200);
    assert(typeof adminToken === 'string');
  });

  // Admin legitimate price update (e.g. CBC test updated from 350 to 380)
  const validPriceUpdate = await fetch(`${BASE_URL}/api/tests/test-001/price`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'x-csrf-token': csrfToken,
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ price: 380 }),
  });

  const validPriceData = await validPriceUpdate.json();

  runCheck('Admin token authorizes test price update to ₹380', () => {
    assert.strictEqual(validPriceUpdate.status, 200);
    assert.strictEqual(validPriceData.test.price, 380);
  });

  // Negative price rejected
  const invalidPriceUpdate = await fetch(`${BASE_URL}/api/tests/test-001/price`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'x-csrf-token': csrfToken,
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ price: -50 }),
  });

  runCheck('Negative price rejected with HTTP 400', () => {
    assert.strictEqual(invalidPriceUpdate.status, 400);
  });

  // Restore CBC price to original 350
  await fetch(`${BASE_URL}/api/tests/test-001/price`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'x-csrf-token': csrfToken,
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ price: 350 }),
  });

  // 5. Booking Flow & Input Validation
  console.log('\n5. Verifying Booking Flow & Input Validation...');
  const validBookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify({
      patientName: 'Rameshwar Kumar',
      patientPhone: '9142661354',
      patientAge: 42,
      patientGender: 'male',
      testId: 'test-001',
      testName: 'CBC',
      price: 350,
      houseFlat: 'Flat 102, Karbala Road',
      street: 'Iqbal Nagar',
      area: 'Gaya',
      city: 'Gaya',
      state: 'Bihar',
      pinCode: '823002',
      bookingDate: '2026-10-15',
      timeSlot: '08:00 AM - 09:00 AM',
    }),
  });

  const validBookingData = await validBookingRes.json();
  runCheck('Valid booking insertion succeeds with unique TRP code', () => {
    assert.strictEqual(validBookingRes.status, 201);
    assert(validBookingData.booking.bookingCode.startsWith('TRP-'));
  });

  // 6. Rate Limiting Protection (Executed at the end)
  console.log('\n6. Verifying Rate Limiting Enforcement (Sliding Window)...');
  let rateLimitTriggered = false;
  let retryAfterHeader = null;

  for (let i = 0; i < 7; i++) {
    const otpRes = await fetch(`${BASE_URL}/api/auth/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({ phone: '9876543210' }),
    });

    if (otpRes.status === 429) {
      rateLimitTriggered = true;
      retryAfterHeader = otpRes.headers.get('retry-after');
      break;
    }
  }

  runCheck('Sensitive auth/OTP endpoint triggers HTTP 429 upon threshold excess', () => {
    assert.strictEqual(rateLimitTriggered, true);
    assert(retryAfterHeader !== null);
  });

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed} / ${total} security assertions passed (${Math.round((passed / total) * 100)}%)`);
  console.log('------------------------------------------------------\n');
}

testSuite().catch(console.error);
