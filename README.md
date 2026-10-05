# CarePulse — Home Healthcare & Doorstep Checkup Platform

A modern, production-grade, end-to-end **Home Healthcare / Doorstep Checkup Booking Platform** built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## 🌟 Key Capabilities & Features

### 1. Patient Portal & Booking Experience
- **Interactive Landing Page**:
  - Hero with high-resolution clinical visuals and 45-minute rapid doctor dispatch badge.
  - Trust section: verified clinicians, transparent pricing, flexible scheduling, secure data, cold-chain transport.
  - Dynamically loaded services catalog with live category filtering and search.
  - 4-step "How It Works" visual breakdown.
  - Verified patient testimonials and 24/7 hotline banner.
- **Service Details View**:
  - Dynamic loading from Supabase / reactive database.
  - Comprehensive clinical inclusions and preparation instructions.
  - Interactive calendar date selector & real-time time slot selector.
- **5-Step Booking Wizard**:
  - **Step 1**: Select Service & price review.
  - **Step 2**: Patient Information (Name, Age, Gender, Phone, Email, Emergency Contact, Pre-existing conditions).
  - **Step 3**: Doorstep Address with **Auto-Detect GPS Landmark** capability and entry instructions.
  - **Step 4**: Date & 1-Hour Time Slot selection with **Double-Booking Prevention**.
  - **Step 5**: Review & Payment gateway modal (Card, UPI, Netbanking, Pay on Visit) with simulated server-side signature verification and bank decline edge case testing.
- **Patient Dashboard**:
  - Live **6-Stage Status Tracker**: `Confirmed` → `Clinician Assigned` → `On The Way` → `Arrived` → `In Progress` → `Completed`.
  - Assigned clinician card with direct "Call Clinician" action.
  - Self-serve cancellation modal with clinical reason capture.
  - Official Clinical Report Viewer with browser Print & PDF export.
  - Post-visit 5-star rating & feedback modal.

---

### 2. Healthcare Professional / Clinician Portal
- Separate interface for Doctors, Registered Nurses, Phlebotomists, and Geriatric Specialists.
- **Assigned Visits Management**:
  - Today's and upcoming appointments.
  - Patient demographics, medical notes, and destination address.
  - 1-click **Open GPS Route** link directly into Google Maps navigation.
- **Sequential Visit Actions**:
  - `Accept Visit` → `Mark On The Way` → `Mark Arrived at Doorstep` → `Start Visit` → `Record Vitals & Complete`.
- **Bedside Findings & Prescription Builder**:
  - Record vital signs: Blood Pressure (mmHg), Pulse (bpm), SpO2 (%), Temperature (°F), Blood Glucose (mg/dL).
  - Clinical examination notes.
  - Multi-item Rx Prescription builder (Medicine name, dosage, frequency, duration, special instructions).
  - Digital signature verification stamp.

---

### 3. Operations & Admin Command Center
- **Executive Metric Cards**: Total Bookings, Today's Visits, Pending Dispatch Alert, Completed Visits, Active On-Duty Clinicians, Gross Platform Revenue.
- **Booking & Dispatch Management**:
  - Searchable by code, patient name, procedure, or city.
  - Filterable by booking status.
  - 1-click clinician dispatch and reassignment modal.
  - Manual appointment status selector.
- **Clinician Management**:
  - Onboard new healthcare professionals (Name, Role, Experience, Qualifications, Operating Zone).
  - Toggle duty availability (`On Duty` / `Off Duty`).
  - Edit clinician profile details.
- **Service Catalog Management**:
  - Create and edit clinical service packages, set fees, durations, inclusions, and preparation guidelines.
- **Financial & Analytics Reports**:
  - Revenue breakdowns, completion rates, cancellation rates, and most-booked services analytics.
- **1-Click Demo Reset**: Pristine reset button to re-initialize demo datasets at any time.

---

### 4. 1-Click Persona Simulator
Located in the top header bar, allowing evaluators to switch personas instantly:
- **Rajesh Verma**: Patient with active upcoming doorstep visits.
- **Dr. Aisha Sharma, MD**: Attending physician with consultation routes.
- **Sister Sunita Rao, B.Sc Nursing**: Registered nurse for wound dressings & injections.
- **Operations Admin**: Hospital dispatch command center.
- **Guest Mode**: Browsing experience with automatic login prompts on booking.

---

## 🗄️ Database Architecture & Supabase DDL

The database is defined in `supabase/migrations/20261005_init.sql` and seeded in `supabase/seed.sql`:

1. `profiles`: Extends `auth.users` with role-based metadata (`patient`, `professional`, `admin`).
2. `patients`: Demographic profile, age, gender, emergency contacts, medical history.
3. `professionals`: Clinician registry, licenses, experience, zone coverage, on-duty status.
4. `services`: Catalog of clinical checkups, prices, durations, preparation instructions.
5. `professional_services`: Junction table for clinician service qualifications.
6. `availability`: Day-of-week and time slot scheduling windows.
7. `addresses`: Patient doorstep locations, GPS coordinates, landmarks.
8. `bookings`: Complete visit lifecycle from creation to sign-off.
9. `booking_status_history`: Automated audit log via PostgreSQL trigger `record_booking_status_change`.
10. `payments`: Payment records, gateway transaction IDs, and cryptographic signatures.
11. `reports`: Verified medical summaries, bedside vitals, and prescription items.
12. `notifications`: Real-time alerts for patients, clinicians, and operations.
13. `reviews`: Patient satisfaction ratings and feedback.

**Security**: Strict **Row Level Security (RLS)** ensures patients access only their data, clinicians see only assigned patients, and administrators have monitored operational oversight.

---

## 🚀 Running the Platform

All commands can be run either from the project root or inside `carepulse/`:

```bash
# From workspace root:
npm run carepulse:dev       # Start Vite development server
npm run carepulse:build     # Run TypeScript check & production build
npm run carepulse:test      # Execute 49-point automated test suite
npm run carepulse:preview   # Preview production bundle

# Or from inside carepulse/:
cd carepulse
npm run dev
npm run build
npm test
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` inside `carepulse/`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder
VITE_HOTLINE_PHONE=1800-CARE-PULSE
```

*Note: If Supabase keys are left empty, the application automatically activates its rich reactive offline local storage engine, permitting 100% of workflows, dispatching, and report viewing to work out-of-the-box.*
