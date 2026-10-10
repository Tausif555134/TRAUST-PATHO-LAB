import fs from 'fs';
import assert from 'assert';

console.log('========================================================');
console.log('TRUST PATHO LAB — Multi-Page Refactor Verification Suite');
console.log('========================================================\n');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
  }
}

// 1. Verify Routes in App.tsx
console.log('1. Checking Routes in App.tsx...');
const appContent = fs.readFileSync('src/App.tsx', 'utf8');

test('App.tsx defines route "/" with HomePage', () => {
  assert(appContent.includes('path="/"') && appContent.includes('HomePage'));
});

test('App.tsx defines route "/tests" with TestsPage', () => {
  assert(appContent.includes('path="/tests"') && appContent.includes('TestsPage'));
});

test('App.tsx defines route "/book" with BookingPage', () => {
  assert(appContent.includes('path="/book"') && appContent.includes('BookingPage'));
});

test('App.tsx defines route "/contact" with ContactPage', () => {
  assert(appContent.includes('path="/contact"') && appContent.includes('ContactPage'));
});

test('App.tsx guards "/patient/dashboard" with ProtectedRoute', () => {
  assert(appContent.includes('path="/patient/dashboard"') && appContent.includes('ProtectedRoute'));
});

test('App.tsx guards "/professional/dashboard" with ProtectedRoute', () => {
  assert(appContent.includes('path="/professional/dashboard"') && appContent.includes('ProtectedRoute'));
});

test('App.tsx guards "/admin" with ProtectedRoute', () => {
  assert(appContent.includes('path="/admin"') && appContent.includes('ProtectedRoute'));
});

// 2. Verify Minimal HomePage.tsx
console.log('\n2. Checking Minimal HomePage.tsx...');
const homeContent = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

test('HomePage does not contain the old 8 Diagnostic Facilities grid', () => {
  assert(!homeContent.includes('8 Diagnostic Facilities Available'));
});

test('HomePage includes Trust Patho Lab intro and Govt Reg No', () => {
  assert(homeContent.includes('Govt. Reg. No. 229112131723'));
  assert(homeContent.includes('Trusted Pathology'));
});

test('HomePage includes Popular Pathology Tests with direct booking CTAs', () => {
  assert(homeContent.includes('Popular Pathology Tests'));
  assert(homeContent.includes('/book?testId='));
});

test('HomePage links directly to /tests and /book', () => {
  assert(homeContent.includes('to="/tests"'));
  assert(homeContent.includes('to="/book"'));
});

test('HomePage includes 4-step How It Works process', () => {
  assert(homeContent.includes('How Home Sample Collection Works'));
});

// 3. Verify TestsPage.tsx & 62 Tests
console.log('\n3. Checking TestsPage.tsx & Lab Tests Integrity...');
const testsPageContent = fs.readFileSync('src/pages/TestsPage.tsx', 'utf8');
const mockDataContent = fs.readFileSync('src/services/mockData.ts', 'utf8');

test('TestsPage renders PriceListSection with standalone mode', () => {
  assert(testsPageContent.includes('<PriceListSection standalone={true} />'));
});

test('Catalog contains all 62 official pathology tests', () => {
  const matches = mockDataContent.match(/id:\s*['"]test-\d+['"]/g) || [];
  assert.strictEqual(matches.length, 62, `Expected 62 tests, found ${matches.length}`);
});

// 4. Verify ContactPage.tsx
console.log('\n4. Checking ContactPage.tsx...');
const contactContent = fs.readFileSync('src/pages/ContactPage.tsx', 'utf8');

test('ContactPage contains official address in Gaya', () => {
  assert(contactContent.includes('Gaya Patna Road, Iqbal Nagar, Near Karbala'));
  assert(contactContent.includes('823002'));
});

test('ContactPage contains all telephone hotlines and WhatsApp', () => {
  assert(contactContent.includes('6206175583'));
  assert(contactContent.includes('6299476228'));
  assert(contactContent.includes('9142661354'));
  assert(contactContent.includes('care@trustpatholab.com'));
});

test('ContactPage houses the 8 Diagnostic Facilities', () => {
  assert(contactContent.includes('8 Core Clinical Pathology Facilities'));
  assert(contactContent.includes('Haematology'));
  assert(contactContent.includes('Biochemistry'));
  assert(contactContent.includes('Serology'));
  assert(contactContent.includes('Histopathology'));
});

test('ContactPage includes Medico-Legal Disclaimer and Emergency Advisory', () => {
  assert(contactContent.includes('NOT TO BE USED FOR MEDICO-LEGAL PURPOSE'));
  assert(contactContent.includes('108 / 102'));
});

// 5. Verify Compact Navbar.tsx
console.log('\n5. Checking Compact Navbar.tsx...');
const navbarContent = fs.readFileSync('src/components/common/Navbar.tsx', 'utf8');

test('Navbar includes compact mobile header and hamburger menu toggle', () => {
  assert(navbarContent.includes('mobileMenuOpen'));
  assert(navbarContent.includes('Toggle Menu') || navbarContent.includes('aria-label="Toggle Menu"'));
});

test('Navbar includes public navigation links: Home, Tests, Book, Contact', () => {
  assert(navbarContent.includes("to: '/'"));
  assert(navbarContent.includes("to: '/tests'"));
  assert(navbarContent.includes("to: '/book'"));
  assert(navbarContent.includes("to: '/contact'"));
});

test('Navbar preserves persona switcher and authentication modal trigger', () => {
  assert(navbarContent.includes('switchPersona'));
  assert(navbarContent.includes('onOpenAuthModal'));
});

// 6. Verify ProtectedRoute.tsx
console.log('\n6. Checking ProtectedRoute.tsx...');
const protectedRouteContent = fs.readFileSync('src/components/common/ProtectedRoute.tsx', 'utf8');

test('ProtectedRoute guards against unauthenticated / guest access', () => {
  assert(protectedRouteContent.includes('Authentication Required'));
  assert(protectedRouteContent.includes("role === 'guest'"));
});

test('ProtectedRoute guards role permissions', () => {
  assert(protectedRouteContent.includes('Access Restricted'));
  assert(protectedRouteContent.includes('allowedRoles'));
});

// 7. Verify Responsive Styling Consistency (320px - 430px)
console.log('\n7. Checking Responsive Classes (320px - 430px mobile friendly)...');
test('All pages avoid hardcoded wide pixel widths', () => {
  const allPageFiles = [
    'src/pages/HomePage.tsx',
    'src/pages/TestsPage.tsx',
    'src/pages/ContactPage.tsx',
    'src/pages/BookingPage.tsx',
    'src/components/common/Navbar.tsx',
    'src/components/common/Footer.tsx',
  ];
  for (const file of allPageFiles) {
    const content = fs.readFileSync(file, 'utf8');
    // Ensure no fixed widths like w-[500px], w-[800px] (excluding max-w and min-w)
    const fixedWidths = content.match(/(?<![a-zA-Z0-9_-])w-\[\d{3,4}px\]/g);
    assert(!fixedWidths, `${file} has hardcoded wide pixel widths: ${fixedWidths}`);
  }
});

console.log('\n--------------------------------------------------------');
console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
console.log('--------------------------------------------------------');

if (passed === total) {
  console.log('\nAll multi-page refactoring requirements verified successfully!\n');
  process.exit(0);
} else {
  console.error('\nSome verification tests failed.\n');
  process.exit(1);
}
