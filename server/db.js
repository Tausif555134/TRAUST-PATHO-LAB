import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'trust_patho_lab.sqlite');

export const db = new DatabaseSync(DB_FILE);

// Initialize Tables with strict schemas
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lab_info (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      sl_no INTEGER,
      code TEXT,
      name TEXT NOT NULL,
      full_name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      sample_type TEXT,
      turnaround_time TEXT,
      fasting_required INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      booking_code TEXT UNIQUE NOT NULL,
      patient_name TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      patient_age INTEGER,
      patient_gender TEXT,
      emergency_contact TEXT,
      medical_notes TEXT,
      test_id TEXT NOT NULL,
      test_name TEXT NOT NULL,
      price REAL NOT NULL,
      house_flat TEXT,
      street TEXT,
      area TEXT,
      city TEXT,
      state TEXT,
      pin_code TEXT,
      landmark TEXT,
      instructions TEXT,
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL,
      full_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      ip TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rate_limit_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
  `);

  // Seed Lab Info
  const labInfoSeed = [
    ['name', 'Trust Patho Lab'],
    ['subtitle', 'Pathology Laboratory'],
    ['registration_no', '2291212131723'],
    ['address', 'Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002, Bihar'],
    ['phones', '6206175583, 6299476228, 9142661354'],
    ['whatsapp', '6206175583'],
    ['established', '2024'],
    ['services', 'Haematology, Serology, Hormones, Biochemistry, Fluid Analysis, Histopathology, Immunology, FNAC'],
    ['features', '24/7 service, home sample collection, multi-brand pathological tests'],
    ['disclaimer', 'This report is only for a profession opinion co-relate clinically. Not to be used for medico legal purpose'],
  ];

  const insertInfo = db.prepare('INSERT OR REPLACE INTO lab_info (key, value) VALUES (?, ?)');
  for (const [k, v] of labInfoSeed) {
    insertInfo.run(k, v);
  }

  // Seed Admin User if not exists
  const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('TrustAdmin2024!Secure', salt, 64).toString('hex');
    db.prepare(`
      INSERT INTO admin_users (id, username, password_hash, salt, role, full_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('adm-001', 'admin', hash, salt, 'admin', 'Trust Patho Lab Chief Administrator');
  }

  // Seed All 60 Tests from the Price List Image
  const countStmt = db.prepare('SELECT COUNT(*) as cnt FROM tests');
  const countResult = countStmt.get();
  if (countResult && countResult.cnt === 0) {
    seedTests();
  }
}

// 60 Tests mapped from Price List Image
export const OFFICIAL_PRICE_LIST_TESTS = [
  // Left Column from Image
  { slNo: 1, name: 'CBC', fullName: 'Complete Blood Count (Haemogram)', category: 'Haematology', price: 350, sampleType: 'EDTA Whole Blood', turnaroundTime: 'Same Day (3-4 hrs)', fastingRequired: 0 },
  { slNo: 2, name: 'L.F.T', fullName: 'Liver Function Test (11 Parameters)', category: 'Biochemistry', price: 650, sampleType: 'Serum', turnaroundTime: 'Same Day (4-6 hrs)', fastingRequired: 1 },
  { slNo: 3, name: 'K.F.T', fullName: 'Kidney Function Test / Renal Profile', category: 'Biochemistry', price: 650, sampleType: 'Serum', turnaroundTime: 'Same Day (4-6 hrs)', fastingRequired: 0 },
  { slNo: 4, name: 'Lipid Profile', fullName: 'Complete Lipid Profile (Cholesterol, HDL, LDL, TG)', category: 'Biochemistry', price: 650, sampleType: 'Serum', turnaroundTime: 'Same Day (4-6 hrs)', fastingRequired: 1 },
  { slNo: 5, name: 'HBA1C', fullName: 'Glycated Haemoglobin (3-Month Average Blood Sugar)', category: 'Biochemistry', price: 700, sampleType: 'EDTA Whole Blood', turnaroundTime: 'Same Day (3-4 hrs)', fastingRequired: 0 },
  { slNo: 6, name: 'HIV', fullName: 'HIV 1 & 2 Rapid / 4th Gen ELISA Screening', category: 'Serology', price: 300, sampleType: 'Serum', turnaroundTime: 'Same Day (2 hrs)', fastingRequired: 0 },
  { slNo: 7, name: 'HBSAg', fullName: 'Hepatitis B Surface Antigen Rapid Screen', category: 'Serology', price: 250, sampleType: 'Serum', turnaroundTime: 'Same Day (2 hrs)', fastingRequired: 0 },
  { slNo: 8, name: 'HCV', fullName: 'Hepatitis C Virus Antibody Screening', category: 'Serology', price: 300, sampleType: 'Serum', turnaroundTime: 'Same Day (2 hrs)', fastingRequired: 0 },
  { slNo: 9, name: 'VDRL', fullName: 'VDRL / RPR Syphilis Test', category: 'Serology', price: 150, sampleType: 'Serum', turnaroundTime: 'Same Day (2 hrs)', fastingRequired: 0 },
  { slNo: 10, name: 'T3T4TSH', fullName: 'Complete Thyroid Profile (Total T3, Total T4, TSH)', category: 'Hormones', price: 550, sampleType: 'Serum', turnaroundTime: 'Same Day (4-6 hrs)', fastingRequired: 1 },
  { slNo: 11, name: 'TSH', fullName: 'Thyroid Stimulating Hormone (Ultrasensitive)', category: 'Hormones', price: 300, sampleType: 'Serum', turnaroundTime: 'Same Day (3-4 hrs)', fastingRequired: 1 },
  { slNo: 12, name: 'ABORH', fullName: 'Blood Grouping & Rh Typing', category: 'Haematology', price: 50, sampleType: 'EDTA Whole Blood', turnaroundTime: '1 Hour', fastingRequired: 0 },
  { slNo: 13, name: 'LH', fullName: 'Luteinizing Hormone', category: 'Hormones', price: 600, sampleType: 'Serum', turnaroundTime: 'Same Day', fastingRequired: 0 },
  { slNo: 14, name: 'F.S.H', fullName: 'Follicle Stimulating Hormone', category: 'Hormones', price: 600, sampleType: 'Serum', turnaroundTime: 'Same Day', fastingRequired: 0 },
  { slNo: 15, name: 'PRL', fullName: 'Prolactin Hormone', category: 'Hormones', price: 600, sampleType: 'Serum', turnaroundTime: 'Same Day', fastingRequired: 1 },
  { slNo: 16, name: 'PCOD', fullName: 'PCOD / PCOS Comprehensive Profile', category: 'Hormones', price: 3100, sampleType: 'Serum', turnaroundTime: '24-48 hrs', fastingRequired: 1 },
  { slNo: 17, name: 'A.M.H', fullName: 'Anti-Mullerian Hormone (Ovarian Reserve)', category: 'Hormones', price: 2100, sampleType: 'Serum', turnaroundTime: '24 hrs', fastingRequired: 0 },
  { slNo: 18, name: 'Hb%', fullName: 'Haemoglobin Percentage (Hb%)', category: 'Haematology', price: 50, sampleType: 'EDTA Whole Blood', turnaroundTime: '30 Mins', fastingRequired: 0 },
  { slNo: 19, name: 'BT CT', fullName: 'Bleeding Time & Clotting Time', category: 'Haematology', price: 100, sampleType: 'Fresh Capillary Blood', turnaroundTime: '30 Mins', fastingRequired: 0 },
  { slNo: 20, name: 'S.S - 2', fullName: 'Special Screening Package 2 (Metabolic & Organ)', category: 'Special Profiles', price: 1300, sampleType: 'Blood & Urine', turnaroundTime: 'Same Day', fastingRequired: 1 },
  { slNo: 21, name: 'S.S - 1', fullName: 'Special Screening Package 1 (Basic Health)', category: 'Special Profiles', price: 1000, sampleType: 'Blood & Urine', turnaroundTime: 'Same Day', fastingRequired: 1 },
  { slNo: 22, name: 'S.S - 3', fullName: 'Special Screening Package 3 (Comprehensive)', category: 'Special Profiles', price: 1900, sampleType: 'Blood & Urine', turnaroundTime: 'Same Day', fastingRequired: 1 },
  { slNo: 23, name: 'S.S - 4', fullName: 'Special Screening Package 4 (Executive Master)', category: 'Special Profiles', price: 2400, sampleType: 'Blood & Urine', turnaroundTime: 'Same Day', fastingRequired: 1 },
  { slNo: 24, name: 'UREA', fullName: 'Blood Urea / BUN', category: 'Biochemistry', price: 100, sampleType: 'Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  { slNo: 25, name: 'CREATINE', fullName: 'Serum Creatinine (Renal Marker)', category: 'Biochemistry', price: 100, sampleType: 'Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  { slNo: 26, name: 'URIC ACID', fullName: 'Serum Uric Acid (Gout & Joint Health)', category: 'Biochemistry', price: 150, sampleType: 'Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  // Note: 27 and 28 are missing in original price list image
  { slNo: 29, name: 'SGPT', fullName: 'Serum Glutamic Pyruvic Transaminase (ALT)', category: 'Biochemistry', price: 150, sampleType: 'Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  { slNo: 30, name: 'SGOT', fullName: 'Serum Glutamic Oxaloacetic Transaminase (AST)', category: 'Biochemistry', price: 150, sampleType: 'Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  { slNo: 31, name: 'BILRUBIN', fullName: 'Total, Direct & Indirect Bilirubin', category: 'Biochemistry', price: 150, sampleType: 'Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  { slNo: 32, name: 'URINE R/E', fullName: 'Urine Routine & Microscopic Examination', category: 'Fluid Analysis', price: 100, sampleType: 'Fresh Midstream Urine', turnaroundTime: '1-2 hrs', fastingRequired: 0 },
  { slNo: 33, name: 'URINE C/S', fullName: 'Urine Culture & Antibiotic Sensitivity (Aerobic)', category: 'Fluid Analysis', price: 200, sampleType: 'Sterile Midstream Urine', turnaroundTime: '48-72 hrs', fastingRequired: 0 },

  // Right Column from Image
  { slNo: 36, name: 'BSF', fullName: 'Blood Sugar Fasting (8-10 hrs Fasting)', category: 'Biochemistry', price: 50, sampleType: 'Fluoride Plasma', turnaroundTime: '1-2 hrs', fastingRequired: 1 },
  { slNo: 37, name: 'BSPP', fullName: 'Blood Sugar Post Prandial (2 hrs post meal)', category: 'Biochemistry', price: 50, sampleType: 'Fluoride Plasma', turnaroundTime: '1-2 hrs', fastingRequired: 0 },
  { slNo: 38, name: 'BSR', fullName: 'Blood Sugar Random (Anytime Glucose)', category: 'Biochemistry', price: 50, sampleType: 'Fluoride Plasma', turnaroundTime: 'Instant (15 mins)', fastingRequired: 0 },
  { slNo: 39, name: 'ESR', fullName: 'Erythrocyte Sedimentation Rate (Westergren)', category: 'Haematology', price: 100, sampleType: 'Citrated Blood', turnaroundTime: '2 hrs', fastingRequired: 0 },
  { slNo: 40, name: 'CPR', fullName: 'C-Reactive Protein (CRP Quantitative / Inflammation)', category: 'Immunology', price: 250, sampleType: 'Serum', turnaroundTime: '3-4 hrs', fastingRequired: 0 },
  { slNo: 41, name: 'RA FACTOR', fullName: 'Rheumatoid Arthritis Factor (Quantitative)', category: 'Immunology', price: 200, sampleType: 'Serum', turnaroundTime: '3-4 hrs', fastingRequired: 0 },
  { slNo: 42, name: 'ASO TITER', fullName: 'Anti-Streptolysin O (ASO) Titer', category: 'Immunology', price: 200, sampleType: 'Serum', turnaroundTime: '3-4 hrs', fastingRequired: 0 },
  { slNo: 43, name: 'VITAMIN D', fullName: '25-Hydroxy Vitamin D (Total D2 + D3)', category: 'Biochemistry', price: 1200, sampleType: 'Serum', turnaroundTime: 'Same Day (6 hrs)', fastingRequired: 0 },
  { slNo: 44, name: 'VITAMIN B12', fullName: 'Cyanocobalamin / Active Vitamin B12', category: 'Biochemistry', price: 1000, sampleType: 'Serum', turnaroundTime: 'Same Day (6 hrs)', fastingRequired: 1 },
  { slNo: 45, name: 'IRON PROFILE', fullName: 'Complete Iron Profile (Serum Iron, TIBC, UIBC, % Saturation)', category: 'Biochemistry', price: 700, sampleType: 'Serum', turnaroundTime: 'Same Day (6 hrs)', fastingRequired: 1 },
  { slNo: 46, name: 'TORCH 10', fullName: 'TORCH Profile 10 Parameters (IgG & IgM Panel)', category: 'Serology', price: 2700, sampleType: 'Serum', turnaroundTime: '24-48 hrs', fastingRequired: 0 },
  { slNo: 47, name: 'FNAC', fullName: 'Fine Needle Aspiration Cytology (Palpable Swelling)', category: 'FNAC', price: 1600, sampleType: 'Cytology Aspirate', turnaroundTime: '24-48 hrs', fastingRequired: 0 },
  { slNo: 48, name: 'BIOPSY', fullName: 'Histopathology Biopsy (Small/Medium Tissue)', category: 'Histopathology', price: 1400, sampleType: 'Formalin Tissue', turnaroundTime: '3-5 Days', fastingRequired: 0 },
  { slNo: 49, name: 'WIDAL', fullName: 'Widal Agglutination Slide / Tube Test', category: 'Serology', price: 200, sampleType: 'Serum', turnaroundTime: '2 hrs', fastingRequired: 0 },
  { slNo: 50, name: 'MALARIA', fullName: 'Malaria Antigen Card & Smear Examination (MP)', category: 'Serology', price: 250, sampleType: 'EDTA Whole Blood', turnaroundTime: '1 hr', fastingRequired: 0 },
  { slNo: 51, name: 'TYPHOID', fullName: 'Typhoid IgM / IgG (Typhi Dot Rapid)', category: 'Serology', price: 150, sampleType: 'Serum', turnaroundTime: '1-2 hrs', fastingRequired: 0 },
  { slNo: 52, name: 'AFB(SPOTUM)', fullName: 'Acid Fast Bacilli Stain (Sputum for TB Examination)', category: 'Serology', price: 300, sampleType: 'Early Morning Sputum', turnaroundTime: 'Same Day (4 hrs)', fastingRequired: 0 },
  { slNo: 53, name: 'PBS', fullName: 'Peripheral Blood Smear Examination (Cell Morphology)', category: 'Haematology', price: 300, sampleType: 'EDTA Blood Slide', turnaroundTime: '3 hrs', fastingRequired: 0 },
  { slNo: 54, name: 'FALERIA', fullName: 'Filariasis Antigen / Microfilaria Nocturnal Smear', category: 'Serology', price: 900, sampleType: 'Night Blood Specimen', turnaroundTime: 'Same Day', fastingRequired: 0 },
  { slNo: 55, name: 'FRETTIN', fullName: 'Serum Ferritin (Iron Storage Reserve)', category: 'Biochemistry', price: 500, sampleType: 'Serum', turnaroundTime: '4 hrs', fastingRequired: 0 },
  { slNo: 56, name: 'STOOL R/E', fullName: 'Stool Routine & Microscopic Examination (Ova/Cyst)', category: 'Fluid Analysis', price: 150, sampleType: 'Fresh Stool Specimen', turnaroundTime: '2 hrs', fastingRequired: 0 },
  { slNo: 57, name: 'STOOL C/S', fullName: 'Stool Culture & Sensitivity (Enteric Pathogens)', category: 'Fluid Analysis', price: 300, sampleType: 'Sterile Stool Specimen', turnaroundTime: '48-72 hrs', fastingRequired: 0 },
  { slNo: 58, name: 'ADA', fullName: 'Adenosine Deaminase Activity (Pleural/Ascitic/CSF)', category: 'Fluid Analysis', price: 900, sampleType: 'Body Fluid / Serum', turnaroundTime: '24 hrs', fastingRequired: 0 },
  { slNo: 59, name: 'TB GOLD', fullName: 'Interferon Gamma Release Assay (TB Gold / IGRA)', category: 'Serology', price: 3100, sampleType: 'Special Heparinized Blood', turnaroundTime: '48-72 hrs', fastingRequired: 0 },
  { slNo: 60, name: 'CALCIUM', fullName: 'Total Serum Calcium & Corrected Calcium', category: 'Biochemistry', price: 200, sampleType: 'Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  { slNo: 61, name: 'PAP HPV', fullName: 'Liquid-Based Cervical Cytology with High-Risk HPV DNA', category: 'Histopathology', price: 2500, sampleType: 'Liquid-Based Pap Vial', turnaroundTime: '3-5 Days', fastingRequired: 0 },
  { slNo: 62, name: 'PAP SAMER', fullName: 'Conventional Pap Smear Cervical Cytology', category: 'Histopathology', price: 1900, sampleType: 'Cervical / Vaginal Smear', turnaroundTime: '48 hrs', fastingRequired: 0 },
  { slNo: 63, name: 'ELECTROLYTE', fullName: 'Serum Electrolytes (Sodium, Potassium, Chloride)', category: 'Biochemistry', price: 600, sampleType: 'Plain Serum', turnaroundTime: '2-3 hrs', fastingRequired: 0 },
  { slNo: 64, name: 'IGE TOTAL', fullName: 'Total Serum Immunoglobulin E (Allergy Marker)', category: 'Immunology', price: 1200, sampleType: 'Serum', turnaroundTime: 'Same Day (6 hrs)', fastingRequired: 0 },
  { slNo: 65, name: 'MT(MONTEX)', fullName: 'Mantoux Tuberculin Skin Test (5 TU PPD)', category: 'Serology', price: 300, sampleType: 'Intradermal PPD Injection', turnaroundTime: '48-72 hrs Reading', fastingRequired: 0 },
  { slNo: 66, name: 'HBsAG DNA', fullName: 'Hepatitis B Quantitative Real-Time PCR (Viral Load)', category: 'Serology', price: 6500, sampleType: 'EDTA Plasma', turnaroundTime: '3-5 Days', fastingRequired: 0 },
];

function seedTests() {
  const insertStmt = db.prepare(`
    INSERT INTO tests (id, sl_no, code, name, full_name, category, price, sample_type, turnaround_time, fasting_required, is_available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  for (const t of OFFICIAL_PRICE_LIST_TESTS) {
    const id = `test-${String(t.slNo).padStart(3, '0')}`;
    const code = t.name.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    insertStmt.run(id, t.slNo, code, t.name, t.fullName, t.category, t.price, t.sampleType, t.turnaroundTime, t.fastingRequired);
  }
}

// Parameterized Queries (Strictly Zero SQL Injection Risk)

export function getAllTests({ search = '', category = '', minPrice = 0, maxPrice = 999999 } = {}) {
  let query = 'SELECT * FROM tests WHERE price >= ? AND price <= ?';
  const params = [Number(minPrice) || 0, Number(maxPrice) || 999999];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(String(category));
  }

  if (search && search.trim()) {
    const s = `%${search.trim()}%`;
    query += ' AND (name LIKE ? OR full_name LIKE ? OR code LIKE ?)';
    params.push(s, s, s);
  }

  query += ' ORDER BY sl_no ASC';
  return db.prepare(query).all(...params);
}

export function getTestById(id) {
  if (!id || typeof id !== 'string') return null;
  return db.prepare('SELECT * FROM tests WHERE id = ?').get(id);
}

export function updateTestPrice(id, newPrice) {
  if (!id || typeof id !== 'string') throw new Error('Invalid test ID');
  const priceNum = Number(newPrice);
  if (isNaN(priceNum) || priceNum <= 0) throw new Error('Price must be a valid positive number');

  const stmt = db.prepare('UPDATE tests SET price = ? WHERE id = ?');
  const info = stmt.run(priceNum, id);
  return info.changes > 0;
}

export function createBooking(data) {
  // Input validation
  if (!data.patientName || !data.patientPhone || !data.testId || !data.bookingDate || !data.timeSlot) {
    throw new Error('Missing required booking fields');
  }

  const phoneClean = String(data.patientPhone).replace(/\D/g, '');
  if (phoneClean.length < 10) {
    throw new Error('Invalid phone number: must contain at least 10 digits');
  }

  const id = `bk-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const bookingCode = `TRP-${Math.floor(100000 + Math.random() * 900000)}`;
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO bookings (
      id, booking_code, patient_name, patient_phone, patient_age, patient_gender,
      emergency_contact, medical_notes, test_id, test_name, price,
      house_flat, street, area, city, state, pin_code, landmark, instructions,
      booking_date, time_slot, status, payment_status, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, 'confirmed', 'pending', ?
    )
  `);

  stmt.run(
    id,
    bookingCode,
    String(data.patientName).trim().slice(0, 100),
    phoneClean.slice(0, 15),
    Number(data.patientAge) || 30,
    ['male', 'female', 'other'].includes(data.patientGender) ? data.patientGender : 'other',
    String(data.emergencyContact || phoneClean).slice(0, 20),
    String(data.medicalNotes || '').slice(0, 500),
    String(data.testId).slice(0, 50),
    String(data.testName || 'Laboratory Test').slice(0, 100),
    Number(data.price) || 0,
    String(data.houseFlat || '').slice(0, 100),
    String(data.street || '').slice(0, 100),
    String(data.area || 'Gaya').slice(0, 100),
    String(data.city || 'Gaya').slice(0, 50),
    String(data.state || 'Bihar').slice(0, 50),
    String(data.pinCode || '823002').slice(0, 10),
    String(data.landmark || '').slice(0, 100),
    String(data.instructions || '').slice(0, 300),
    String(data.bookingDate).slice(0, 20),
    String(data.timeSlot).slice(0, 50),
    createdAt
  );

  return { id, bookingCode, createdAt };
}

export function getAllBookings({ limit = 100 } = {}) {
  return db.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?').all(Number(limit) || 100);
}

export function getBookingByCode(code) {
  if (!code || typeof code !== 'string') return null;
  return db.prepare('SELECT * FROM bookings WHERE booking_code = ?').get(code.trim().toUpperCase());
}

export function updateBookingStatus(id, status) {
  const allowed = ['pending', 'confirmed', 'assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'];
  if (!allowed.includes(status)) throw new Error('Invalid status transition');
  const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
  return stmt.run(status, id).changes > 0;
}

export function getLabInfo() {
  const rows = db.prepare('SELECT key, value FROM lab_info').all();
  const obj = {};
  for (const r of rows) {
    obj[r.key] = r.value;
  }
  return obj;
}

export function logAudit(ip, action, details, status) {
  try {
    const stmt = db.prepare('INSERT INTO audit_logs (timestamp, ip, action, details, status) VALUES (?, ?, ?, ?, ?)');
    stmt.run(new Date().toISOString(), String(ip).slice(0, 50), String(action).slice(0, 50), String(details).slice(0, 300), String(status).slice(0, 20));
  } catch (err) {
    console.error('Audit log write error:', err);
  }
}

// Auto-initialize on import
initDatabase();
