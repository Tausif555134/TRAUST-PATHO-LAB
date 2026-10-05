-- ============================================================================
-- CarePulse Database Initial Seed Data
-- ============================================================================

INSERT INTO public.services (id, name, category, description, inclusions, duration_minutes, price, preparation_instructions, popular, is_active, image_url)
VALUES
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a1',
  'General Health Checkup',
  'Full Body & Preventive',
  'Comprehensive physical examination and vital signs review conducted in the privacy and comfort of your home by a licensed clinician.',
  '["Complete vitals check (BP, SpO2, Heart Rate, Temperature, BMI)", "Systematic organ evaluation (Chest, Abdomen, ENT)", "Lifestyle & metabolic risk profiling", "Clinical consultation & digital report summary"]'::jsonb,
  45,
  699.00,
  '["Keep past medical records, prescriptions, and recent lab reports ready.", "Ensure a quiet, well-lit room for examination.", "Avoid heavy caffeine consumption 1 hour prior to visit."]'::jsonb,
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
),
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a2',
  'Blood Sample Collection',
  'Diagnostic & Lab',
  'Painless, certified phlebotomy service at your doorstep using vacutainer tubes and strict cold-chain sample preservation transport.',
  '["Doorstep sample collection by certified phlebotomist", "Barcoded, sterile vacuum tubes for zero-contamination", "Temperature-controlled cold-chain specimen transit", "Digital laboratory report delivered within 12-24 hours"]'::jsonb,
  20,
  249.00,
  '["Overnight fasting (10-12 hours) recommended if getting Fasting Sugar or Lipid profile.", "Drink 1-2 glasses of plain water before collection to ease venipuncture.", "Rest comfortably 5 minutes before the phlebotomist arrives."]'::jsonb,
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
),
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a3',
  'Blood Pressure Check & Monitoring',
  'Vitals & Routine',
  'Accurate clinical blood pressure assessment, multiple posture readings, and cardiovascular guidance by a qualified nurse.',
  '["Triplicate calibrated BP measurements in sitting and lying postures", "Pulse rhythm and regularity assessment", "Cardiovascular lifestyle counselling", "Hypertension tracking chart provided"]'::jsonb,
  20,
  199.00,
  '["Sit comfortably and relax for at least 10 minutes before the appointment.", "Avoid smoking, exercise, and caffeine for 30 minutes prior.", "Keep your current anti-hypertensive medication names handy."]'::jsonb,
  FALSE,
  TRUE,
  'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80'
),
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a4',
  'Blood Sugar Test (Fasting & PP)',
  'Diagnostic & Lab',
  'Instant bedside blood glucose screening (Fasting, Random, or Post-Prandial) with immediate digital record generation.',
  '["Laboratory-grade glucometer testing with fresh sterile lancet", "Pre-meal and post-meal glucose recording", "Dietary and hypoglycaemia safety advice", "Instant result documentation"]'::jsonb,
  15,
  149.00,
  '["For fasting test: 8-10 hours fasting without food or milk.", "For PP test: Exactly 2 hours after starting your meal.", "Notify the clinician of current insulin or oral hypoglycaemic dosages."]'::jsonb,
  FALSE,
  TRUE,
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
),
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a5',
  '12-Lead ECG at Home',
  'Cardiac & Special',
  'Hospital-grade 12-lead portable Electrocardiogram conducted in bed, with instantaneous cardiologist-reviewed interpretation report.',
  '["Full 12-lead diagnostic portable ECG procedure", "Conducted by trained cardiac emergency technician", "Instant digitized tracing with remote cardiologist sign-off", "Immediate referral protocol if acute rhythm anomalies detected"]'::jsonb,
  30,
  799.00,
  '["Wear loose, two-piece clothing for easy electrode placement.", "Avoid applying skin lotions, creams, or oils on chest and limbs.", "Remove metallic jewellery or watches before the test."]'::jsonb,
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
),
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a6',
  'Elderly Health & Mobility Checkup',
  'Geriatric Care',
  'Specialized geriatric wellness visit focused on dementia screening, fall risk assessment, polypharmacy review, and joint mobility.',
  '["Comprehensive functional mobility and fall-risk audit", "Memory and cognitive baseline screening", "Medication cross-interaction review", "Home safety hazard recommendations for family caregivers"]'::jsonb,
  60,
  999.00,
  '["A primary family member or caregiver is requested to be present.", "Keep all ongoing daily medication boxes visible on a table.", "Prepare list of past surgeries, hospitalizations, and mobility aids used."]'::jsonb,
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80'
),
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a7',
  'Doctor Home Visit (General Physician)',
  'Doctor Consultations',
  'Thorough in-person home visit by an MD/MBBS doctor for acute illnesses, chronic disease follow-ups, and doorstep treatment planning.',
  '["In-depth 45-minute clinical bedside consultation", "Physical examination, chest auscultation, abdominal palpation", "Prescription writing with drug dosages & dietary instructions", "Referral or escalation guidance if secondary care is required"]'::jsonb,
  45,
  1199.00,
  '["List all current symptoms in sequence of onset.", "Have past surgical notes and discharge summaries accessible.", "Ensure patient is in a comfortable resting position."]'::jsonb,
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
),
(
  'e2d63f90-1c50-48e0-bb15-08149f12d8a8',
  'Nursing Visit (Wound Dressing & Injections)',
  'Nursing & Procedures',
  'Skilled nursing intervention for post-surgical sterile wound dressing, IV/IM injections, catheter management, or nebulization.',
  '["Aseptic wound dressing using hospital-grade sterile kit", "Prescribed IV/IM/Subcutaneous injection administration", "Catheter care or tracheostomy hygiene assistance", "Bedside vitals and recovery stage assessment"]'::jsonb,
  40,
  499.00,
  '["Valid doctor prescription for medication or dressing must be provided.", "Keep sterile dressing consumables or prescribed ampoules ready.", "Maintain clean, sanitized handwashing facility for the visiting nurse."]'::jsonb,
  FALSE,
  TRUE,
  'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;
