import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Droplet,
  ShieldCheck,
  Activity,
  Sparkles,
  Award,
  ChevronRight,
  Star,
  Home,
  MessageCircle,
  FlaskConical,
  HeartPulse,
  Calendar,
} from 'lucide-react';

// ─── Popular Tests (Top 6 High-Demand Diagnostic Panels) ─────────────────────
const POPULAR_TESTS = [
  { id: 'test-001', name: 'CBC', fullName: 'Complete Blood Count (Haemogram)', price: 350, category: 'Haematology', icon: Droplet, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  { id: 'test-002', name: 'L.F.T', fullName: 'Liver Function Test (11 Parameters)', price: 650, category: 'Biochemistry', icon: FlaskConical, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  { id: 'test-003', name: 'K.F.T', fullName: 'Kidney Function Test (Renal Profile)', price: 650, category: 'Biochemistry', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  { id: 'test-004', name: 'Lipid Profile', fullName: 'Complete Lipid Profile (Cholesterol & TG)', price: 650, category: 'Biochemistry', icon: HeartPulse, color: 'text-pink-500', bg: 'bg-pink-50 border-pink-200' },
  { id: 'test-005', name: 'HBA1C', fullName: 'Glycosylated Haemoglobin (3-Month Sugar)', price: 700, category: 'Biochemistry', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  { id: 'test-010', name: 'T3T4TSH', fullName: 'Complete Thyroid Profile (T3, T4, TSH)', price: 550, category: 'Hormones', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
];

const HOW_STEPS = [
  { step: '01', title: 'Choose Test', desc: 'Select individual pathology tests or comprehensive preventive health panels.', icon: FlaskConical },
  { step: '02', title: 'Pick Time Slot', desc: 'Choose a convenient morning fasting or routine doorstep visit slot.', icon: Calendar },
  { step: '03', title: 'Home Collection', desc: 'A certified phlebotomist visits with sterile vacuum vials and cold-chain bags.', icon: Droplet },
  { step: '04', title: 'Digital Report', desc: 'Receive your verified digital pathology report directly via WhatsApp.', icon: MessageCircle },
];

export const HomePage: React.FC<{ onOpenAuthModal?: () => void }> = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── 1. Minimal, Premium Hero Section ─────────────────────────────── */}
      <section className="bg-gradient-to-br from-obsidian-950 via-brand-950 to-obsidian-900 text-white relative overflow-hidden py-14 sm:py-20 border-b border-brand-900/60">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-800/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center space-y-6">
          {/* Official Accreditation Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 max-w-full px-3 py-1 rounded-full bg-brand-900/80 border border-gold-500/40 text-gold-300 text-[10px] sm:text-xs font-bold backdrop-blur-sm shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
            <span className="text-center">Govt. Reg. No. 229112131723 • Estd. 2024 • Gaya, Bihar</span>
          </div>

          {/* Logo & Lab Identity */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
            <img
              src="/trust-patho-lab-logo.png"
              alt="Trust Patho Lab"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gold-400 object-cover shadow-lg shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
              }}
            />
            <div className="text-left min-w-0">
              <div className="text-lg sm:text-2xl font-black text-white tracking-wide truncate">
                TRUST <span className="text-gold-400">PATHO LAB</span>
              </div>
              <div className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">
                Pathology Laboratory • Central Desk Gaya
              </div>
            </div>
          </div>

          {/* Concise Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white max-w-3xl mx-auto break-words">
            Trusted Pathology{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
              at Your Doorstep
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Hospital-grade diagnostic accuracy with safe, sterile home sample collection across Gaya. Verified digital reports delivered directly on WhatsApp.
          </p>

          {/* One Primary CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl shadow-gold-500/10 transition active:scale-95 min-h-[46px]"
            >
              <Home className="w-4 h-4" />
              <span>Book Home Collection</span>
            </Link>

            <Link
              to="/tests"
              className="text-xs sm:text-sm font-bold text-gold-300 hover:text-gold-200 transition px-4 py-2 inline-flex items-center gap-1.5"
            >
              <span>View 62 Test Rates</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Essential Feature Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            {[
              { icon: Clock, label: '24/7 Phlebotomy', color: 'text-gold-400' },
              { icon: Droplet, label: 'Sterile Vacutainers', color: 'text-rose-400' },
              { icon: ShieldCheck, label: 'Cold-Chain Transit', color: 'text-emerald-400' },
              { icon: MessageCircle, label: 'WhatsApp Reports', color: 'text-blue-400' },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] sm:text-xs backdrop-blur-sm"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. Essential Key Services (Top Popular Tests) ────────────────── */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Most Requested</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950 mt-0.5">Popular Pathology Tests</h2>
            </div>
            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 hover:text-gold-600 transition"
            >
              <span>Explore All 62 Tests & Rates</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_TESTS.map((test) => {
              const Icon = test.icon;
              return (
                <div
                  key={test.id}
                  className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-gold-500/40 p-5 transition hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${test.bg}`}>
                        <Icon className={`w-5 h-5 ${test.color}`} />
                      </div>
                      <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                        {test.category}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-800 transition">
                      {test.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {test.fullName}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Test Fee</div>
                      <div className="text-xl font-black text-obsidian-950">₹{test.price}</div>
                    </div>
                    <Link
                      to={`/book?testId=${test.id}&testName=${encodeURIComponent(test.name)}&price=${test.price}`}
                      className="bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-gold-500/40 transition shadow-xs active:scale-95"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/tests"
              className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-gold-500/40 transition shadow-xs"
            >
              <span>View Full 62-Test Rate Card</span>
              <ChevronRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 3. How It Works (4 Simple Steps) ─────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Straightforward Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950 mt-1">How Home Sample Collection Works</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Reliable pathology at your convenience in 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {HOW_STEPS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
                <div className="text-3xl font-black text-slate-100 absolute top-4 right-5 select-none">{step}</div>
                <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center mb-3 text-gold-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Patient Reviews ───────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-obsidian-950">Trusted by Families in Gaya</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Verified feedback from patients across Bihar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              { name: 'Rohit K.', area: 'Bodh Gaya', text: 'Technician reached on time with sterile vacutainers. CBC and HBA1C done smoothly. WhatsApp report received within 4 hours!', stars: 5 },
              { name: 'Sunita D.', area: 'Civil Lines, Gaya', text: 'Booked thyroid profile for my mother. Extremely polite staff, clean equipment, and very fair government pricing.', stars: 5 },
              { name: 'Amit P.', area: 'Sherghati', text: 'LFT and KFT tests at home. No need to stand in long hospital queues. Highly recommended for senior citizens.', stars: 5 },
            ].map((rev) => (
              <div key={rev.name} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center gap-1 mb-2.5">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">"{rev.text}"</p>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{rev.name}</div>
                  <div className="text-[11px] text-slate-500">{rev.area}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
