import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Droplet, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian-950 text-slate-300 pt-10 pb-8 border-t border-brand-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-brand-900/60 items-start">
          {/* Column 1: Brand & Credibility */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center gap-3">
              <img
                src="/trust-patho-lab-logo.png"
                alt="Trust Patho Lab Logo"
                className="w-11 h-11 rounded-full border-2 border-gold-400 object-cover shadow-md shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
                }}
              />
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  TRUST <span className="text-gold-400">PATHO LAB</span>
                </span>
                <span className="block text-[10px] font-bold text-gold-300 uppercase tracking-widest">
                  Pathology Laboratory • Estd. 2024
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Govt. Registration No. <strong>229112131723</strong>. Providing certified clinical pathology and 24/7 doorstep sample collection across Gaya and surrounding districts.
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                24/7 Service Available
              </span>
              <span className="flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-rose-400" />
                Sterile Vacutainers
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                NABL Standard Calibration
              </span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-gold-300 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tests" className="hover:text-gold-300 transition">
                  Test Price List (62 Tests)
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-gold-300 transition">
                  Book Home Visit
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition">
                  Contact &amp; Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Facility Location */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Central Lab Facility
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002, Bihar
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Doorstep sample pickup available across Gaya urban &amp; rural areas.
              </p>
            </div>
          </div>
        </div>

        {/* Medico-Legal Disclaimer matching official requirement */}
        <div className="py-3.5 border-b border-brand-900/60 text-center">
          <p className="text-[11px] text-slate-400 tracking-wide font-medium">
            NOTICE: THIS REPORT IS ONLY FOR A PROFESSIONAL OPINION CO-RELATED CLINICALLY. NOT TO BE USED FOR MEDICO-LEGAL PURPOSE.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} Trust Patho Lab (Reg. No. 229112131723). All rights reserved. Gaya, Bihar.
          </div>
          <div className="text-xs text-slate-400">
            For inquiries, tap the <span className="text-gold-400 font-semibold">Contact Lab</span> button on screen.
          </div>
        </div>
      </div>
    </footer>
  );
};
