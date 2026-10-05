import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('CarePulse Home Healthcare Platform - Verification Suite');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

// 1. Files & Structural Integrity Checks
console.log('1. Verifying Files & Infrastructure...');
assert(fs.existsSync('package.json'), 'package.json exists');
assert(fs.existsSync('tsconfig.json'), 'tsconfig.json exists');
assert(fs.existsSync('vite.config.ts'), 'vite.config.ts exists');
assert(fs.existsSync('tailwind.config.js'), 'tailwind.config.js exists');
assert(fs.existsSync('index.html'), 'index.html entry exists');
assert(fs.existsSync('.env.example'), '.env.example template exists');
assert(fs.existsSync('src/main.tsx'), 'src/main.tsx exists');
assert(fs.existsSync('src/App.tsx'), 'src/App.tsx exists');
assert(fs.existsSync('src/types/index.ts'), 'src/types/index.ts exists');
assert(fs.existsSync('src/services/db.ts'), 'src/services/db.ts exists');
assert(fs.existsSync('src/services/mockData.ts'), 'src/services/mockData.ts exists');
assert(fs.existsSync('supabase/migrations/20261005_init.sql'), 'Supabase PostgreSQL DDL migration exists');
assert(fs.existsSync('supabase/seed.sql'), 'Supabase seed SQL exists');

// 2. Component Architecture Checks
console.log('\n2. Verifying Components & Pages...');
assert(fs.existsSync('src/pages/HomePage.tsx'), 'HomePage exists');
assert(fs.existsSync('src/pages/ServiceDetailsPage.tsx'), 'ServiceDetailsPage exists');
assert(fs.existsSync('src/pages/BookingPage.tsx'), 'BookingPage exists');
assert(fs.existsSync('src/pages/patient/PatientDashboard.tsx'), 'PatientDashboard exists');
assert(fs.existsSync('src/pages/professional/ProfessionalDashboard.tsx'), 'ProfessionalDashboard exists');
assert(fs.existsSync('src/pages/admin/AdminDashboard.tsx'), 'AdminDashboard exists');
assert(fs.existsSync('src/components/common/Navbar.tsx'), 'Navbar exists');
assert(fs.existsSync('src/components/common/Footer.tsx'), 'Footer exists');
assert(fs.existsSync('src/components/common/AuthModal.tsx'), 'AuthModal exists');
assert(fs.existsSync('src/components/services/ServiceCard.tsx'), 'ServiceCard exists');
assert(fs.existsSync('src/components/reports/ReportViewerModal.tsx'), 'ReportViewerModal exists');

// 3. Database Schema Completeness
console.log('\n3. Verifying Database Schema Specification...');
const sqlContent = fs.readFileSync('supabase/migrations/20261005_init.sql', 'utf8');
const expectedTables = [
  'profiles',
  'patients',
  'professionals',
  'services',
  'professional_services',
  'availability',
  'addresses',
  'bookings',
  'booking_status_history',
  'payments',
  'reports',
  'notifications',
  'reviews',
];
expectedTables.forEach((tbl) => {
  assert(sqlContent.includes(`CREATE TABLE IF NOT EXISTS public.${tbl}`), `Table public.${tbl} defined in DDL`);
});
assert(sqlContent.includes('ENABLE ROW LEVEL SECURITY'), 'Row Level Security (RLS) configured');
assert(sqlContent.includes('record_booking_status_change'), 'Status audit trigger defined');

// 4. Clinical Offerings Verification
console.log('\n4. Verifying Clinical Catalog Inclusions...');
const mockDataContent = fs.readFileSync('src/services/mockData.ts', 'utf8');
const requiredServices = [
  'General Health Checkup',
  'Blood Sample Collection',
  'Blood Pressure Check',
  'Blood Sugar Test',
  '12-Lead ECG at Home',
  'Elderly Health',
  'Doctor Home Visit',
  'Nursing Visit',
];
requiredServices.forEach((srv) => {
  assert(mockDataContent.includes(srv), `Catalog includes "${srv}"`);
});

// 5. Payment Security Architecture
console.log('\n5. Verifying Payment Abstraction...');
const paymentContent = fs.readFileSync('src/features/payments/paymentService.ts', 'utf8');
assert(paymentContent.includes('verifyServerSideSignature'), 'Cryptographic server-side verification included');
assert(paymentContent.includes('simulateFailure'), 'Payment decline edge case support present');

console.log('\n----------------------------------------------------');
console.log(`Results: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('----------------------------------------------------');

if (passedTests === totalTests) {
  console.log('\nAll verification checks passed successfully!\n');
  process.exit(0);
} else {
  console.error('\nSome verification checks failed.\n');
  process.exit(1);
}
