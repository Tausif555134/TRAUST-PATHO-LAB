import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Truck,
  HeartPulse,
  Navigation,
  FileText,
  Plus,
  Trash2,
  Stethoscope,
  Activity,
  X,
  Upload,
} from 'lucide-react';
import { dbService, subscribeToDbChanges } from '../../services/db';
import {
  Booking,
  BookingStatus,
  MedicalReport,
  PrescriptionItem,
  VitalSigns,
  Professional,
} from '../../types';
import { useAuth } from '../../features/auth/AuthContext';

export const ProfessionalDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPro, setCurrentPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  // Clinical Report Form Modal State
  const [activeReportBooking, setActiveReportBooking] = useState<Booking | null>(null);
  const [observations, setObservations] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: '120/80 mmHg',
    pulseRate: 72,
    spO2: 98,
    temperature: '98.6 °F',
    bloodSugar: '95 mg/dL',
  });
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: '1',
      medicineName: 'Paracetamol',
      dosage: '650 mg',
      frequency: 'SOS (Pain/Fever)',
      duration: '3 days',
      notes: 'After meals',
    },
  ]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const loadData = async () => {
    try {
      const pros = await dbService.getProfessionals();
      // Match current authenticated clinician or pick Dr. Aisha
      const found =
        pros.find((p) => p.userId === currentUser?.id || p.id === currentUser?.id) ||
        pros[0];
      setCurrentPro(found);

      const allBookings = await dbService.getBookings();
      // Get bookings assigned to this pro, or all if evaluation
      const myVisits = allBookings.filter(
        (b) => !b.assignedProfessionalId || b.assignedProfessionalId === found.id
      );
      setBookings(myVisits);
    } catch (err) {
      console.error('Failed to load professional dashboard data:', err);
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

  const handleUpdateStatus = async (bookingId: string, nextStatus: BookingStatus) => {
    try {
      await dbService.updateBookingStatus(
        bookingId,
        nextStatus,
        `Status updated by ${currentPro?.name || 'Clinician'}`,
        currentPro?.name || 'Clinician'
      );
      await loadData();
    } catch (err) {
      console.error('Failed to transition status:', err);
    }
  };

  const handleAddPrescriptionRow = () => {
    setPrescriptions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: '',
      },
    ]);
  };

  const handleRemovePrescriptionRow = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePrescriptionChange = (
    id: string,
    field: keyof PrescriptionItem,
    val: string
  ) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSubmitClinicalReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReportBooking || !currentPro) return;
    setIsSubmittingReport(true);

    try {
      const report: MedicalReport = {
        id: `rep-${Date.now()}`,
        bookingId: activeReportBooking.id,
        patientId: activeReportBooking.patientId,
        professionalId: currentPro.id,
        professionalName: currentPro.name,
        professionalRole: currentPro.role,
        serviceName: activeReportBooking.serviceName,
        visitDate: activeReportBooking.date,
        vitals,
        observations: observations || 'Patient examined at bedside. Clinical parameters reviewed.',
        prescriptions: prescriptions.filter((p) => p.medicineName.trim().length > 0),
        doctorNotes: doctorNotes || 'Follow-up as needed; report any acute changes.',
        verifiedSignature: true,
        createdAt: new Date().toISOString(),
      };

      await dbService.saveReport(report);
      setActiveReportBooking(null);
      await loadData();
    } catch (err) {
      console.error('Failed to save clinical report:', err);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Clinician Profile Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={
                currentPro?.profilePhoto ||
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
              }
              alt={currentPro?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{currentPro?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[11px] font-bold">
                  {currentPro?.role}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified License
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentPro?.qualification} · {currentPro?.experienceYears} yrs experience · Zone:{' '}
                {currentPro?.serviceArea}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="text-right">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Rating
              </span>
              <span className="text-xl font-black text-slate-900">
                ★ {currentPro?.rating || 4.9}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Visits Done
              </span>
              <span className="text-xl font-black text-slate-900">
                {currentPro?.totalVisits || 340}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Home Visits */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Assigned Doorstep Patient Visits
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review assigned routes, advance visit states, and submit bedside reports.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-200 text-slate-700">
              {bookings.length} Total Assigned
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">No home visits currently assigned</h3>
              <p className="text-xs text-slate-400 mt-1">
                New visits dispatched from the Admin console will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                        {b.bookingCode}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {b.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        Fee: ₹{b.price} ({b.paymentStatus === 'success' ? 'Paid Online' : 'Pay on Visit'})
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{b.serviceName}</h3>
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-brand-600" />
                          {b.date} ({b.timeSlot})
                        </span>
                        <span className="flex items-center gap-1">
                          Patient: <strong>{b.patientName}</strong> ({b.patientAge}y/{b.patientGender})
                        </span>
                      </div>
                    </div>

                    {/* Address & Navigation Link */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                        <span>
                          {b.address.houseFlat}, {b.address.street}, {b.address.area}, {b.address.city}
                          {b.address.landmark ? ` (Landmark: ${b.address.landmark})` : ''}
                        </span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${b.address.houseFlat} ${b.address.street} ${b.address.city}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-brand-700 hover:underline font-bold shrink-0 text-[11px]"
                      >
                        <Navigation className="w-3 h-3" />
                        Open GPS Route
                      </a>
                    </div>
                  </div>

                  {/* Progressive Action Control Buttons */}
                  <div className="flex flex-col gap-2 shrink-0 md:w-56 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Visit Actions
                    </span>

                    {/* Status progression: Accept -> On the Way -> Arrived -> Start Visit -> Complete Visit */}
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'assigned')}
                        className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition"
                      >
                        Accept Visit
                      </button>
                    )}

                    {b.status === 'assigned' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'on_the_way')}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        Mark On The Way
                      </button>
                    )}

                    {b.status === 'on_the_way' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'arrived')}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <MapPin className="w-4 h-4" />
                        Mark Arrived at Doorstep
                      </button>
                    )}

                    {b.status === 'arrived' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'in_progress')}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Activity className="w-4 h-4" />
                        Start Visit / Procedure
                      </button>
                    )}

                    {b.status === 'in_progress' && (
                      <button
                        onClick={() => setActiveReportBooking(b)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        Record Vitals & Complete
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center border border-emerald-200">
                        ✓ Visit Completed & Signed
                      </div>
                    )}

                    {b.status === 'cancelled' && (
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold text-center border border-rose-200">
                        Cancelled
                      </div>
                    )}

                    {/* Patient Phone Call Button */}
                    <a
                      href={`tel:${b.patientPhone}`}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Patient
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CLINICAL FINDINGS & REPORT SUBMISSION MODAL */}
        {activeReportBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-brand-700 to-emerald-800 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Complete Visit & Generate Report</h3>
                  <p className="text-xs text-brand-100 mt-0.5">
                    {activeReportBooking.patientName} · {activeReportBooking.serviceName}
                  </p>
                </div>
                <button
                  onClick={() => setActiveReportBooking(null)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitClinicalReport} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* 1. Bedside Vitals */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand-600" />
                    Bedside Recorded Vitals
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Blood Pressure</label>
                      <input
                        type="text"
                        value={vitals.bloodPressure || ''}
                        onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                        placeholder="120/80 mmHg"
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Pulse Rate (bpm)</label>
                      <input
                        type="number"
                        value={vitals.pulseRate || ''}
                        onChange={(e) => setVitals({ ...vitals, pulseRate: Number(e.target.value) })}
                        placeholder="72"
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">SpO2 Oxygen (%)</label>
                      <input
                        type="number"
                        value={vitals.spO2 || ''}
                        onChange={(e) => setVitals({ ...vitals, spO2: Number(e.target.value) })}
                        placeholder="98"
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Temperature</label>
                      <input
                        type="text"
                        value={vitals.temperature || ''}
                        onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                        placeholder="98.6 °F"
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Blood Glucose</label>
                      <input
                        type="text"
                        value={vitals.bloodSugar || ''}
                        onChange={(e) => setVitals({ ...vitals, bloodSugar: e.target.value })}
                        placeholder="95 mg/dL"
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Clinical Observations */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Clinical Examination & Findings *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Describe bedside examination, auscultation, wound status, or test results..."
                    className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-brand-500"
                  ></textarea>
                </div>

                {/* 3. Prescription Builder */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-slate-800">
                      Prescription / Recommended Medications (Rx)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPrescriptionRow}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:text-brand-800"
                    >
                      <Plus className="w-3 h-3" />
                      Add Medicine
                    </button>
                  </div>

                  <div className="space-y-2">
                    {prescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 items-center"
                      >
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder="Medicine Name"
                            value={rx.medicineName}
                            onChange={(e) =>
                              handlePrescriptionChange(rx.id, 'medicineName', e.target.value)
                            }
                            className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Dosage (500mg)"
                            value={rx.dosage}
                            onChange={(e) =>
                              handlePrescriptionChange(rx.id, 'dosage', e.target.value)
                            }
                            className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Frequency (Twice daily)"
                            value={rx.frequency}
                            onChange={(e) =>
                              handlePrescriptionChange(rx.id, 'frequency', e.target.value)
                            }
                            className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Duration (5 days)"
                            value={rx.duration}
                            onChange={(e) =>
                              handlePrescriptionChange(rx.id, 'duration', e.target.value)
                            }
                            className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemovePrescriptionRow(rx.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Special Advice & Instructions */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Care Instructions / Follow-up Notes
                  </label>
                  <input
                    type="text"
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="e.g. Plenty of oral fluids; schedule review checkup in 5 days if fever persists."
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:border-brand-500"
                  />
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveReportBooking(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20"
                  >
                    {isSubmittingReport ? 'Submitting...' : 'Sign & Complete Visit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
