import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  PhoneCall,
  Droplet,
  ShieldCheck,
  Activity,
  Sparkles,
  FileText,
  Microscope,
  Award,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Star,
  Zap,
  Home,
  MessageCircle,
  FlaskConical,
  HeartPulse,
  Share2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { initialLabTests } from '../services/mockData';
import { PriceListSection } from '../components/services/PriceListSection';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingFormData {
  fullName: string;
  mobile: string;
  testId: string;
  address: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const POPULAR_TESTS = [
  { id: 'test-001', name: 'CBC', fullName: 'Complete Blood Count', price: 350, category: 'Haematology', icon: Droplet, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  { id: 'test-002', name: 'L.F.T', fullName: 'Liver Function Test', price: 650, category: 'Biochemistry', icon: FlaskConical, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'test-003', name: 'K.F.T', fullName: 'Kidney Function Test', price: 650, category: 'Biochemistry', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  { id: 'test-004', name: 'Lipid Profile', fullName: 'Complete Lipid Profile', price: 650, category: 'Biochemistry', icon: HeartPulse, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  { id: 'test-005', name: 'HBA1C', fullName: 'Glycosylated Haemoglobin', price: 700, category: 'Biochemistry', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'test-006', name: 'HIV', fullName: 'HIV 1 & 2 Screening', price: 300, category: 'Serology', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
];

const CATEGORIES = [
  { name: 'Haematology', icon: Droplet, count: '5+', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { name: 'Serology', icon: ShieldCheck, count: '13+', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { name: 'Hormones', icon: Activity, count: '7+', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { name: 'Biochemistry', icon: FlaskConical, count: '15+', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { name: 'Fluid Analysis', icon: FileText, count: '5+', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Histopathology', icon: Microscope, count: '4+', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { name: 'Immunology', icon: Award, count: '4+', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { name: 'FNAC', icon: UserCheck, count: 'Superficial', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
];

const STATS = [
  { value: '62+', label: 'Tests Available', icon: FlaskConical, color: 'text-gold-400' },
  { value: '8', label: 'Clinical Facilities', icon: Award, color: 'text-blue-400' },
  { value: '100%', label: 'Certified Lab', icon: ShieldCheck, color: 'text-emerald-400' },
  { value: '24/7', label: 'Service Available', icon: Clock, color: 'text-purple-400' },
  { value: 'Fast', label: 'Accurate Report Delivery', icon: Zap, color: 'text-amber-400' },
];

const HOW_STEPS = [
  { step: '01', title: 'Select Your Test', desc: 'Choose from 62 pathology tests at transparent government-compliant rates.', icon: FlaskConical },
  { step: '02', title: 'Book Home Visit', desc: 'Pick a convenient slot. Early morning fasting slots (6–10 AM) available.', icon: Home },
  { step: '03', title: 'Sample Collection', desc: 'Verified lab technician visits with sterile vacutainers for hygienic collection.', icon: Droplet },
  { step: '04', title: 'Get Digital Report', desc: 'Certified reports delivered via WhatsApp, patient portal, and printable PDF.', icon: MessageCircle },
];

// ─── Booking Form Component ────────────────────────────────────────────────────
function HeroBookingCard() {
  const [form, setForm] = useState<BookingFormData>({ fullName: '', mobile: '', testId: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(null);
  };

  const validate = () => {
    if (!form.fullName.trim() || form.fullName.trim().length < 2) return 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Enter a valid 10-digit Indian mobile number.';
    if (!form.address.trim() || form.address.trim().length < 8) return 'Please enter your complete address.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Fetch CSRF token
      let csrfToken = '';
      try {
        const csrfRes = await fetch('/api/csrf-token');
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          csrfToken = csrfData.token || '';
        }
      } catch {
        // If server not running, we'll try without
      }

      const selectedTest = initialLabTests.find((t) => t.id === form.testId);
      const payload = {
        patientName: form.fullName.trim(),
        patientPhone: form.mobile.trim(),
        serviceId: form.testId || 'general-consultation',
        serviceName: selectedTest?.fullName || selectedTest?.name || 'General Home Sample Collection',
        price: selectedTest?.price || 0,
        address: form.address.trim(),
        city: 'Gaya',
        state: 'Bihar',
        pincode: '823002',
        notes: selectedTest ? `Test: ${selectedTest.name}` : 'Home sample collection enquiry',
        source: 'homepage_hero_form',
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(`Booking confirmed! Code: ${data.bookingCode || data.id || 'TPL-' + Date.now().toString(36).toUpperCase()}. We'll WhatsApp you shortly.`);
        setForm({ fullName: '', mobile: '', testId: '', address: '' });
      } else {
        // Server returned error but we can show WhatsApp fallback
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Booking failed. Please try WhatsApp below.');
      }
    } catch {
      // Fallback: WhatsApp redirect
      const testName = initialLabTests.find((t) => t.id === form.testId)?.name || 'Home Sample Collection';
      const msg = encodeURIComponent(
        `Hello Trust Patho Lab,\nName: ${form.fullName}\nMobile: ${form.mobile}\nTest: ${testName}\nAddress: ${form.address}\n\nPlease confirm my booking.`
      );
      setError('Could not reach server. Click the WhatsApp button below to book directly.');
      // auto-open WhatsApp as fallback
      window.open(`https://wa.me/916206175583?text=${msg}`, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-obsidian-950 rounded-2xl border border-gold-500/30 shadow-2xl shadow-black/50 p-6 space-y-4">
      {/* Card Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-brand-900/60">
        <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
          <Home className="w-4 h-4 text-gold-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm">Book Home Sample Collection</h3>
          <p className="text-[10px] text-slate-400">Trained staff visits your doorstep</p>
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
            placeholder="Your full name"
            className="w-full bg-brand-950/60 border border-brand-800/60 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 focus:bg-brand-950 transition"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mobile Number *</label>
          <div className="flex">
            <span className="flex items-center px-3 bg-brand-950/80 border border-r-0 border-brand-800/60 rounded-l-xl text-slate-400 text-sm font-semibold">+91</span>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile"
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              className="flex-1 bg-brand-950/60 border border-brand-800/60 rounded-r-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Select Test (Optional)</label>
          <select
            name="testId"
            value={form.testId}
            onChange={handleChange}
            className="w-full bg-brand-950/60 border border-brand-800/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60 transition appearance-none"
          >
            <option value="">— Select test or leave blank —</option>
            {initialLabTests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — ₹{t.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Address *</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="House No., Area, Gaya..."
            rows={2}
            className="w-full bg-brand-950/60 border border-brand-800/60 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:opacity-60 text-obsidian-950 font-black text-sm py-3 rounded-xl shadow-lg shadow-gold-500/20 transition active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : (
            <>Book Now →</>
          )}
        </button>
      </form>

      {/* Trust Badges */}
      <div className="pt-3 border-t border-brand-900/60 space-y-1.5">
        {['Trained Staff at Your Home', 'Safe & Hygienic Sample Collection', 'Digital Report on WhatsApp'].map((badge) => (
          <div key={badge} className="flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{badge}</span>
          </div>
        ))}
      </div>

      {/* WhatsApp Fallback */}
      <a
        href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20blood%20test."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-600/30 font-bold text-xs py-2.5 rounded-xl transition"
      >
        <Share2 className="w-3.5 h-3.5" /> Book via WhatsApp Instead
      </a>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export const HomePage: React.FC<{ onOpenAuthModal?: () => void }> = () => {
  const [_services, setServices] = useState<unknown[]>([]);

  useEffect(() => {
    // Silently pre-load data for other sections
    import('../services/db').then(({ dbService }) => {
      dbService.getServices().then(setServices).catch(() => {});
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION — Full-bleed dark bg + right-side booking card
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-obsidian-950 via-brand-950 to-obsidian-900 text-white">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-800/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-brand-700/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-16 lg:pb-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* ─── Left: Hero Content ─────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Govt. Reg Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-900/70 border border-gold-500/40 text-gold-300 text-xs font-bold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping shrink-0" />
                <span>Govt. Reg. No. 229112131723</span>
                <span className="text-gold-600 mx-1">•</span>
                <span>Estd. 2024</span>
                <span className="text-gold-600 mx-1">•</span>
                <span>Gaya, Bihar</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.1] text-white">
                  Trusted Pathology{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                    at Your Doorstep
                  </span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  Hospital-grade diagnostic accuracy with sterile home sample collection across Gaya and surrounding districts. Get certified digital reports on WhatsApp.
                </p>
              </div>

              {/* Service Badge Pills */}
              <div className="flex flex-wrap gap-2.5 text-xs">
                {[
                  { icon: Clock, label: '24/7 Service', color: 'text-gold-400' },
                  { icon: Home, label: 'Home Sample Collection', color: 'text-rose-400' },
                  { icon: ShieldCheck, label: 'NABL Standard Quality', color: 'text-emerald-400' },
                  { icon: MessageCircle, label: 'Digital Reports', color: 'text-blue-400' },
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-sm px-7 py-4 rounded-2xl shadow-xl shadow-gold-500/20 transition active:scale-95"
                >
                  <Home className="w-4 h-4" />
                  Book Home Sample Collection
                </Link>
                <a
                  href="#test-price-list"
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-gold-300 font-bold text-sm px-7 py-4 rounded-2xl border border-gold-500/40 transition active:scale-95"
                >
                  <FlaskConical className="w-4 h-4" />
                  View Test Price List
                </a>
              </div>

              {/* Address strip */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002</span>
                </div>
                <div className="flex items-center gap-1.5 text-gold-300 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>6206175583 / 6299476228 / 9142661354</span>
                </div>
              </div>

              {/* Logo and lab identity */}
              <div className="flex items-center gap-4 pt-2">
                <img
                  src="/trust-patho-lab-logo.jpg"
                  alt="Trust Patho Lab Logo"
                  className="w-16 h-16 rounded-full border-2 border-gold-500/60 object-cover shadow-xl shadow-black/40"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <div className="text-lg font-black text-white tracking-wide">
                    TRUST <span className="text-gold-400">PATHO LAB</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Pathology Laboratory • Gaya • Since 2024
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Right: Booking Card ─────────────────────────────────── */}
            <div className="lg:col-span-5">
              <HeroBookingCard />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATISTICS STRIP
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-obsidian-950 border-b border-brand-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-brand-900/40">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3 py-2 sm:py-0 sm:px-4 first:sm:pl-0 last:sm:pr-0">
                  <div className="w-9 h-9 rounded-xl bg-brand-900/60 flex items-center justify-center shrink-0">
                    <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-[11px] text-slate-400 leading-tight">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TEST CATEGORIES SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="services-section" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Complete Clinical Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950 mt-1">
              8 Diagnostic Facilities Available
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Comprehensive specialized pathological analyses conducted under stringent calibration and aseptic standards.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.name}
                  href="#test-price-list"
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${cat.bg} hover:scale-105 transition duration-200 cursor-pointer group`}
                >
                  <div className={`w-10 h-10 rounded-xl ${cat.bg} border flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-obsidian-950">{cat.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{cat.count} Tests</div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <a
              href="#test-price-list"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-gold-600 transition"
            >
              View All 62 Tests <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          POPULAR TESTS SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Most Requested</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950 mt-0.5">Popular Tests</h2>
            </div>
            <a
              href="#test-price-list"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-gold-600 transition"
            >
              View Full Price List <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_TESTS.map((test) => {
              const Icon = test.icon;
              return (
                <Link
                  key={test.id}
                  to={`/book?testId=${test.id}&testName=${encodeURIComponent(test.name)}&price=${test.price}`}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-gold-500/50 hover:shadow-md hover:-translate-y-0.5 transition duration-200 group flex flex-col gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${test.bg}`}>
                    <Icon className={`w-5 h-5 ${test.color}`} />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm group-hover:text-brand-800 transition">{test.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{test.fullName}</div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-black text-gold-600">₹{test.price}</span>
                    <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded-full font-semibold">
                      {test.category}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FULL TEST PRICE LIST (62 Tests, Searchable)
      ══════════════════════════════════════════════════════════════════ */}
      <PriceListSection />

      {/* ══════════════════════════════════════════════════════════════════
          ABOUT THE LAB
      ══════════════════════════════════════════════════════════════════ */}
      <section id="lab-details" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full inline-block">
                  About Trust Patho Lab
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950">
                  Reliable Clinical Diagnostics Serving Gaya Since 2024
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Established in 2024 and officially registered under <strong>Reg. No. 229112131723</strong>, Trust Patho Lab operates with an unwavering dedication to clinical precision, rapid sample turnaround, and patient convenience. Located at Gaya Patna Road, Iqbal Nagar (near Karbala), we offer 24/7 pathology services with trained phlebotomists who travel to your home with complete sterile kit bags.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  {[
                    { title: 'Vacuum Tube Collection', desc: 'Color-coded vacutainers prevent hemolysis and contamination.' },
                    { title: 'Cold-Chain Transit', desc: 'Specimens kept at monitored temperatures until machine aspiration.' },
                    { title: 'Digital & Printed Reports', desc: 'Verified reports delivered online with print and PDF export.' },
                    { title: 'Transparent Government Pricing', desc: 'Fixed rate-card matching the official laboratory price schedule.' },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block">{title}</strong>
                        <span className="text-slate-500">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="lg:col-span-5 bg-obsidian-950 text-white rounded-2xl p-6 sm:p-7 border-2 border-gold-500/40 space-y-4">
                <div className="flex items-center gap-3">
                  <img src="/trust-patho-lab-logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-gold-400 object-cover" />
                  <div>
                    <h4 className="font-extrabold text-white text-base">Gaya Laboratory Desk</h4>
                    <span className="text-xs text-gold-400">Reg. No. 229112131723</span>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-900/60">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002, Bihar</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>6206175583, 6299476228, 9142661354</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24 Hours / 7 Days Service Available</span>
                  </div>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20order%20tests."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" /> WhatsApp Booking
                  </a>
                  <a
                    href="tel:6206175583"
                    className="w-full bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs py-3 rounded-xl border border-gold-500/40 transition flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-gold-400" /> Direct Call: 6206175583
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Seamless Doorstep Workflow</span>
            <h2 className="text-3xl font-extrabold text-obsidian-950 mt-1">How Trust Patho Lab Works</h2>
            <p className="text-sm text-slate-600 mt-2">Book clinical diagnostics at home in 4 straightforward, transparent steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map(({ step, title, desc, icon: Icon }, i) => (
              <div key={step} className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-gold-500/40 hover:shadow-md transition group">
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-slate-200 z-10" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <div className="text-3xl font-black text-slate-100 absolute top-4 right-5 select-none">{step}</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TESTIMONIALS (Star section)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-obsidian-950">Patient Reviews</h2>
            <p className="text-sm text-slate-500 mt-1">Trusted by families across Gaya and Bihar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { name: 'Rohit K.', area: 'Bodh Gaya', text: 'Staff came on time with all equipment. CBC and HBA1C done perfectly. Reports on WhatsApp within 5 hours!', stars: 5 },
              { name: 'Sunita D.', area: 'Civil Lines, Gaya', text: 'Booked thyroid test (T3T4TSH) for my mother. Technician was professional, hygienic, and very courteous.', stars: 5 },
              { name: 'Amit P.', area: 'Sherghati', text: 'Got LFT and KFT at home. Price is very fair and transparent. Highly recommended for senior citizens.', stars: 5 },
            ].map((rev) => (
              <div key={rev.name} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">"{rev.text}"</p>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{rev.name}</div>
                  <div className="text-xs text-slate-500">{rev.area}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CALL TO ACTION BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-obsidian-950 text-white border-t border-brand-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 border border-gold-500/40 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Same-Day Doorstep Slots Available in Gaya
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Need doorstep pathology testing in Gaya today?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Experience clinical laboratory accuracy in the privacy, hygiene, and comfort of your home.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-sm shadow-xl shadow-gold-500/20 transition active:scale-95"
            >
              Book Doorstep Checkup Now
            </Link>
            <a
              href="tel:6206175583"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-sm border border-gold-500/40 transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" /> Call 6206175583
            </a>
          </div>

          {/* Official Disclaimer */}
          <p className="text-[10px] text-slate-600 pt-4 max-w-2xl mx-auto leading-relaxed">
            DISCLAIMER: This report is only for professional opinion co-related clinically. Not to be used for medico-legal purpose.
            Trust Patho Lab — Govt. Reg. No. 229112131723
          </p>
        </div>
      </section>
    </div>
  );
};
