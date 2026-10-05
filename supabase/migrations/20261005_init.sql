-- ============================================================================
-- CarePulse Home Healthcare Schema
-- Comprehensive PostgreSQL DDL with Row Level Security (RLS) & Triggers
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'professional', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PATIENTS
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 125),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  phone TEXT NOT NULL,
  email TEXT,
  emergency_contact TEXT NOT NULL,
  medical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROFESSIONALS
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Lab Technician', 'Physiotherapist', 'Elderly Care Specialist')),
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 1 CHECK (experience_years >= 0),
  service_area TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  total_visits INTEGER NOT NULL DEFAULT 0 CHECK (total_visits >= 0),
  profile_photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  preparation_instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROFESSIONAL_SERVICES (Many-to-Many junction)
CREATE TABLE IF NOT EXISTS public.professional_services (
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (professional_id, service_id)
);

-- 6. AVAILABILITY
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  house_flat TEXT NOT NULL,
  street TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code VARCHAR(10) NOT NULL,
  landmark TEXT,
  instructions TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_gender TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  medical_notes TEXT,
  service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
  service_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  address JSONB NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled')
  ),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'success', 'failed', 'refunded')
  ),
  payment_id TEXT,
  assigned_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BOOKING_STATUS_HISTORY (Audit Log)
CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  method TEXT NOT NULL CHECK (method IN ('card', 'upi', 'netbanking', 'cash_on_visit')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  gateway_transaction_id TEXT,
  signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. REPORTS (Clinical findings & prescriptions)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  professional_name TEXT NOT NULL,
  professional_role TEXT NOT NULL,
  service_name TEXT NOT NULL,
  visit_date DATE NOT NULL,
  vitals JSONB DEFAULT '{}'::jsonb,
  observations TEXT NOT NULL,
  prescriptions JSONB DEFAULT '[]'::jsonb,
  doctor_notes TEXT,
  file_url TEXT,
  file_name TEXT,
  verified_signature BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'professional', 'report', 'system', 'cancellation')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_patient ON public.bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pro ON public.bookings(assigned_professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reports_booking ON public.reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================================================
-- AUTOMATED STATUS HISTORY TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION record_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_history (
      booking_id,
      from_status,
      to_status,
      updated_by,
      notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      'system_trigger',
      NEW.cancellation_reason
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_status_history ON public.bookings;
CREATE TRIGGER trg_booking_status_history
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION record_booking_status_change();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Services are publicly readable
CREATE POLICY "Public services read" ON public.services FOR SELECT USING (true);

-- Patients can access only their records
CREATE POLICY "Patients view own data" ON public.patients
  FOR ALL USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Bookings access policy
CREATE POLICY "Patients view own bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.patients WHERE id = patient_id)
    OR auth.uid() IN (SELECT user_id FROM public.professionals WHERE id = assigned_professional_id)
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Reports access policy
CREATE POLICY "Reports strictly private" ON public.reports
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.patients WHERE id = patient_id)
    OR auth.uid() IN (SELECT user_id FROM public.professionals WHERE id = professional_id)
    OR auth.jwt() ->> 'role' = 'admin'
  );
