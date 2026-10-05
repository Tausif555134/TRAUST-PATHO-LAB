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
  HeartPulse,
  Award,
  Sparkles,
} from 'lucide-react';
import { dbService } from '../services/db';
import { Service, Review } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';

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
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                <span className="text-brand-900 font-bold">New:</span> 45-Minute Rapid Doorstep Doctor Dispatch
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Healthcare at Your <span className="text-brand-600">Doorstep</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Book trusted healthcare services and get professional care at your home. Verified doctors, registered nurses, and painless lab technicians dispatched on demand.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base px-7 py-4 rounded-2xl shadow-lg shadow-brand-500/25 transition active:scale-95"
                >
                  <CalendarCheck className="w-5 h-5" />
                  Book a Home Checkup
                </Link>
                <a
                  href="#services-section"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base px-7 py-4 rounded-2xl border border-slate-200 shadow-xs transition hover:border-brand-300"
                >
                  View Services
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Quick Metrics / Social Proof */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-slate-900">4.9/5</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Patient Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">10,000+</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Home Visits Done</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Verified Clinicians</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-400 to-emerald-300 rounded-3xl blur-xl opacity-30"></div>

                {/* Primary Card */}
                <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                  <div className="relative h-72 sm:h-80 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                      alt="Doctor home visit checkup"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-brand-500 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
                        Active Clinician on Duty
                      </span>
                      <h4 className="text-lg font-bold">Dr. Aisha Sharma & Team</h4>
                      <p className="text-xs text-slate-200">
                        Dispatched with sterile diagnostics and emergency vitals monitors.
                      </p>
                    </div>
                  </div>

                  {/* Micro Live Tracker Preview */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Instant Digital Report</div>
                        <div className="text-[11px] text-slate-500">Delivered within 30 mins of visit</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-600">Safe & HIPAA-Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section id="trust-section" className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Families Rely on TRUST PATHO LAB
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              We uphold the highest clinical standards of hospital infection control, privacy, and clinician credentialing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Verified Healthcare Professionals</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Background-checked doctors, nurses, and technicians with government license verification.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Home Visit Service</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                No hospital queues or risk of cross-infection. Premium care delivered right to your living room.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Flexible Scheduling</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Choose convenient 1-hour appointment slots from 7:00 AM to 8:00 PM, 7 days a week.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Secure Patient Information</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                256-bit encrypted medical reports accessible strictly to you and your assigned clinician.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Transparent Pricing</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Clear all-inclusive upfront pricing. Zero surprise travel charges or hidden consumable fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC SERVICES SECTION */}
      <section id="services-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-700 font-semibold text-xs uppercase tracking-wider mb-1">
              <HeartPulse className="w-4 h-4" />
              Clinical Offerings
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Doorstep Health Services
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              From general checkups and certified nursing to painless blood collection and 12-lead ECGs.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search checkup, test, doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white shadow-xs outline-none"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">No matching healthcare services found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or reset category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl"
            >
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW IT WORKS (4 Simple Steps) */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Seamless Patient Experience
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              How TRUST PATHO LAB Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Get professional medical care at home in 4 straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-brand-500/25 mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Choose a Service</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Select your required checkup, test package, or consultation from our clinical catalog.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-brand-500/25 mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Select Date & Time</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pick a slot that fits your day and input your doorstep address with GPS landmark details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-brand-500/25 mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Professional Visits Home</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                A verified clinician arrives with sterile equipment, performs the procedure, and checks vitals.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-brand-50 border border-brand-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-emerald-500/25 mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900">Get Your Report</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Access your digitally signed medical report, vitals log, and prescription right in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PATIENT TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Trusted by Over 10,000+ Families
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Read verified feedback from patients who booked checkups at their doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{rev.patientName}</span>
                    <span className="text-[10px] text-slate-400">{rev.serviceName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Visit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-semibold border border-slate-700">
            <Sparkles className="w-4 h-4" />
            Same-Day Slots Available in Your Area
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Need healthcare at home? Book your visit today.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Experience hospital-grade care in the privacy, hygiene, and comfort of your home.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/20 transition active:scale-95"
            >
              Book a Home Visit Now
            </Link>
            <a
              href="tel:1800-TRUST-LAB"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Call 1800-TRUST-LAB
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
