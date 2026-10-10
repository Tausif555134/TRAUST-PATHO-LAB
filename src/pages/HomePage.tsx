import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  ShieldCheck,
  Clock,
  Lock,
  Tag,
  Star,
  Search,
  MapPin,
  ChevronRight,
  PhoneCall,
  Activity,
  UserCheck,
  Award,
  Sparkles,
  Droplet,
  FileText,
  Microscope,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { dbService } from '../services/db';
import { Service, Review } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';
import { PriceListSection } from '../components/services/PriceListSection';

const EIGHT_FACILITIES = [
  {
    name: 'Haematology',
    desc: 'CBC, Hemogram, Hb%, ESR, BT/CT, Peripheral Smear for anemia & infections.',
    icon: Droplet,
    testsCount: '5+ Tests',
  },
  {
    name: 'Serology',
    desc: 'Rapid & ELISA infectious screens (HIV, HBsAg, HCV, VDRL, Widal, Malaria, TB Gold).',
    icon: ShieldCheck,
    testsCount: '13+ Tests',
  },
  {
    name: 'Hormones',
    desc: 'Endocrine profiling including Thyroid (T3/T4/TSH), LH, FSH, Prolactin, AMH, PCOD.',
    icon: Activity,
    testsCount: '7+ Tests',
  },
  {
    name: 'Biochemistry',
    desc: 'Organ function profiles (LFT, KFT, Lipid), HbA1c, Fasting Sugar, Calcium & Electrolytes.',
    icon: Sparkles,
    testsCount: '15+ Tests',
  },
  {
    name: 'Fluid Analysis',
    desc: 'Urine R/E & Culture, Stool examination & culture, Pleural/Ascitic Fluid ADA.',
    icon: FileText,
    testsCount: '5+ Tests',
  },
  {
    name: 'Histopathology',
    desc: 'Biopsy tissue analysis, conventional Pap smear, liquid-based cytology with HPV.',
    icon: Microscope,
    testsCount: '4+ Tests',
  },
  {
    name: 'Immunology',
    desc: 'Inflammatory & autoimmune markers including CRP, RA Factor, ASO Titer, Total IgE.',
    icon: Award,
    testsCount: '4+ Tests',
  },
  {
    name: 'FNAC',
    desc: 'Fine Needle Aspiration Cytology for painless investigation of swellings & nodules.',
    icon: UserCheck,
    testsCount: 'Superficial / Deep',
  },
];

export const HomePage: React.FC<{ onOpenAuthModal?: () => void }> = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedServices, loadedReviews] = await Promise.all([
          dbService.getServices(),
          dbService.getReviews(),
        ]);
        setServices(loadedServices.filter((s) => s.isActive));
        setReviews(loadedReviews);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categories = ['All', ...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION - ROYAL OBSIDIAN & GOLD BRANDING */}
      <section className="relative overflow-hidden bg-gradient-to-b from-obsidian-950 via-brand-950 to-obsidian-900 text-white pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-brand-900/60">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-800/20 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Accreditations Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-900/80 border border-gold-500/40 text-gold-300 text-xs font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
                <span>Govt. Reg. No. 2291212131723</span>
                <span className="text-gold-500">•</span>
                <span>Estd. 2024 • Gaya, Bihar</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Trusted Pathology at Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                  Doorstep
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Trust Patho Lab brings hospital-grade diagnostic accuracy, sterile vacutainer sample collection, and rapid digital pathology reports directly to your home in Gaya and surrounding districts.
              </p>

              {/* Core Features Strip */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-200">
                <span className="px-3 py-1 rounded-full bg-obsidian-900/90 border border-gold-500/30 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-400" /> 24/7 Hour Service
                </span>
                <span className="px-3 py-1 rounded-full bg-obsidian-900/90 border border-gold-500/30 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-rose-400" /> Home Sample Collection
                </span>
                <span className="px-3 py-1 rounded-full bg-obsidian-900/90 border border-gold-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Multi-Brand Tests
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                <a
                  href="#test-price-list"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-sm px-7 py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition active:scale-95"
                >
                  <Tag className="w-4 h-4" />
                  View Test Price List (62 Tests)
                </a>
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-sm px-6 py-4 rounded-2xl border border-gold-500/40 shadow-xs transition active:scale-95"
                >
                  <CalendarCheck className="w-4 h-4 text-gold-400" />
                  Book Home Collection
                </Link>
                <a
                  href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20blood%20test."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-4 rounded-2xl transition shadow-xs"
                >
                  <PhoneCall className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              {/* Quick Contact & Address Subtext */}
              <div className="pt-4 border-t border-brand-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002</span>
                </div>
                <div className="flex items-center gap-2 text-gold-300 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call: 6206175583, 6299476228</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card with Official Logo */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Gold glowing halo */}
                <div className="absolute -inset-2 bg-gradient-to-r from-gold-500 to-brand-500 rounded-3xl blur-2xl opacity-30"></div>

                {/* Primary Card */}
                <div className="relative bg-obsidian-950 rounded-3xl shadow-2xl border-2 border-gold-500/40 overflow-hidden text-center p-6 sm:p-8">
                  {/* Crest Logo Display */}
                  <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 mb-6">
                    <img
                      src="/trust-patho-lab-logo.jpg"
                      alt="Trust Patho Lab Official Crest Logo"
                      className="w-full h-full object-cover rounded-full border-4 border-gold-400 shadow-xl shadow-gold-500/20"
                    />
                    <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-gold-500 text-obsidian-950 font-black text-[10px] tracking-wider uppercase shadow">
                      SINCE 2024
                    </div>
                  </div>

                  <h3 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">
                    TRUST PATHO LAB
                  </h3>
                  <p className="text-xs font-bold text-gold-300 uppercase tracking-widest mt-1">
                    PATHOLOGY LABORATORY • GAYA
                  </p>

                  <div className="mt-5 p-3.5 bg-brand-950/70 rounded-2xl border border-gold-500/30 text-left space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Government Registration:</span>
                      <strong className="text-gold-400">2291212131723</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Operating Mode:</span>
                      <strong className="text-emerald-400">24/7 Non-Stop Service</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Phlebotomy Transit:</span>
                      <strong className="text-slate-200">Cold-Chain Preserved</strong>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-brand-900/60 flex items-center justify-around text-xs">
                    <div>
                      <div className="text-lg font-black text-gold-400">62+</div>
                      <div className="text-[11px] text-slate-400">Tests Catalog</div>
                    </div>
                    <div className="h-7 w-px bg-brand-900"></div>
                    <div>
                      <div className="text-lg font-black text-gold-400">8</div>
                      <div className="text-[11px] text-slate-400">Facilities</div>
                    </div>
                    <div className="h-7 w-px bg-brand-900"></div>
                    <div>
                      <div className="text-lg font-black text-gold-400">100%</div>
                      <div className="text-[11px] text-slate-400">Certified Lab</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EIGHT SPECIALIZED FACILITIES SHOWCASE */}
      <section id="services-section" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Complete Clinical Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950 mt-1">
              8 Diagnostic Facilities Available
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Comprehensive specialized pathological analyses conducted under stringent calibration and aseptic standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EIGHT_FACILITIES.map((fac, idx) => {
              const IconComp = fac.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-gold-500/60 hover:bg-white hover:shadow-md transition duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-900 text-gold-400 flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-800 transition">
                        {fac.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-800">
                        {fac.testsCount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <a
                      href="#test-price-list"
                      className="text-brand-700 font-bold hover:text-gold-600 transition flex items-center gap-1"
                    >
                      View Tests <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. OFFICIAL TEST PRICE LIST (62 TESTS SEARCHABLE & RESPONSIVE) */}
      <PriceListSection />

      {/* 4. ABOUT TRUST PATHO LAB & GAYA CLINICAL DESK */}
      <section id="lab-details" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full inline-block">
                  About Trust Patho Lab
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-obsidian-950">
                  Reliable Clinical Diagnostics Serving Gaya Since 2024
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Established in 2024 and officially registered under <strong>Reg. No. 2291212131723</strong>, Trust Patho Lab operates with an unwavering dedication to clinical precision, rapid sample turnaround, and patient convenience. Located at Gaya Patna Road, Iqbal Nagar (near Karbala), we offer 24/7 pathology services with trained phlebotomists who travel to your home with complete sterile kit bags.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Vacuum Tube Collection</strong>
                      <span className="text-slate-500">Color-coded vacutainers prevent hemolysis and contamination.</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Cold-Chain Transit</strong>
                      <span className="text-slate-500">Specimens kept at monitored temperatures until machine aspiration.</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Digital & Printed Reports</strong>
                      <span className="text-slate-500">Verified reports delivered online with print and PDF export.</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Transparent Government Pricing</strong>
                      <span className="text-slate-500">Fixed rate-card matching the official laboratory price schedule.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="lg:col-span-5 bg-obsidian-950 text-white rounded-2xl p-6 sm:p-7 border-2 border-gold-500/40 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/trust-patho-lab-logo.jpg"
                    alt="Logo"
                    className="w-10 h-10 rounded-full border border-gold-400 object-cover"
                  />
                  <div>
                    <h4 className="font-extrabold text-white text-base">Gaya Laboratory Desk</h4>
                    <span className="text-xs text-gold-400">Reg. No. 2291212131723</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-900/60">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002, Bihar
                    </p>
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
                    <Share2 className="w-3.5 h-3.5" />
                    WhatsApp Phlebotomist Dispatch
                  </a>
                  <a
                    href="tel:6206175583"
                    className="w-full bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs py-3 rounded-xl border border-gold-500/40 transition flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
                    Direct Call: 6206175583
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Seamless Doorstep Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-obsidian-950 mt-1">
              How Trust Patho Lab Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Book clinical diagnostics at home in 4 straightforward, transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-brand-900 text-gold-300 font-black text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-base">Select Your Test</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Choose any test or profile from our official 62-test price list at transparent government-compliant rates.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-brand-900 text-gold-300 font-black text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-base">Select Date & Time</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Choose your convenient doorstep slot. Fasting early morning slots (6 AM - 10 AM) are prioritized.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-brand-900 text-gold-300 font-black text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-base">Home Visit & Collection</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                A verified lab technician visits with vacuum vials, performs painless collection, and stores samples in cold-chain.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-brand-900 text-gold-300 font-black text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-base">Get Digital Report</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Receive certified digital reports with QR verification on WhatsApp, patient dashboard, or print PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-obsidian-950 text-white border-t border-brand-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 border border-gold-500/40 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Same-Day Doorstep Phlebotomist Slots Available in Gaya
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
              <PhoneCall className="w-4 h-4 text-gold-400" />
              Call 6206175583
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
