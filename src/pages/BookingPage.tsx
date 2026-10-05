import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Navigation,
  FileText,
  Lock,
} from 'lucide-react';
import { dbService } from '../services/db';
import { Service, Booking, Address, Patient } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { paymentService } from '../features/payments/paymentService';

interface BookingPageProps {
  onOpenAuthModal: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onOpenAuthModal }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Existing bookings to verify slot double-booking
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Step 2: Patient Info
  const [patientInfo, setPatientInfo] = useState({
    fullName: currentUser?.fullName || 'Rajesh Verma',
    age: 48,
    gender: 'male' as 'male' | 'female' | 'other',
    phone: currentUser?.phone || '+91 98765 43210',
    email: currentUser?.email || 'rajesh.verma@example.com',
    emergencyContact: '+91 98765 43219 (Wife: Sunita)',
    medicalNotes: 'Type-2 Diabetes under routine Metformin.',
  });

  // Step 3: Address
  const [address, setAddress] = useState<Address>({
    houseFlat: 'Flat 402, Greenfield Meadows',
    street: '14th Cross Road',
    area: 'Indira Nagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560038',
    landmark: 'Near BDA Complex & Cafe Coffee Day',
    instructions: 'Ring bell twice; lift available on the left.',
  });

  // Step 4: Date & Slot
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(
    searchParams.get('date') || tomorrowStr
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    searchParams.get('slot') || '09:00 AM - 10:00 AM'
  );

  // Step 5: Payment method & submission
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cash_on_visit'>('upi');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allSlots = [
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM',
  ];

  // Fetch Services & Bookings
  useEffect(() => {
    const init = async () => {
      try {
        const [loadedServices, loadedBookings] = await Promise.all([
          dbService.getServices(),
          dbService.getBookings(),
        ]);
        setServices(loadedServices.filter((s) => s.isActive));
        setExistingBookings(loadedBookings);

        const urlServiceId = searchParams.get('serviceId');
        if (urlServiceId) {
          const match = loadedServices.find((s) => s.id === urlServiceId);
          if (match) setSelectedService(match);
        } else if (loadedServices.length > 0) {
          setSelectedService(loadedServices[0]);
        }
      } catch (err) {
        console.error('Failed to load services for booking wizard:', err);
      }
    };
    init();
  }, [searchParams]);

  // Sync current user info if profile updates
  useEffect(() => {
    if (currentUser) {
      setPatientInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.fullName,
        email: prev.email || currentUser.email,
        phone: prev.phone || currentUser.phone,
      }));
    }
  }, [currentUser]);

  // Check if a time slot is already taken on selected date for the selected service
  const isSlotBooked = (slot: string, date: string): boolean => {
    if (!selectedService) return false;
    return existingBookings.some(
      (b) =>
        b.serviceId === selectedService.id &&
        b.date === date &&
        b.timeSlot === slot &&
        b.status !== 'cancelled'
    );
  };

  // GPS auto-locate mockup
  const handleAutoLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setAddress((prev) => ({
            ...prev,
            landmark: 'Auto-detected near current GPS coordinates',
            instructions: 'GPS Pin matched accurately within 15 meters',
          }));
        },
        () => {
          setAddress((prev) => ({
            ...prev,
            landmark: 'Indira Nagar Metro Station Gate 1',
          }));
        }
      );
    }
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!selectedService) {
        setErrorMessage('Please select a healthcare service to proceed.');
        return false;
      }
    }
    if (step === 2) {
      if (!patientInfo.fullName.trim()) {
        setErrorMessage('Patient full name is required.');
        return false;
      }
      if (!patientInfo.phone.trim() || patientInfo.phone.length < 10) {
        setErrorMessage('Valid 10-digit phone number is required.');
        return false;
      }
      if (patientInfo.age <= 0 || patientInfo.age > 125) {
        setErrorMessage('Please provide a valid patient age.');
        return false;
      }
      if (!patientInfo.emergencyContact.trim()) {
        setErrorMessage('Emergency contact number is required for patient safety.');
        return false;
      }
    }
    if (step === 3) {
      if (!address.houseFlat.trim() || !address.street.trim() || !address.city.trim()) {
        setErrorMessage('House number, street name, and city are mandatory.');
        return false;
      }
      if (!address.pinCode.trim() || !/^\d{6}$/.test(address.pinCode.trim())) {
        setErrorMessage('Please enter a valid 6-digit postal PIN code.');
        return false;
      }
    }
    if (step === 4) {
      if (!selectedDate) {
        setErrorMessage('Please choose an appointment date.');
        return false;
      }
      if (isSlotBooked(selectedSlot, selectedDate)) {
        setErrorMessage('Selected time slot is already fully booked. Please select an alternate slot.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4 && !isAuthenticated) {
        // Prompt login/signup modal before review/payment
        onOpenAuthModal();
        return;
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => prev - 1);
  };

  // Confirm Booking and Process Payment
  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    if (isSubmitting) return; // Prevent duplicate submission
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Process payment through payment service abstraction
      const paymentRes = await paymentService.processPayment(
        {
          bookingId: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: selectedService.price,
          patientName: patientInfo.fullName,
          patientEmail: patientInfo.email,
          patientPhone: patientInfo.phone,
          serviceName: selectedService.name,
        },
        paymentMethod,
        simulateFailure
      );

      if (!paymentRes.success) {
        throw new Error(paymentRes.error || 'Payment failed. Please retry.');
      }

      // 2. Generate unique booking
      const newBookingId = `book-${Date.now()}`;
      const bookingCode = `CP-${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking: Booking = {
        id: newBookingId,
        bookingCode,
        patientId: currentUser?.id || 'pat-1',
        patientName: patientInfo.fullName,
        patientPhone: patientInfo.phone,
        patientAge: Number(patientInfo.age),
        patientGender: patientInfo.gender,
        emergencyContact: patientInfo.emergencyContact,
        medicalNotes: patientInfo.medicalNotes,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        serviceCategory: selectedService.category,
        address,
        date: selectedDate,
        timeSlot: selectedSlot,
        price: selectedService.price,
        status: 'confirmed',
        paymentStatus: paymentMethod === 'cash_on_visit' ? 'pending' : 'success',
        paymentId: paymentRes.paymentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 3. Persist to DB
      await dbService.createBooking(newBooking);

      // 4. Navigate to Patient Dashboard with newly booked highlight
      navigate(`/patient/dashboard?newBookingId=${newBookingId}`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() + (i + 1) * 86400000);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Wizard Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            CarePulse Doorstep Checkup Booking
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Book Healthcare at Home
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Follow the 5 simple steps below to schedule a verified clinician visit.
          </p>
        </div>

        {/* Wizard Steps Stepper */}
        <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, title: 'Service' },
              { num: 2, title: 'Patient' },
              { num: 3, title: 'Address' },
              { num: 4, title: 'Schedule' },
              { num: 5, title: 'Review & Pay' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      currentStep === step.num
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30 ring-2 ring-brand-300'
                        : currentStep > step.num
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                      currentStep === step.num ? 'text-brand-700' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded ${
                      currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Validation Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <span className="font-bold">Please check: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Wizard Step Containers */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          {/* STEP 1: SELECT SERVICE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Step 1 — Choose Healthcare Service</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select the checkup or clinical procedure to be performed at your home.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s) => {
                  const isSelected = selectedService?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                            {s.category}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {s.durationMinutes}m
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-base font-extrabold text-slate-900">₹{s.price}</span>
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-brand-700' : 'text-slate-400'
                          }`}
                        >
                          {isSelected ? '✓ Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PATIENT INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Step 2 — Patient Information</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Provide demographic and emergency details for the attending healthcare professional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientInfo.fullName}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, fullName: e.target.value })
                    }
                    placeholder="e.g. Rajesh Verma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={patientInfo.age}
                      onChange={(e) =>
                        setPatientInfo({ ...patientInfo, age: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={patientInfo.gender}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          gender: e.target.value as 'male' | 'female' | 'other',
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientInfo.phone}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={patientInfo.email}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, email: e.target.value })
                    }
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Contact Name & Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientInfo.emergencyContact}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, emergencyContact: e.target.value })
                    }
                    placeholder="+91 98765 43219 (Spouse / Relative Name)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pre-existing Conditions / Medical Notes
                  </label>
                  <textarea
                    rows={2}
                    value={patientInfo.medicalNotes}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, medicalNotes: e.target.value })
                    }
                    placeholder="e.g. Diabetes, Hypertension, past surgeries, or allergies..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DOORSTEP ADDRESS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 3 — Doorstep Address</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Where should the healthcare professional visit?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoLocation}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold border border-brand-200 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Auto-Detect GPS Landmark
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    House / Flat / Building No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.houseFlat}
                    onChange={(e) => setAddress({ ...address, houseFlat: e.target.value })}
                    placeholder="e.g. Flat 402, Greenfield Meadows"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street / Road / Colony *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="e.g. 14th Cross Road"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Area / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                    placeholder="e.g. Indira Nagar"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pinCode}
                    onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                    placeholder="e.g. 560038"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    value={address.landmark || ''}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="e.g. Near BDA Complex & Cafe Coffee Day"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Entry / Security Instructions
                  </label>
                  <input
                    type="text"
                    value={address.instructions || ''}
                    onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                    placeholder="e.g. Ring bell twice; lift available on the left."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DATE & AVAILABLE TIME SLOT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Step 4 — Select Date & Time Slot</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Only available slots are shown. Double bookings are automatically prevented.
                </p>
              </div>

              {/* Date selection cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Available Dates
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {nextDates.map((item) => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setSelectedDate(item.iso)}
                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold opacity-80">
                          {item.dayName}
                        </span>
                        <span className="text-base font-extrabold">{item.dateNum}</span>
                        <span className="text-[10px] opacity-70">{item.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Time Slots for {selectedDate}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allSlots.map((slot) => {
                    const booked = isSlotBooked(slot, selectedDate);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                          booked
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-brand-50 border-brand-600 text-brand-800 ring-1 ring-brand-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {slot}
                        </span>
                        <span className="text-[10px] uppercase">
                          {booked ? 'Booked' : isSelected ? '✓ Selected' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PAYMENT GATEWAY */}
          {currentStep === 5 && selectedService && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Step 5 — Review & Confirm Booking</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verify your doorstep appointment details and select payment option.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Service & Schedule
                  </h4>
                  <div className="font-bold text-sm text-slate-900">{selectedService.name}</div>
                  <div className="text-slate-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    Date: {selectedDate} ({selectedSlot})
                  </div>
                  <div className="text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    Duration: ~{selectedService.durationMinutes} minutes
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Patient & Destination
                  </h4>
                  <div className="font-bold text-sm text-slate-900">{patientInfo.fullName}</div>
                  <div className="text-slate-600">
                    Phone: {patientInfo.phone} · Emergency: {patientInfo.emergencyContact}
                  </div>
                  <div className="text-slate-600 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      {address.houseFlat}, {address.street}, {address.area}, {address.city} -{' '}
                      {address.pinCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  Select Payment Method
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR Code' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'netbanking', label: 'Net Banking' },
                    { id: 'cash_on_visit', label: 'Pay on Visit' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                        paymentMethod === method.id
                          ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* Edge case toggle test */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Simulate Bank Decline / Gateway Error (Edge case test)</span>
                  </label>
                  <span className="text-emerald-700 font-medium">SSL 256-Bit Secure</span>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-brand-800 font-semibold block">Total Amount Payable</span>
                  <span className="text-2xl font-black text-brand-900">₹{selectedService.price}</span>
                  <span className="text-[10px] text-brand-700 block">Includes doorstep clinical dispatch & PPE</span>
                </div>
                <div className="text-right text-xs text-brand-800 font-medium">
                  Verified Clinician Assigned Upon Confirmation
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : (
              <Link
                to="/"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel Booking
              </Link>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition active:scale-95"
              >
                Continue to Step {currentStep + 1}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-lg shadow-emerald-500/25 transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Confirming Visit...'
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Confirm Booking & Pay ₹{selectedService?.price}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
