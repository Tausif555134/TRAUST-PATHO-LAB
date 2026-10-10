import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  X,
  Share2,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloatingContactButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* ─── Floating Button ─────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Contact Trust Patho Lab"
          aria-expanded={isOpen}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 font-black text-xs sm:text-sm px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full shadow-xl shadow-black/30 border border-gold-300 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400"
        >
          {/* Subtle pulse ring when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-gold-400/30 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-5 h-5 text-obsidian-950" />
          ) : (
            <PhoneCall className="w-5 h-5 text-obsidian-950" />
          )}

          <span className="hidden sm:inline font-black tracking-tight">
            {isOpen ? 'Close' : 'Contact Lab'}
          </span>
        </button>
      </div>

      {/* ─── Contact Modal / Bottom Sheet ─────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          {/* Backdrop click area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-panel-title"
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom-4 duration-200"
          >
            {/* Header */}
            <div className="bg-obsidian-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-brand-900/60">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/trust-patho-lab-logo.png"
                  alt="Trust Patho Lab"
                  className="w-10 h-10 rounded-full border border-gold-400 object-cover shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
                  }}
                />
                <div className="min-w-0">
                  <h3 id="contact-panel-title" className="font-black text-sm sm:text-base text-white truncate">
                    Trust Patho Lab Gaya
                  </h3>
                  <p className="text-[11px] text-gold-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>24/7 Phlebotomy & Sample Collection</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                aria-label="Close contact panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
              {/* Primary Call */}
              <a
                href="tel:6206175583"
                className="flex items-center justify-between p-3 rounded-2xl bg-brand-50 border border-brand-200 hover:bg-brand-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-brand-800">Direct Call (Primary)</div>
                    <div className="text-sm font-black text-slate-900">+91 6206175583</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-600 group-hover:translate-x-0.5 transition" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20inquire%20about%20a%20pathology%20test%20or%20book%20a%20home%20visit."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-800">WhatsApp Chat</div>
                    <div className="text-sm font-black text-slate-900">+91 6206175583</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition" />
              </a>

              {/* Additional Numbers */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Additional Phone Lines</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                  <a
                    href="tel:6299476228"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-center transition"
                  >
                    6299476228
                  </a>
                  <a
                    href="tel:9142661354"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-center transition"
                  >
                    9142661354
                  </a>
                </div>
              </div>

              {/* Email */}
              <a
                href="mailto:care@trustpatholab.com"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Official Email</div>
                  <div className="font-bold text-slate-900 truncate">care@trustpatholab.com</div>
                </div>
              </a>

              {/* Physical Lab Address */}
              <a
                href="https://maps.google.com/?q=Gaya+Patna+Road+Iqbal+Nagar+Gaya+Bihar+823002"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-gold-600" />
                </div>
                <div className="min-w-0 text-slate-700 leading-snug">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Laboratory Address</div>
                  <p className="text-[11px] mt-0.5">
                    Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002, Bihar
                  </p>
                  <span className="text-[10px] font-bold text-brand-700 inline-flex items-center gap-1 mt-1">
                    Open in Maps <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </a>

              {/* Direct Booking CTA */}
              <div className="pt-2">
                <Link
                  to="/book"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-gold-500/40 shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Book Home Sample Collection Online →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
