import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group hover:border-brand-300">
      {/* Service Header / Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700">
            <ShieldCheck className="w-12 h-12 stroke-[1.5]" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/95 backdrop-blur-sm text-brand-700 font-medium text-xs px-2.5 py-1 rounded-full shadow-sm border border-brand-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            {service.category}
          </span>
          {service.popular && (
            <span className="bg-amber-500 text-white font-semibold text-xs px-2 py-0.5 rounded-full shadow-sm">
              Popular
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {service.durationMinutes} mins home visit
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">
            {service.name}
          </h3>

          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Quick Inclusions */}
          <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
            {service.inclusions.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
            {service.inclusions.length > 2 && (
              <span className="text-[11px] text-brand-600 font-medium block pl-5">
                +{service.inclusions.length - 2} more included items
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Home Visit Fee
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900">₹{service.price}</span>
              <span className="text-xs text-slate-400 font-normal">all-incl.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/services/${service.id}`}
              className="text-xs font-semibold text-slate-700 hover:text-brand-700 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Details
            </Link>
            <Link
              to={`/book?serviceId=${service.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-brand-600 text-white px-3.5 py-2 rounded-lg hover:bg-brand-700 transition shadow-sm hover:shadow"
            >
              Book
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
