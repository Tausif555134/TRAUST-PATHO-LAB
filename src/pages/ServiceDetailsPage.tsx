import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ShieldCheck,
  HeartPulse,
  Share2,
} from 'lucide-react';
import { dbService } from '../services/db';
import { Service } from '../types';

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 AM - 10:00 AM');

  const timeSlots = [
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM',
  ];

  // Generate next 7 selectable dates
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() + (i + 1) * 86400000);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const found = await dbService.getServiceById(id);
        if (found) {
          setService(found);
        }
      } catch (err) {
        console.error('Failed to load service details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <HeartPulse className="w-6 h-6 text-brand-600 animate-spin" />
          <span>Loading clinical service specifications...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Healthcare Service Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          The requested clinical procedure may have been deactivated or relocated.
        </p>
        <Link
          to="/"
          className="mt-6 px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl"
        >
          Return to All Services
        </Link>
      </div>
    );
  }

  const handleProceedBooking = () => {
    navigate(`/book?serviceId=${service.id}&date=${selectedDate}&slot=${encodeURIComponent(selectedSlot)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb / Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Services Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
                  {service.category}
                </span>
                {service.popular && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                    Most Booked
                  </span>
                )}
                <span className="text-xs text-slate-400 flex items-center gap-1 sm:ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  {service.durationMinutes} minutes duration
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {service.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                {service.description}
              </p>

              {/* Service Visual Preview */}
              {service.imageUrl && (
                <div className="mt-6 rounded-2xl overflow-hidden h-52 sm:h-72 border border-slate-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Inclusions Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                What's Included in This Visit
              </h2>
              <div className="space-y-3">
                {service.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Instructions Card */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
              <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Patient Preparation Guidelines
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900/90 list-disc list-inside">
                {service.preparationInstructions.map((prep, i) => (
                  <li key={i}>{prep}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Date, Slot Selector & Sticky Booking Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-md">
              <div className="border-b border-slate-100 pb-5 mb-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold text-slate-400 block">
                    All-Inclusive Fee
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ₹{service.price}
                    </span>
                    <span className="text-xs text-slate-400">/ doorstep visit</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Zero Travel Fees
                  </span>
                </div>
              </div>

              {/* 1. Select Available Date */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  1. Select Appointment Date
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setSelectedDate(item.iso)}
                        className={`p-2 rounded-xl sm:rounded-2xl text-center border transition flex flex-col items-center ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[9px] sm:text-[10px] font-medium uppercase opacity-80">
                          {item.dayName}
                        </span>
                        <span className="text-sm font-extrabold">{item.dateNum}</span>
                        <span className="text-[9px] opacity-70">{item.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Select Time Slot */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  2. Select 1-Hour Time Slot
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition text-center min-h-[40px] flex items-center justify-center ${
                          isSelected
                            ? 'bg-brand-50 border-brand-600 text-brand-800 ring-1 ring-brand-600'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security & Summary Points */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified clinician assigned after booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free cancellation up to 2 hours before visit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digital report delivered post-completion</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleProceedBooking}
                className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book This Checkup Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
