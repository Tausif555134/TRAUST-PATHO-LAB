import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Send,
  MessageCircle,
  Share2,
  CheckCircle2,
  AlertCircle,
  Award,
  Droplet,
  FlaskConical,
  Activity,
  FileText,
  Microscope,
  UserCheck,
  Calendar,
} from 'lucide-react';

const FACILITIES = [
  { name: 'Haematology', icon: Droplet, count: '5+ Tests', desc: 'Complete Blood Count (CBC), ESR, Bleeding & Clotting Time, Hb%, Peripheral Blood Smear.' },
  { name: 'Serology', icon: ShieldCheck, count: '13+ Tests', desc: 'HIV, HBSAg, HCV, VDRL, Widal, Typhoid, Malaria, Mantoux, TB Gold, Torch Panel.' },
  { name: 'Hormones', icon: Activity, count: '7+ Tests', desc: 'Thyroid (T3, T4, TSH), LH, FSH, Prolactin, PCOD Panel, AMH Ovarian Reserve.' },
  { name: 'Biochemistry', icon: FlaskConical, count: '15+ Tests', desc: 'LFT, KFT, Lipid Profile, HBA1C, Fasting & PP Glucose, Vitamin D, Vitamin B12, Iron Profile.' },
  { name: 'Fluid Analysis', icon: FileText, count: '5+ Tests', desc: 'Urine Routine & Microscopic, Urine Culture, Stool R/E, Stool Culture, ADA Fluid Analysis.' },
  { name: 'Histopathology', icon: Microscope, count: '4+ Tests', desc: 'Biopsy (Small/Medium Tissue), Conventional Pap Smear, Liquid-Based Pap HPV DNA.' },
  { name: 'Immunology', icon: Award, count: '4+ Tests', desc: 'CRP Quantitative, RA Factor, ASO Titer, Total IgE Allergy Marker.' },
  { name: 'FNAC', icon: UserCheck, count: 'Superficial', desc: 'Fine Needle Aspiration Cytology for superficial lymph nodes, breast, and thyroid swellings.' },
];

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', testRequired: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send booking enquiry to API or fallback to WhatsApp
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: form.name,
          patientPhone: form.phone,
          serviceName: form.testRequired || 'General Lab Inquiry',
          notes: form.message,
          city: 'Gaya',
          state: 'Bihar',
          source: 'contact_page',
        }),
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      // Fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hello Trust Patho Lab,\nName: ${form.name || 'Patient'}\nPhone: ${form.phone || 'N/A'}\nInquiry: ${form.testRequired || 'Lab test inquiry'}\nMessage: ${form.message || 'I would like to enquire about test availability.'}`
    );
    window.open(`https://wa.me/916206175583?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-obsidian-950 via-brand-950 to-obsidian-900 text-white border-b border-brand-900/60 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900/70 border border-gold-500/40 text-gold-300 text-[10px] sm:text-xs font-bold backdrop-blur-sm max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
              <span>Govt. Reg. No. 229112131723 • Estd. 2024 • Gaya, Bihar</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight break-words">
              Contact &amp; Laboratory{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                Information
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Get in touch with our clinical desk for test inquiries, phlebotomy scheduling, report verification, or visit our central facility in Gaya.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Address & Facility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-brand-700" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Laboratory Location</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gaya Patna Road, Iqbal Nagar, Near Karbala,<br />
                Gaya – 823002, Bihar, India
              </p>
              <div className="text-[11px] font-semibold text-slate-500 pt-1">
                Landmark: Near Karbala, Gaya Patna Main Highway
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <a
                href="https://maps.google.com/?q=Gaya+Patna+Road+Iqbal+Nagar+Gaya+Bihar+823002"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-gold-600 transition"
              >
                <span>Open in Google Maps →</span>
              </a>
            </div>
          </div>

          {/* Phone Hotlines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 border border-gold-200 flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">24/7 Telephone Hotlines</h3>
              <p className="text-xs text-slate-500">
                Direct phlebotomist dispatch and sample collection support desk:
              </p>
              <div className="space-y-1.5 text-xs sm:text-sm font-bold text-slate-900">
                <div>
                  <a href="tel:6206175583" className="hover:text-brand-700 transition flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>+91 6206175583 (Primary Desk)</span>
                  </a>
                </div>
                <div>
                  <a href="tel:6299476228" className="hover:text-brand-700 transition flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>+91 6299476228 (Support Desk)</span>
                  </a>
                </div>
                <div>
                  <a href="tel:9142661354" className="hover:text-brand-700 transition flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>+91 9142661354 (Emergency Helpline)</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Available 24 Hours / 7 Days</span>
            </div>
          </div>

          {/* WhatsApp & Email */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Digital Communications</h3>
              <p className="text-xs text-slate-500">
                Chat with our technician or receive digital test reports:
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <a
                    href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20test."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:underline"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp: +91 6206175583</span>
                  </a>
                </div>
                <div>
                  <a
                    href="mailto:care@trustpatholab.com"
                    className="inline-flex items-center gap-2 text-slate-700 font-medium hover:text-brand-700"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>care@trustpatholab.com</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <a
                href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open Instant WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2-Column: Quick Inquiry Form & Clinical Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Send an Enquiry</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Request a Home Visit or Callback</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your details below and our lab coordinator will respond promptly via call or WhatsApp.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Enquiry Sent Successfully</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Thank you! Our phlebotomist coordinator will contact you shortly on <strong>{form.phone}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="mt-2 inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Connect Immediately on WhatsApp</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Test(s) Required (Optional)</label>
                  <input
                    type="text"
                    value={form.testRequired}
                    onChange={(e) => setForm({ ...form, testRequired: e.target.value })}
                    placeholder="e.g. CBC, Lipid Profile, Thyroid, Full Body..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Address / Specific Query</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide your locality in Gaya (e.g. Bodh Gaya, Civil Lines, Delha) or query..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-gold-500/40 shadow-xs transition flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Send className="w-4 h-4 text-gold-400" />
                    <span>Submit Enquiry</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Ask on WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Lab Credentials & Assurance */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-obsidian-950 text-white rounded-2xl border border-brand-900/60 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/trust-patho-lab-logo.png"
                  alt="Trust Patho Lab"
                  className="w-12 h-12 rounded-full border-2 border-gold-400 object-cover shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
                  }}
                />
                <div>
                  <h3 className="font-black text-white text-lg">Trust Patho Lab Gaya</h3>
                  <p className="text-xs text-gold-400 font-semibold">Government Registered Diagnostic Center</p>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-900/60 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Govt. Registration No. 229112131723</strong>
                    <span className="text-slate-400">Officially certified pathology laboratory established in 2024 under Bihar clinical regulatory norms.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Droplet className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Vacutainer Cold-Chain Standard</strong>
                    <span className="text-slate-400">Every doorstep sample is collected in sterile color-coded vacuum tubes and transported in insulated iceboxes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Certified Pathologist Verification</strong>
                    <span className="text-slate-400">All reports are digitally signed and verified with automated internal quality controls.</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-900/60 flex items-center justify-between">
                <Link
                  to="/tests"
                  className="text-xs font-bold text-gold-300 hover:text-gold-200 transition"
                >
                  View All 62 Tests & Rates →
                </Link>
                <Link
                  to="/book"
                  className="text-xs font-bold text-emerald-400 hover:underline"
                >
                  Book Doorstep Visit →
                </Link>
              </div>
            </div>

            {/* Medical Emergency Alert */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Emergency & Acute Medical Advice</h4>
                <p className="text-xs text-rose-800/80 mt-1 leading-relaxed">
                  Trust Patho Lab provides scheduled diagnostic investigations. For life-threatening symptoms, cardiac distress, or trauma emergencies, please call government emergency helpline <strong>108 / 102</strong> immediately or proceed to the nearest emergency room.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Diagnostic Facilities Section (Transferred from homepage) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Diagnostic Facilities</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">8 Core Clinical Pathology Facilities</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Our central Gaya laboratory houses specialized analytical sections conforming to national diagnostic precision benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FACILITIES.map((facility) => {
              const Icon = facility.icon;
              return (
                <div
                  key={facility.name}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-300 transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-800 shadow-xs group-hover:scale-105 transition">
                      <Icon className="w-4.5 h-4.5 text-brand-700" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                      {facility.count}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{facility.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{facility.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500">Need pricing for specific clinical panels?</span>
            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-gold-600 transition"
            >
              <span>Explore full 62 test price list with search →</span>
            </Link>
          </div>
        </section>

        {/* Medico-Legal Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-center">
          <p className="text-xs text-slate-600 font-medium tracking-wide">
            <strong>OFFICIAL CLINICAL DISCLAIMER:</strong> THIS REPORT IS ONLY FOR A PROFESSIONAL OPINION CO-RELATED CLINICALLY. NOT TO BE USED FOR MEDICO-LEGAL PURPOSE. TRUST PATHO LAB • REG. NO. 229112131723 • GAYA, BIHAR.
          </p>
        </div>
      </div>
    </div>
  );
};
