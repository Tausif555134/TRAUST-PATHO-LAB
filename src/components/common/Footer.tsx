import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, PhoneCall, Mail, MapPin, Clock, Droplet, FileCheck, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian-950 text-slate-300 pt-12 pb-10 border-t border-brand-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Urgent Medical Emergency Notice Banner */}
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-4 sm:p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-900/50 text-rose-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-200">
                Clinical Notice & Emergency Advisory
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                TRUST PATHO LAB home sample collection is strictly for scheduled routine and specialized pathological tests. In case of acute cardiac distress, stroke symptoms, or trauma emergencies, please dial <strong>108 / 102</strong> immediately or proceed to the nearest emergency hospital.
              </p>
            </div>
          </div>
          <a
            href="tel:108"
            className="w-full sm:w-auto justify-center shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 min-h-[42px]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call Emergency (108)
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-brand-900/60">
          {/* Column 1: Brand & Credibility */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/trust-patho-lab-logo.png"
                alt="Trust Patho Lab Logo"
                className="w-12 h-12 rounded-full border-2 border-gold-400 object-cover shadow-md shrink-0"
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
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Govt. Registration No. <strong>229112131723</strong>. Providing certified, barcoded diagnostic testing and 24/7 doorstep sample collection across Gaya and Bihar.
            </p>
            <div className="pt-1 flex flex-col gap-1.5 text-xs text-slate-400">
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
                62+ Certified Diagnostic Laboratory Tests
              </span>
            </div>
          </div>

          {/* Column 2: Public Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-gold-300 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tests" className="hover:text-gold-300 transition">
                  Official Test Price List (62 Tests)
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-gold-300 transition">
                  Book Home Sample Collection
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition">
                  Laboratory Location & Contact
                </Link>
              </li>
              <li>
                <Link to="/patient/dashboard" className="hover:text-gold-300 transition">
                  Patient Health Records Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Gaya Laboratory Address */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Gaya Laboratory Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002, Bihar
                </p>
              </div>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <a href="tel:6206175583" className="hover:text-gold-300 font-semibold">6206175583</a> / <a href="tel:6299476228" className="hover:text-gold-300">6299476228</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <a href="mailto:care@trustpatholab.com" className="hover:text-gold-300">care@trustpatholab.com</a>
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20inquire%20about%20a%20test."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                <Share2 className="w-3 h-3" />
                <span>Chat on WhatsApp (+91 6206175583)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Medico Legal Disclaimer */}
        <div className="py-4 border-b border-brand-900/60 text-center">
          <p className="text-[11px] text-slate-400 tracking-wide font-medium">
            NOTICE: THIS REPORT IS ONLY FOR A PROFESSIONAL OPINION CO-RELATED CLINICALLY. NOT TO BE USED FOR MEDICO-LEGAL PURPOSE.
          </p>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} Trust Patho Lab (Reg. No. 229112131723). All rights reserved. Gaya, Bihar.
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-1">
            <Link to="/contact" className="hover:text-slate-400">Clinical Standards</Link>
            <Link to="/contact" className="hover:text-slate-400">Emergency Protocol</Link>
            <Link to="/contact" className="hover:text-slate-400">Contact Lab</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
