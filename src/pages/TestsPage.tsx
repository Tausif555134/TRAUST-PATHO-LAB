import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Clock,
  Droplet,
  ShieldCheck,
  Calendar,
  Sparkles,
  PhoneCall,
  Share2,
} from 'lucide-react';
import { PriceListSection } from '../components/services/PriceListSection';

export const TestsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-br from-obsidian-950 via-brand-950 to-obsidian-900 text-white border-b border-brand-900/60 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900/70 border border-gold-500/40 text-gold-300 text-[10px] sm:text-xs font-bold backdrop-blur-sm max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
              <span>Govt. Reg. No. 229112131723 • Estd. 2024 • Gaya, Bihar</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight break-words">
              Official Pathology{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                Test Price List
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Transparent, government-compliant pathology pricing with zero hidden surcharges. All 62 diagnostic tests from our official laboratory catalog with 24/7 doorstep sample collection in Gaya & Bihar.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                24/7 Doorstep Service
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Droplet className="w-3.5 h-3.5 text-rose-400" />
                Sterile Vacuum Tubes
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp Digital Reports
              </span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition active:scale-95 min-h-[42px]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Home Sample Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Test Catalog & Ledger */}
      <PriceListSection standalone={true} />
    </div>
  );
};
