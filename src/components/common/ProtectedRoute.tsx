import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser, role, isAuthenticated } = useAuth();

  // If user is guest or not authenticated
  if (!isAuthenticated || role === 'guest') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            This portal is restricted to authorized patients, clinicians, and administrative staff of Trust Patho Lab.
            Please sign in or use the demo persona switcher in the top navigation bar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition min-h-[42px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              to="/book"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-gold-300 text-xs sm:text-sm font-bold border border-gold-500/40 shadow-xs transition min-h-[42px]"
            >
              <LogIn className="w-4 h-4 text-gold-400" />
              Book as Guest
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If role is not allowed
  if (allowedRoles && role && !allowedRoles.includes(role as UserRole)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Your current account role (<strong className="capitalize">{role}</strong>) does not have permission to view this console. Switch persona via the top bar or return to home.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition min-h-[42px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Pages
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
