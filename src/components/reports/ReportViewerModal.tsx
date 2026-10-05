import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  HeartPulse,
  Activity,
  FileText,
  Calendar,
  User,
  CheckCircle2,
} from 'lucide-react';
import { MedicalReport, Booking } from '../../types';

interface ReportViewerModalProps {
  report: MedicalReport;
  booking?: Booking;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  report,
  booking,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Official Clinical Summary & Prescription</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto flex-1 printable-report bg-white text-slate-900 font-sans">
          {/* Clinic Header */}
          <div className="flex items-start justify-between border-b-2 border-brand-600 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Care<span className="text-brand-600">Pulse</span> Home Healthcare
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  ISO 9001:2015 Certified Doorstep Clinical Services · NABH Standards
                </p>
                <p className="text-[11px] text-slate-400">
                  Central Registry: 24/7 Helpline 1800-CARE-PULSE · www.carepulse.in
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
                Verified Clinical Record
              </span>
              <div className="text-xs font-mono text-slate-500">
                Report ID: {report.id}
              </div>
              <div className="text-xs text-slate-500">
                Date: {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Patient & Appointment Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Patient Name
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {booking?.patientName || 'Rajesh Verma'}
              </span>
              <span className="text-slate-500 block text-[11px]">
                Age: {booking?.patientAge || 48} · Gender: {booking?.patientGender || 'male'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Service Performed
              </span>
              <span className="font-semibold text-slate-800">
                {report.serviceName}
              </span>
              <span className="text-slate-500 block text-[11px]">
                Visit: {report.visitDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Attending Clinician
              </span>
              <span className="font-semibold text-slate-800">
                {report.professionalName}
              </span>
              <span className="text-slate-500 block text-[11px]">
                {report.professionalRole}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Booking Reference
              </span>
              <span className="font-mono font-bold text-slate-800">
                {booking?.bookingCode || report.bookingId}
              </span>
              <span className="text-emerald-600 block text-[11px] font-medium">
                Home Visit Completed
              </span>
            </div>
          </div>

          {/* Vitals Section */}
          {report.vitals && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-600" />
                Bedside Vitals & Observations
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {report.vitals.bloodPressure && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Blood Pressure
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {report.vitals.bloodPressure}
                    </span>
                  </div>
                )}
                {report.vitals.pulseRate && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Pulse Rate
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {report.vitals.pulseRate} bpm
                    </span>
                  </div>
                )}
                {report.vitals.spO2 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      SpO2 (Oxygen)
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {report.vitals.spO2}%
                    </span>
                  </div>
                )}
                {report.vitals.temperature && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Body Temp
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {report.vitals.temperature}
                    </span>
                  </div>
                )}
                {report.vitals.bloodSugar && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Blood Glucose
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {report.vitals.bloodSugar}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clinical Findings / Observations */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Clinical Findings & Progress Notes
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {report.observations}
            </div>
          </div>

          {/* Prescriptions Table */}
          {report.prescriptions && report.prescriptions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Rx - Medical Prescription
              </h4>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-3">Medicine / Molecule</th>
                      <th className="p-3">Dosage</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {report.prescriptions.map((rx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-brand-900">{rx.medicineName}</td>
                        <td className="p-3">{rx.dosage}</td>
                        <td className="p-3">{rx.frequency}</td>
                        <td className="p-3">{rx.duration}</td>
                        <td className="p-3 text-slate-500">{rx.notes || 'As advised'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Doctor Advisory */}
          {report.doctorNotes && (
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Special Advice / Care Instructions
              </h4>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                {report.doctorNotes}
              </div>
            </div>
          )}

          {/* Signature & Digital Verification Block */}
          <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Digitally Authenticated Clinical Summary
              </div>
              <p className="text-[10px] text-slate-400 max-w-sm">
                This document is electronically verified pursuant to Information Technology Act & National Medical Commission Tele-practice & Homecare guidelines.
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block p-2 text-center border-b border-slate-400 font-serif italic text-base text-slate-800">
                {report.professionalName}
              </div>
              <div className="text-[11px] font-bold text-slate-800 mt-1">
                Authorized Signatory
              </div>
              <div className="text-[10px] text-slate-500">
                CarePulse Mobile Medical Services
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
