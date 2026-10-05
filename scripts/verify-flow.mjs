import fs from 'fs';

console.log('====================================================');
console.log('TRUST PATHO LAB Frontend Diagnostics - Verification');
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
console.log('1. Verifying Frontend Webpage Infrastructure...');
assert(fs.existsSync('package.json'), 'package.json exists');
assert(fs.existsSync('tsconfig.json'), 'tsconfig.json exists');
assert(fs.existsSync('vite.config.ts'), 'vite.config.ts exists');
assert(fs.existsSync('tailwind.config.js'), 'tailwind.config.js exists');
assert(fs.existsSync('index.html'), 'index.html entry exists');
assert(fs.existsSync('src/main.tsx'), 'src/main.tsx exists');
assert(fs.existsSync('src/App.tsx'), 'src/App.tsx exists');
assert(fs.existsSync('src/types/index.ts'), 'src/types/index.ts exists');
assert(fs.existsSync('src/services/db.ts'), 'src/services/db.ts exists (frontend data service)');
assert(fs.existsSync('src/services/mockData.ts'), 'src/services/mockData.ts exists');

// 2. Component Architecture Checks
console.log('\n2. Verifying Components & Webpage Pages...');
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

// 3. Clinical Offerings Verification
console.log('\n3. Verifying Clinical Catalog Inclusions...');
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

// 4. Verification that backend is detached
console.log('\n4. Verifying Backend Logic Removal...');
const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert(!pkgJson.dependencies['@supabase/supabase-js'], '@supabase/supabase-js removed from package.json');
assert(!fs.existsSync('supabase'), 'supabase backend migration folder removed');

const dbServiceContent = fs.readFileSync('src/services/db.ts', 'utf8');
assert(!dbServiceContent.includes('@supabase/supabase-js'), 'db.ts contains zero Supabase imports');

console.log('\n----------------------------------------------------');
console.log(`Results: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('----------------------------------------------------');

if (passedTests === totalTests) {
  console.log('\nAll frontend webpage verification checks passed successfully!\n');
  process.exit(0);
} else {
  console.error('\nSome verification checks failed.\n');
  process.exit(1);
}
