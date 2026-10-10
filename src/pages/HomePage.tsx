import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  PhoneCall,
  Droplet,
  ShieldCheck,
  Activity,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronRight,
  Star,
  Home,
  MessageCircle,
  FlaskConical,
  HeartPulse,
  Share2,
  AlertCircle,
  Loader2,
  Calendar,
} from 'lucide-react';
import { initialLabTests } from '../services/mockData';

// ─── Popular Tests (Top 6 High Demand) ───────────────────────────────────────
const POPULAR_TESTS = [
  { id: 'test-001', name: 'CBC', fullName: 'Complete Blood Count (Haemogram)', price: 350, category: 'Haematology', icon: Droplet, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  { id: 'test-002', name: 'L.F.T', fullName: 'Liver Function Test (11 Parameters)', price: 650, category: 'Biochemistry', icon: FlaskConical, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  { id: 'test-003', name: 'K.F.T', fullName: 'Kidney Function Test (Renal Profile)', price: 650, category: 'Biochemistry', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  { id: 'test-004', name: 'Lipid Profile', fullName: 'Complete Lipid Profile (Cholesterol & TG)', price: 650, category: 'Biochemistry', icon: HeartPulse, color: 'text-pink-500', bg: 'bg-pink-50 border-pink-200' },
  { id: 'test-005', name: 'HBA1C', fullName: 'Glycosylated Haemoglobin (3-Month Sugar)', price: 700, category: 'Biochemistry', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  { id: 'test-010', name: 'T3T4TSH', fullName: 'Complete Thyroid Profile (T3, T4, TSH)', price: 550, category: 'Hormones', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
];

const HOW_STEPS = [
  { step: '01', title: 'Choose Test', desc: 'Browse our transparent rate-card of 62 official pathology tests.', icon: FlaskConical },
  { step: '02', title: 'Schedule Slot', desc: 'Select your preferred morning fasting or routine doorstep visit slot.', icon: Calendar },
  { step: '03', title: 'Home Collection', desc: 'Trained technician visits your home with sterile vacutainer kits.', icon: Droplet },
  { step: '04', title: 'Digital Report', desc: 'Verified digital report delivered straight to your WhatsApp & portal.', icon: MessageCircle },
];

// ─── Compact Hero Booking Form ────────────────────────────────────────────────
function HeroBookingCard() {
  const [form, setForm] = useState({ fullName: '', mobile: '', testId: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      setError('Please provide your address in Gaya.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedTest = initialLabTests.find((t) => t.id === form.testId);
      const payload = {
        patientName: form.fullName.trim(),
        patientPhone: form.mobile.trim(),
        serviceId: form.testId || 'general-home-collection',
        serviceName: selectedTest?.fullName || selectedTest?.name || 'Home Sample Collection',
        price: selectedTest?.price || 0,
        address: form.address.trim(),
        city: 'Gaya',
        state: 'Bihar',
        pincode: '823002',
        notes: selectedTest ? `Test: ${selectedTest.name}` : 'Doorstep sample collection',
        source: 'homepage_hero',
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setSuccess(`Booking confirmed! Code: ${data.bookingCode || 'TPL-' + Date.now().toString(36).toUpperCase()}. Our phlebotomist will contact you.`);
        setForm({ fullName: '', mobile: '', testId: '', address: '' });
      } else {
        const text = encodeURIComponent(
          `Hello Trust Patho Lab,\nName: ${form.fullName}\nPhone: ${form.mobile}\nTest: ${selectedTest?.name || 'General'}\nAddress: ${form.address}\n\nPlease confirm my doorstep sample collection.`
        );
        window.open(`https://wa.me/916206175583?text=${text}`, '_blank');
        setSuccess('Redirecting to WhatsApp to complete your instant booking!');
      }
    } catch {
      const selectedTest = initialLabTests.find((t) => t.id === form.testId);
      const text = encodeURIComponent(
        `Hello Trust Patho Lab,\nName: ${form.fullName}\nPhone: ${form.mobile}\nTest: ${selectedTest?.name || 'General'}\nAddress: ${form.address}\n\nPlease confirm my doorstep sample collection.`
      );
      window.open(`https://wa.me/916206175583?text=${text}`, '_blank');
      setSuccess('Redirecting to WhatsApp to complete your instant booking!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-obsidian-950 rounded-2xl border border-gold-500/30 p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-brand-900/60">
        <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
          <Home className="w-4 h-4 text-gold-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm">Quick Home Sample Booking</h3>
          <p className="text-[11px] text-slate-400">Trained phlebotomist at your doorstep in Gaya</p>
        </div>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name *</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Patient's full name"
            required
            className="w-full bg-brand-950/60 border border-brand-800/60 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mobile Number *</label>
          <div className="flex rounded-xl overflow-hidden">
            <span className="flex items-center px-2.5 bg-brand-950/80 border border-r-0 border-brand-800/60 text-slate-400 text-xs font-semibold shrink-0">+91</span>
            <input
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile"
              maxLength={10}
              required
              className="flex-1 min-w-0 bg-brand-950/60 border border-brand-800/60 rounded-r-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Select Test (Optional)</label>
          <select
            name="testId"
            value={form.testId}
            onChange={handleChange}
            className="w-full bg-brand-950/60 border border-brand-800/60 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-gold-500/60 transition appearance-none"
          >
            <option value="">— Select test or choose at home —</option>
            {initialLabTests.map((t) => (
              <option key={t.id} value={t.id} className="bg-obsidian-950 text-white">
                {t.name} — ₹{t.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Address in Gaya *</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="House No, Area, Locality in Gaya"
            required
            className="w-full bg-brand-950/60 border border-brand-800/60 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[42px] bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:opacity-60 text-obsidian-950 font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : (
            <>Book Doorstep Sample Collection →</>
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-brand-900/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sterile Kits
        </span>
        <a
          href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20test."
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
        >
          <Share2 className="w-3 h-3" /> WhatsApp Booking
        </a>
      </div>
    </div>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────
export const HomePage: React.FC<{ onOpenAuthModal?: () => void }> = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-obsidian-950 via-brand-950 to-obsidian-900 text-white relative overflow-hidden py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Intro */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-brand-900/70 border border-gold-500/40 text-gold-300 text-xs font-bold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse shrink-0" />
                <span>Govt. Reg. No. 229112131723</span>
                <span className="text-gold-600">•</span>
                <span>Estd. 2024</span>
                <span className="text-gold-600">•</span>
                <span>Gaya, Bihar</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                  Trusted Pathology{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                    at Your Doorstep
                  </span>
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  Hospital-grade diagnostic precision with safe, sterile home sample collection across Gaya and surrounding districts. Get verified digital reports on WhatsApp.
                </p>
              </div>

              {/* Service Badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { icon: Clock, label: '24/7 Service', color: 'text-gold-400' },
                  { icon: Home, label: 'Doorstep Collection', color: 'text-rose-400' },
                  { icon: ShieldCheck, label: 'NABL Standard Quality', color: 'text-emerald-400' },
                  { icon: MessageCircle, label: 'WhatsApp Reports', color: 'text-blue-400' },
                ].map(({ icon: Icon, label, color }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 backdrop-blur-sm"
                  >
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Navigation CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition active:scale-95 min-h-[44px] text-center"
                >
                  <Home className="w-4 h-4" />
                  Book Home Collection
                </Link>
                <Link
                  to="/tests"
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-gold-300 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-gold-500/40 transition active:scale-95 min-h-[44px] text-center"
                >
                  <FlaskConical className="w-4 h-4" />
                  View All 62 Tests & Prices
                </Link>
              </div>

              {/* Address Strip */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Gaya Patna Road, Iqbal Nagar, Gaya – 823002</span>
                </div>
                <div className="flex items-center gap-1.5 text-gold-300 font-bold">
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                  <a href="tel:6206175583" className="hover:underline">6206175583</a>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Booking Card */}
            <div className="lg:col-span-5 w-full">
              <HeroBookingCard />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Key Services / Popular Tests ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Essential Healthcare</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950 mt-0.5">Popular Pathology Tests</h2>
            </div>
            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 hover:text-gold-600 transition"
            >
              <span>Explore All 62 Tests & Rate Card</span>
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
              <span>View Complete 62-Test Rate Card</span>
              <ChevronRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works (4 Simple Steps) ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Hassle-Free Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950 mt-1">How Home Sample Collection Works</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">Reliable pathology at your convenience in 4 straightforward steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* ─── Patient Testimonials ─────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-obsidian-950">Trusted by Families in Gaya</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Verified reviews from patients across Bihar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

      {/* ─── Bottom CTA Strip ─────────────────────────────────────────────── */}
      <section className="py-12 bg-obsidian-950 text-white border-t border-brand-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950 border border-gold-500/40 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            24/7 Doorstep Phlebotomy Available in Gaya
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Need home diagnostic sample collection today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Book now or speak directly with our clinical desk to schedule an early morning fasting sample pickup.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/book"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-xs sm:text-sm transition active:scale-95 text-center min-h-[44px] flex items-center justify-center"
            >
              Book Home Sample Visit
            </Link>
            <a
              href="tel:6206175583"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs sm:text-sm border border-gold-500/40 transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              Call 6206175583
            </a>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 font-medium text-xs sm:text-sm border border-slate-700 transition flex items-center justify-center min-h-[44px]"
            >
              Lab Information & Address
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
