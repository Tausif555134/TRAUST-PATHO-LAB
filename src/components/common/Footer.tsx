import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, Lock, Award, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Urgent Medical Emergency Notice Banner */}
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-4 sm:p-5 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-900/50 text-rose-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-200">
                Medical Emergency Notice
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                TRUST PATHO LAB home visits are strictly for scheduled consultations, diagnostics, routine nursing, and non-emergency checkups. In case of acute chest pain, breathlessness, head trauma, or life-threatening emergencies, please dial <strong>108 / 102</strong> immediately or visit the nearest emergency trauma center.
              </p>
            </div>
          </div>
          <a
            href="tel:108"
            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call Emergency (108)
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Credibility */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <HeartPulse className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                TRUST <span className="text-brand-400">PATHO LAB</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging premier hospital-grade care and patient convenience. Certified doctors, registered nurses, and barcoded phlebotomy dispatched directly to your doorstep.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit Encrypted Health Records
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                100% Background-Verified Clinicians
              </span>
            </div>
          </div>

          {/* Column 2: Home Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Doorstep Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/services/srv-1" className="hover:text-white transition">
                  General Health Checkup
                </Link>
              </li>
              <li>
                <Link to="/services/srv-2" className="hover:text-white transition">
                  Blood Sample Collection (Cold-Chain)
                </Link>
              </li>
              <li>
                <Link to="/services/srv-5" className="hover:text-white transition">
                  12-Lead Portable ECG at Home
                </Link>
              </li>
              <li>
                <Link to="/services/srv-6" className="hover:text-white transition">
                  Elderly Health & Mobility Checkup
                </Link>
              </li>
              <li>
                <Link to="/services/srv-7" className="hover:text-white transition">
                  Doctor Home Visit (Physician)
                </Link>
              </li>
              <li>
                <Link to="/services/srv-8" className="hover:text-white transition">
                  Nursing Care & Wound Dressing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Portals & Accounts
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/patient/dashboard" className="hover:text-white transition">
                  Patient Health Records & Tracker
                </Link>
              </li>
              <li>
                <Link to="/professional/dashboard" className="hover:text-white transition">
                  Clinician & Doctor Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Operations & Dispatch Console
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-white transition">
                  Book a New Visit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Hotline & Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Patient Care Helpline
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                Toll Free: 1800-TRUST-LAB
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                care@trustpatholab.com
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                Operating across Metro Zones: Bangalore, Mumbai, Delhi-NCR, Hyderabad, Chennai & Pune.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} TRUST PATHO LAB Healthcare Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Patient Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Clinical Standards</span>
            <span className="hover:text-slate-400 cursor-pointer">Cancellation & Refunds</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
