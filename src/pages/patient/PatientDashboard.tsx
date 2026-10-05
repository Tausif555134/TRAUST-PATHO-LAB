import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Truck,
  HeartPulse,
  Navigation,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  X,
} from 'lucide-react';
import { dbService, subscribeToDbChanges } from '../../services/db';
import { Booking, MedicalReport, BookingStatus, Review } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';
import { ReportViewerModal } from '../../components/reports/ReportViewerModal';

export const PatientDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'reports' | 'profile'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [selectedBookingForReport, setSelectedBookingForReport] = useState<Booking | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Personal schedule conflict');

  // Rating Modal
  const [ratingModalBooking, setRatingModalBooking] = useState<Booking | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const loadData = async () => {
    try {
      const allBookings = await dbService.getBookings();
      // Match current patient id or show relevant bookings
      const patientBookings = allBookings.filter(
        (b) => b.patientId === currentUser?.id || currentUser?.role === 'patient'
      );
      setBookings(patientBookings);

      const allReports = await dbService.getReports();
      setReports(allReports);
    } catch (err) {
      console.error('Failed to load patient dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDbChanges(() => {
      loadData();
    });
    return unsubscribe;
  }, [currentUser?.id]);

  const upcomingBookings = bookings.filter(
    (b) => b.status !== 'completed' && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  // Status Stepper definition
  const STATUS_STAGES: { key: BookingStatus; label: string; desc: string }[] = [
    { key: 'confirmed', label: 'Confirmed', desc: 'Booking accepted' },
    { key: 'assigned', label: 'Clinician Assigned', desc: 'Professional dispatched' },
    { key: 'on_the_way', label: 'On The Way', desc: 'En route to doorstep' },
    { key: 'arrived', label: 'Arrived', desc: 'At your address' },
    { key: 'in_progress', label: 'In Progress', desc: 'Checkup underway' },
    { key: 'completed', label: 'Completed', desc: 'Report available' },
  ];

  const getStageIndex = (status: BookingStatus) => {
    if (status === 'pending') return 0;
    const idx = STATUS_STAGES.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    await dbService.updateBookingStatus(
      cancelModalBooking.id,
      'cancelled',
      cancelReason,
      currentUser?.fullName || 'Patient'
    );
    setCancelModalBooking(null);
  };

  const handleSubmitReview = async () => {
    if (!ratingModalBooking) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      bookingId: ratingModalBooking.id,
      patientName: ratingModalBooking.patientName,
      serviceName: ratingModalBooking.serviceName,
      rating: ratingStars,
      comment: ratingComment || 'Very professional and compassionate homecare visit!',
      createdAt: new Date().toISOString(),
    };
    await dbService.addReview(newRev);
    setRatingModalBooking(null);
    setRatingComment('');
    alert('Thank you for rating your clinician!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Patient Dashboard Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-2xl flex items-center justify-center border border-brand-200">
              {currentUser?.fullName?.[0] || 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {currentUser?.fullName || 'Rajesh Verma'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Verified Patient
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary Contact: {currentUser?.phone || '+91 98765 43210'} · {currentUser?.email || 'patient@example.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition"
            >
              <Calendar className="w-4 h-4" />
              Book New Home Visit
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
          {[
            { id: 'upcoming', label: `Upcoming Checkups (${upcomingBookings.length})` },
            { id: 'history', label: `Past Appointments (${pastBookings.length})` },
            { id: 'reports', label: `Clinical Reports (${reports.length})` },
            { id: 'profile', label: 'Patient Medical Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: UPCOMING BOOKINGS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            {upcomingBookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <HeartPulse className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base">No upcoming doorstep appointments</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Schedule a verified clinician visit for general checkups, routine diagnostics, or elder care.
                </p>
                <Link
                  to="/book"
                  className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
                >
                  Book a Checkup Now
                </Link>
              </div>
            ) : (
              upcomingBookings.map((b) => {
                const currentStageIdx = getStageIndex(b.status);
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                            {b.bookingCode}
                          </span>
                          <span className="text-xs text-slate-400">
                            Booked on {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                          {b.serviceName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                          Status: {b.status.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => setCancelModalBooking(b)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1 rounded-lg hover:bg-rose-50 border border-rose-200 transition"
                        >
                          Cancel Visit
                        </button>
                      </div>
                    </div>

                    {/* LIVE 6-STAGE TRACKER */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-brand-600" />
                        Live Home Visit Progress
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        {STATUS_STAGES.map((stage, idx) => {
                          const isDone = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div
                              key={stage.key}
                              className={`p-3 rounded-xl border text-center transition ${
                                isCurrent
                                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm ring-2 ring-brand-300'
                                  : isDone
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
                              }`}
                            >
                              <div className="text-[11px] font-bold">
                                {isDone ? '✓ ' : ''}
                                {stage.label}
                              </div>
                              <div className="text-[9px] mt-0.5 opacity-80">{stage.desc}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Visit Metadata & Assigned Professional Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      {/* Schedule */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                          Appointment Slot
                        </div>
                        <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-brand-600" />
                          {b.date}
                        </div>
                        <div className="text-slate-600 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-brand-600" />
                          {b.timeSlot}
                        </div>
                      </div>

                      {/* Destination Address */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                          Doorstep Destination
                        </div>
                        <div className="text-slate-700 leading-snug flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                          <span>
                            {b.address.houseFlat}, {b.address.street}, {b.address.area}, {b.address.city} - {b.address.pinCode}
                          </span>
                        </div>
                        {b.address.landmark && (
                          <div className="text-slate-500 text-[11px]">
                            Landmark: {b.address.landmark}
                          </div>
                        )}
                      </div>

                      {/* Assigned Clinician */}
                      <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-200 space-y-2">
                        <div className="font-bold text-brand-900 uppercase text-[10px] tracking-wider">
                          Assigned Clinician
                        </div>
                        {b.assignedProfessional ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                b.assignedProfessional.profilePhoto ||
                                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={b.assignedProfessional.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-xs">
                                {b.assignedProfessional.name}
                              </div>
                              <div className="text-brand-700 text-[11px]">
                                {b.assignedProfessional.role} · {b.assignedProfessional.qualification}
                              </div>
                              <a
                                href={`tel:${b.assignedProfessional.phone}`}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline mt-1"
                              >
                                <Phone className="w-3 h-3" />
                                Call Clinician
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500 text-xs">
                            <span className="font-semibold text-amber-700">Dispatch Pending:</span>{' '}
                            Operations is assigning the nearest certified professional.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: PAST APPOINTMENTS */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">No past checkup history yet</h4>
              </div>
            ) : (
              pastBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {b.bookingCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          b.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mt-1">{b.serviceName}</h4>
                    <p className="text-xs text-slate-500">
                      Visited on {b.date} ({b.timeSlot}) · ₹{b.price} paid
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === 'completed' && (
                      <>
                        <button
                          onClick={() => {
                            const rep = reports.find((r) => r.bookingId === b.id);
                            if (rep) {
                              setSelectedReport(rep);
                              setSelectedBookingForReport(b);
                            } else {
                              alert('Report processing completed. Generating digital copy...');
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs border border-brand-200 transition flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Report
                        </button>
                        <button
                          onClick={() => setRatingModalBooking(b)}
                          className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Rate Visit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CLINICAL REPORTS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.length === 0 ? (
              <div className="md:col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">No medical reports available</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Once your visiting clinician completes an examination, verified findings and prescriptions appear here.
                </p>
              </div>
            ) : (
              reports.map((rep) => {
                const b = bookings.find((item) => item.id === rep.bookingId);
                return (
                  <div
                    key={rep.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                          {rep.id}
                        </span>
                        <span className="text-xs text-slate-400">{rep.visitDate}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{rep.serviceName}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Attended by: {rep.professionalName} ({rep.professionalRole})
                      </p>

                      {rep.vitals && (
                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                          {rep.vitals.bloodPressure && (
                            <div>
                              <span className="text-slate-400">BP:</span>{' '}
                              <strong className="text-slate-800">{rep.vitals.bloodPressure}</strong>
                            </div>
                          )}
                          {rep.vitals.pulseRate && (
                            <div>
                              <span className="text-slate-400">Pulse:</span>{' '}
                              <strong className="text-slate-800">{rep.vitals.pulseRate} bpm</strong>
                            </div>
                          )}
                          {rep.vitals.spO2 && (
                            <div>
                              <span className="text-slate-400">SpO2:</span>{' '}
                              <strong className="text-slate-800">{rep.vitals.spO2}%</strong>
                            </div>
                          )}
                          {rep.vitals.temperature && (
                            <div>
                              <span className="text-slate-400">Temp:</span>{' '}
                              <strong className="text-slate-800">{rep.vitals.temperature}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Signed & Verified
                      </span>
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setSelectedBookingForReport(b);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View / Print Report
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 4: PATIENT PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Patient Health Profile</h3>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-semibold block">Full Name</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {currentUser?.fullName || 'Rajesh Verma'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Phone</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {currentUser?.phone || '+91 98765 43210'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Email</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {currentUser?.email || 'rajesh.verma@example.com'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Data Encryption</span>
                  <span className="text-emerald-700 font-bold text-sm">AES 256-Bit Secure</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-slate-400 font-semibold block">Emergency Contact</span>
                <span className="text-slate-800 font-medium">
                  +91 98765 43219 (Primary Caregiver / Next of Kin)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CANCEL MODAL */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Cancel Home Visit</h3>
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Are you sure you want to cancel booking{' '}
                <strong>{cancelModalBooking.bookingCode}</strong> ({cancelModalBooking.serviceName})?
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="Personal schedule conflict">Personal schedule conflict</option>
                  <option value="Patient recovered / No longer needed">
                    Patient recovered / No longer needed
                  </option>
                  <option value="Booked another clinic / Emergency visit">
                    Booked another clinic / Emergency visit
                  </option>
                  <option value="Incorrect address entered">Incorrect address entered</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RATING MODAL */}
        {ratingModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Rate Your Clinician Visit</h3>
                <button
                  onClick={() => setRatingModalBooking(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500">
                How was your experience for {ratingModalBooking.serviceName}?
              </p>
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    className="p-1 text-amber-400 transition hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share constructive feedback about punctuality, hygiene, and bedside manner..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-brand-500"
              ></textarea>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRatingModalBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Later
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CLINICAL REPORT VIEWER MODAL */}
        {selectedReport && (
          <ReportViewerModal
            report={selectedReport}
            booking={selectedBookingForReport}
            onClose={() => {
              setSelectedReport(null);
              setSelectedBookingForReport(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};
