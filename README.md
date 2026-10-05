# CarePulse — Home Healthcare & Doorstep Checkup Webpage

A modern, responsive, pure **Frontend Web Application** for home healthcare checkup booking built with **React 18**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Overview

CarePulse is a clean, client-side healthcare platform designed for high performance, smooth interactivity, and zero backend friction. All data flows, state changes, and booking workflows are managed on the frontend.

### Frontend Pages & Features:
1. **Landing Page (`HomePage.tsx`)**:
   - Healthcare hero banner with 45-minute rapid doctor dispatch badge.
   - Trust and safety highlights (verified clinicians, cold-chain transport, transparent pricing).
   - Dynamic clinical catalog with live search and category filtering.
   - 4-step "How It Works" visual breakdown.
   - Patient testimonials and emergency disclaimers (108 / 102).
2. **Service Details (`ServiceDetailsPage.tsx`)**:
   - In-depth clinical inclusions and patient preparation warnings.
   - Interactive 7-day date selector and 1-hour time slot picker.
3. **5-Step Booking Wizard (`BookingPage.tsx`)**:
   - Step 1: Service selection and price review.
   - Step 2: Patient demographics, emergency contact, and medical history.
   - Step 3: Doorstep address with **Auto-Detect GPS Landmark** capability.
   - Step 4: Schedule selection with **Double-Booking Prevention**.
   - Step 5: Review and payment simulation with decline edge-case toggle.
4. **Patient Dashboard (`PatientDashboard.tsx`)**:
   - Live **6-stage visit tracker** (`Confirmed` → `Clinician Assigned` → `On The Way` → `Arrived` → `In Progress` → `Completed`).
   - Assigned clinician card with direct call trigger.
   - Self-serve cancellation modal.
   - Official Clinical Report Viewer with browser **Print & PDF export**.
   - 5-star rating submission modal.
5. **Clinician Portal (`ProfessionalDashboard.tsx`)**:
   - Assigned visit routes with Google Maps navigation links.
   - Step-by-step visit progress updater.
   - Bedside Vitals input (BP, Pulse, SpO2, Temp, Glucose) & Rx prescription builder.
6. **Operations Command Center (`AdminDashboard.tsx`)**:
   - Executive metrics, booking dispatch table, clinician manager, service catalog CRUD, and analytics.
7. **1-Click Persona Simulator**:
   - Switch between Patient (Rajesh), Doctor (Dr. Aisha), Nurse (Sister Sunita), and Admin Console instantly.

---

## 🚀 How to Run

```bash
# Start Vite development server
npm run dev

# Run automated frontend test suite
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router 6
