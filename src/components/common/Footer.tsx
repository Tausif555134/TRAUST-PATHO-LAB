import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, Award, PhoneCall, Mail, MapPin, Clock, Droplet, FileCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian-950 text-slate-300 pt-16 pb-12 border-t border-brand-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Urgent Medical Emergency Notice Banner */}
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-4 sm:p-5 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-900/50 text-rose-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-200">
                Clinical Notice & Emergency Advisory
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                TRUST PATHO LAB home sample collection is strictly for scheduled routine and specialized pathological tests. In case of acute cardiac symptoms, stroke signs, or trauma emergencies, please dial <strong>108 / 102</strong> immediately or reach the nearest government emergency center.
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-900/60">
          {/* Column 1: Brand & Credibility */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/trust-patho-lab-logo.png"
                alt="Trust Patho Lab Logo"
                className="w-12 h-12 rounded-full border-2 border-gold-400 object-cover shadow-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
                }}
              />
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  TRUST <span className="text-gold-400">PATHO LAB</span>
                </span>
                <span className="block text-[10px] font-bold text-gold-300 uppercase tracking-widest">
                  Pathology Laboratory • Estd. 2024
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Govt. Registration No. <strong>229112131723</strong>. Providing premier, barcoded diagnostic testing and 24/7 doorstep sample collection across Gaya and Bihar.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                24/7 Hour Service Available
              </span>
              <span className="flex items-center gap-2">
                <Droplet className="w-3.5 h-3.5 text-rose-400" />
                Sterile Home Sample Collection Facility
              </span>
              <span className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Multi-Brand Special Pathological Tests
              </span>
            </div>
          </div>

          {/* Column 2: 8 Specialized Facilities */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-4">
              8 Diagnostic Facilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> Haematology
              </li>
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> Serology
              </li>
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> Hormones
              </li>
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> Biochemistry
              </li>
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> Fluid Analysis
              </li>
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> Histopathology
              </li>
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> Immunology
              </li>
              <li className="hover:text-white transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span> FNAC
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="/#test-price-list" className="hover:text-gold-300 font-medium transition">
                  Official Test Price List (62 Tests)
                </a>
              </li>
              <li>
                <Link to="/book" className="hover:text-gold-300 transition">
                  Book Doorstep Sample Collection
                </Link>
              </li>
              <li>
                <Link to="/patient/dashboard" className="hover:text-gold-300 transition">
                  Patient Health Records & Tracker
                </Link>
              </li>
              <li>
                <Link to="/professional/dashboard" className="hover:text-gold-300 transition">
                  Phlebotomist & Clinician Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold-300 transition">
                  Admin Price Management & Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Gaya Laboratory Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-4">
              Gaya Laboratory & Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002 (Bihar)
                </p>
              </div>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
                <span>6206175583, 6299476228, 9142661354</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>care@trustpatholab.com</span>
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20inquire%20about%20a%20pathology%20test."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Chat on WhatsApp (6206175583)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Medico Legal Disclaimer matching flyer */}
        <div className="py-4 border-b border-brand-900/60 text-center">
          <p className="text-[11px] text-slate-400 tracking-wide font-medium">
            NOTICE: THIS REPORT IS ONLY FOR A PROFESSION OPINION CO-RELATE CLINICALLY. NOT TO BE USED FOR MEDICO LEGAL PURPOSE.
          </p>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Trust Patho Lab (Reg. No. 229112131723). All rights reserved. Gaya, Bihar.
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
