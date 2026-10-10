import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  PhoneCall,
  CalendarCheck,
  Printer,
  Sparkles,
  ShieldCheck,
  Clock,
  Droplet,
  FileText,
  CheckCircle2,
  Share2,
  ExternalLink,
  Info,
  Download,
} from 'lucide-react';
import { dbService } from '../../services/db';
import { LabTest, LabCategory } from '../../types';

interface PriceListSectionProps {
  onSelectTestForBooking?: (test: LabTest) => void;
  standalone?: boolean;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Tests (62)', value: 'All' },
  { label: 'Haematology', value: 'Haematology' },
  { label: 'Biochemistry', value: 'Biochemistry' },
  { label: 'Hormones', value: 'Hormones' },
  { label: 'Serology', value: 'Serology' },
  { label: 'Immunology', value: 'Immunology' },
  { label: 'Fluid Analysis', value: 'Fluid Analysis' },
  { label: 'Histopathology', value: 'Histopathology' },
  { label: 'FNAC', value: 'FNAC' },
  { label: 'Special Profiles', value: 'Special Profiles' },
];

export const PriceListSection: React.FC<PriceListSectionProps> = ({
  onSelectTestForBooking,
  standalone = false,
}) => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [flyerModalTab, setFlyerModalTab] = useState<'structured' | 'original'>('structured');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const data = await dbService.getLabTests();
        setTests(data);
      } catch (err) {
        console.error('Error loading tests:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, []);

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      String(t.slNo).includes(search);

    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;

    let matchesPrice = true;
    if (priceRange === 'under-200') matchesPrice = t.price <= 200;
    else if (priceRange === '200-1000') matchesPrice = t.price > 200 && t.price <= 1000;
    else if (priceRange === 'above-1000') matchesPrice = t.price > 1000;

    return matchesSearch && matchesCat && matchesPrice;
  });

  const handleBookTest = (test: LabTest) => {
    if (onSelectTestForBooking) {
      onSelectTestForBooking(test);
    } else {
      navigate(`/book?testId=${test.id}&testName=${encodeURIComponent(test.name)}&price=${test.price}`);
    }
  };

  const getWhatsAppLink = (test: LabTest) => {
    const text = encodeURIComponent(
      `Hello Trust Patho Lab! I want to book the following test for home sample collection:\n\nTest: ${test.name} (${test.fullName})\nPrice: ₹${test.price}\n\nPlease confirm availability and dispatch schedule.`
    );
    return `https://wa.me/916206175583?text=${text}`;
  };

  return (
    <section id="test-price-list" className={`py-16 ${standalone ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
            <span>Govt. Reg. No. 229112131723 • Estd. 2024</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-obsidian-950 tracking-tight">
            Official Pathology <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-gold-600">Test Price List</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5">
            Transparent, government-compliant pathology pricing with zero hidden surcharges. All 62 diagnostic tests from our official laboratory catalog with 24/7 doorstep sample collection in Gaya & Bihar.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-brand-600" /> 24/7 Hour Service
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
              <Droplet className="w-3.5 h-3.5 text-rose-500" /> Sterile Vacuum Cold-Chain
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-600" /> Multi-Brand Special Tests
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Live Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by test name, code, or profile (e.g. CBC, LFT, Sugar, TSH, HIV, Biopsy)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="md:col-span-3">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                aria-label="Filter tests by price range"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Price Ranges</option>
                <option value="under-200">Pocket-Friendly (Under ₹200)</option>
                <option value="200-1000">Standard Tests (₹200 - ₹1,000)</option>
                <option value="above-1000">Special Profiles (Above ₹1,000)</option>
              </select>
            </div>

            {/* View Mode & Print Action */}
            <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-2">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'table' ? 'bg-white text-brand-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ledger Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'cards' ? 'bg-white text-brand-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cards
                </button>
              </div>

              <button
                onClick={() => setShowPrintModal(true)}
                className="px-3 py-2 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 border border-gold-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="View and print official laboratory price flyer"
              >
                <Printer className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden sm:inline">Print Flyer</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-slate-100 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                  selectedCategory === cat.value
                    ? 'bg-brand-900 text-gold-300 border border-gold-500/40 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs text-slate-500">
          <span>Showing <strong>{filteredTests.length}</strong> of {tests.length} official tests</span>
          <span className="text-[11px] text-brand-700 font-medium">Free Doorstep Phlebotomist Visit on orders above ₹500</span>
        </div>

        {/* 1. TABLE / LEDGER VIEW (Matches Flyer Layout) */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-obsidian-950 text-gold-300 text-xs font-bold uppercase tracking-wider border-b border-brand-900">
                    <th className="py-3.5 px-4 w-16 text-center">Sl.No.</th>
                    <th className="py-3.5 px-4">Test Name (Official Acronym)</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Clinical Details & Category</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Sample & Turnaround</th>
                    <th className="py-3.5 px-4 text-right">Official Price</th>
                    <th className="py-3.5 px-4 text-center w-48">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      className="hover:bg-brand-50/40 transition group"
                    >
                      {/* Sl.No matching original flyer */}
                      <td className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 group-hover:text-brand-900">
                        {test.slNo}.
                      </td>

                      {/* Test Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 group-hover:text-brand-700 transition flex items-center gap-2">
                          <span>{test.name}</span>
                          {test.fastingRequired && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-medium px-1.5 py-0.5 rounded">
                              Fasting Req.
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-normal md:hidden mt-0.5">
                          {test.fullName}
                        </div>
                      </td>

                      {/* Clinical Details */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="text-xs font-medium text-slate-800">{test.fullName}</div>
                        <div className="text-[11px] text-brand-600 font-semibold">{test.category}</div>
                      </td>

                      {/* Sample & Turnaround */}
                      <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-slate-600">
                        <div>{test.sampleType}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {test.turnaroundTime}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="text-base font-black text-obsidian-950">
                          ₹{test.price}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">Home Visit Ready</div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleBookTest(test)}
                            className="bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-gold-500/40 transition shadow-xs flex items-center gap-1 active:scale-95"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
                            Book
                          </button>
                          <a
                            href={getWhatsAppLink(test)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-2.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1"
                            title="Inquire or book via WhatsApp"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span className="hidden lg:inline">WhatsApp</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredTests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No tests found matching "{search}"</p>
                        <p className="text-xs text-slate-400 mt-1">Try searching by category, medical keyword, or reset filters.</p>
                        <button
                          onClick={() => { setSearch(''); setSelectedCategory('All'); setPriceRange('all'); }}
                          className="mt-3 text-xs text-brand-600 font-bold hover:underline"
                        >
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. CARD CATALOG VIEW */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand-500 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400">Sl. {test.slNo}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                      {test.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-700 transition">
                    {test.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {test.fullName}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Sample:</span>
                      <strong className="text-slate-800 font-medium">{test.sampleType}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Turnaround:</span>
                      <strong className="text-slate-800 font-medium">{test.turnaroundTime}</strong>
                    </div>
                    {test.fastingRequired && (
                      <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium mt-1">
                        Overnight fasting (8-10 hrs) required
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Test Fee</div>
                    <div className="text-xl font-black text-obsidian-950">₹{test.price}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={getWhatsAppLink(test)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                      title="Quick WhatsApp Booking"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleBookTest(test)}
                      className="bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-gold-500/40 transition shadow-xs"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Clinical Assurance Banner */}
        <div className="mt-12 bg-gradient-to-r from-obsidian-950 via-brand-950 to-obsidian-950 rounded-3xl p-6 sm:p-8 text-white border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Need Multiple Diagnostic Tests?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Consult Our Gaya Phlebotomy Desk
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              We arrange certified phlebotomists with sterile barcoded vacutainer vials directly to your residence anywhere across Gaya and surrounding districts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:6206175583"
              className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Call 6206175583
            </a>
            <a
              href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20blood%20test%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 border border-emerald-400/40"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* PRINT FLYER MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3 no-print">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-brand-700" />
                  Official Trust Patho Lab Price List
                </h3>
                <p className="text-xs text-slate-500">Government Registered Rate Master • 62 Pathology Tests</p>
              </div>

              {/* View Switcher: Document vs Original Photo */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setFlyerModalTab('structured')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      flyerModalTab === 'structured'
                        ? 'bg-white text-purple-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Printable Document
                  </button>
                  <button
                    onClick={() => setFlyerModalTab('original')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      flyerModalTab === 'original'
                        ? 'bg-white text-purple-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Original Flyer Photo
                  </button>
                </div>

                {flyerModalTab === 'structured' && (
                  <button
                    onClick={() => window.print()}
                    className="bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                )}

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-2 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* View Mode 1: Original Flyer Photo */}
            {flyerModalTab === 'original' && (
              <div className="mt-4 flex flex-col items-center justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <img
                  src="/price-list.jpeg"
                  alt="Official Trust Patho Lab Price List Flyer"
                  className="max-h-[72vh] w-auto object-contain rounded-xl shadow-2xl border border-amber-400/30"
                />
                <a
                  href="/price-list.jpeg"
                  download="trust-patho-lab-price-list.jpeg"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-purple-950 text-xs font-black hover:bg-amber-300 transition shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Full-Resolution Flyer Image
                </a>
              </div>
            )}

            {/* View Mode 2: Printable Structured Document Matching Flyer */}
            {flyerModalTab === 'structured' && (
              <div className="mt-4 printable-report border border-slate-300 p-6 rounded-2xl bg-white">
                {/* Header Box */}
                <div className="bg-obsidian-950 text-white p-6 rounded-xl border-2 border-gold-500/60 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold-500/30 pb-4">
                  <div className="text-xs text-gold-300 font-semibold">
                    Reg. No. 229112131723
                  </div>
                  <div className="text-xs text-gold-300 font-semibold flex items-center gap-2">
                    <span>WhatsApp / Contact: 6206175583, 6299476228, 9142661354</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 py-4 text-center">
                  <img
                    src="/trust-patho-lab-logo.png"
                    alt="Trust Patho Lab Logo"
                    className="w-16 h-16 rounded-full border-2 border-gold-400 object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
                    }}
                  />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">
                      TRUST PATHO LAB
                    </h1>
                    <div className="text-xs uppercase tracking-widest text-gold-300 font-bold">
                      PATHOLOGY LABORATORY • ESTABLISHED 2024
                    </div>
                  </div>
                </div>

                <div className="text-center text-[11px] text-slate-300 border-t border-gold-500/30 pt-3">
                  ADD : GAYA PATNA ROAD, IQBAL NAGAR, NEAR KARBALA, GAYA – 823002 (BIHAR)
                </div>
              </div>

              {/* Price List Two-Column Grid (Exact layout from flyer) */}
              <div className="text-center font-black text-lg text-rose-700 uppercase tracking-wider mb-4 border-b-2 border-rose-600 pb-1">
                OFFICIAL PRICE LIST
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs">
                {tests.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-1 border-b border-dotted border-slate-300"
                  >
                    <span className="font-bold text-slate-900">
                      {t.slNo}. {t.name}
                    </span>
                    <span className="font-black text-slate-900">₹{t.price}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Details from Flyer */}
              <div className="mt-8 pt-4 border-t-2 border-slate-900 text-center space-y-2">
                <div className="text-xs font-black text-brand-900 uppercase tracking-wide">
                  24/7 HOUR SERVICE • HOME COLLECTION FACILITY AVAILABLE • MULTI BRAND SPECIAL PATHOLOGICAL TESTS
                </div>
                <div className="text-[11px] font-semibold text-slate-700">
                  Facility: Haematology | Serology | Hormones | Biochemistry | Fluid Analysis | Histopathology | Immunology | FNAC
                </div>
                <div className="text-[10px] text-slate-500 italic mt-3 pt-2 border-t border-slate-200">
                  THIS REPORT IS ONLY FOR A PROFESSION OPINION CO-RELATE CLINICALLY. NOT TO BE USED FOR MEDICO LEGAL PURPOSE
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </section>
  );
};
