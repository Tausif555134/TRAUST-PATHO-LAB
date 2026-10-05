import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'patient',
  onSuccess,
}) => {
  const { login, signup, switchPersona } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [role, setRole] = useState<UserRole>(defaultRole);

  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        await login(emailOrPhone, role);
        onSuccess?.();
        onClose();
      } else if (mode === 'signup') {
        await signup(fullName, email, phone, role);
        onSuccess?.();
        onClose();
      } else if (mode === 'forgot') {
        setMessage('A reset verification link has been sent to your registered contact.');
      }
    } catch (err: any) {
      setMessage(err?.message || 'Authentication failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (persona: 'patient_rajesh' | 'doctor_aisha' | 'nurse_sunita' | 'admin') => {
    switchPersona(persona);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-brand-600 to-emerald-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2 text-brand-100 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            CarePulse Secure Portal
          </div>
          <h3 className="text-xl font-bold">
            {mode === 'login' && 'Sign in to CarePulse'}
            {mode === 'signup' && 'Create Your Patient Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-brand-100/90 mt-1">
            Access doorstep checkup bookings, digital medical records, and live visit status.
          </p>
        </div>

        {/* 1-Click Demo Personas */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Instant Demo Logins</span>
            <span className="text-brand-600">Click to switch</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('patient_rajesh')}
              className="text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-xs transition text-xs"
            >
              <div className="font-bold text-slate-900">Rajesh Verma</div>
              <div className="text-[10px] text-slate-500">Patient Dashboard</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('doctor_aisha')}
              className="text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-xs transition text-xs"
            >
              <div className="font-bold text-slate-900">Dr. Aisha Sharma</div>
              <div className="text-[10px] text-slate-500">Doctor Portal</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('nurse_sunita')}
              className="text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-xs transition text-xs"
            >
              <div className="font-bold text-slate-900">Sister Sunita Rao</div>
              <div className="text-[10px] text-slate-500">Visiting Nurse</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="text-left p-2 rounded-xl bg-white border border-purple-200 hover:border-purple-500 hover:shadow-xs transition text-xs"
            >
              <div className="font-bold text-purple-900">Admin Operations</div>
              <div className="text-[10px] text-slate-500">Command Center</div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div className="p-3 rounded-xl bg-brand-50 text-brand-800 text-xs flex items-center gap-2 border border-brand-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-600" />
              <span>{message}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'signup' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter phone (+91) or email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              'Verifying...'
            ) : mode === 'login' ? (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>

          {/* Toggle between Login and Signup */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
