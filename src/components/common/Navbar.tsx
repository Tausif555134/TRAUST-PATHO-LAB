import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  PhoneCall,
  Bell,
  User,
  ShieldCheck,
  Stethoscope,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useNotifications } from '../../features/notifications/NotificationContext';

export const Navbar: React.FC<{ onOpenAuthModal: () => void }> = ({ onOpenAuthModal }) => {
  const { currentUser, role, logout, switchPersona, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const hotline = import.meta.env.VITE_HOTLINE_PHONE || '1800-TRUST-LAB';

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'professional') return '/professional/dashboard';
    return '/patient/dashboard';
  };

  const getDashboardLabel = () => {
    if (role === 'admin') return 'Admin Console';
    if (role === 'professional') return 'Clinician Portal';
    return 'Patient Dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Demo Persona & Emergency Helpline Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Emergency Helpline */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Home Healthcare Dispatch:
            </span>
            <a
              href={`tel:${hotline}`}
              className="font-medium text-white hover:text-emerald-300 transition flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              {hotline}
            </a>
          </div>

          {/* Quick Persona Switcher for Evaluation */}
          <div className="flex items-center gap-2 relative">
            <span className="text-slate-400 text-[11px] hidden md:inline flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Live Demo Persona:
            </span>
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
              >
                <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                <span>
                  {role === 'admin' && 'Admin Console'}
                  {role === 'professional' && `Clinician: ${currentUser?.fullName?.split(' ')[0] || 'Pro'}`}
                  {role === 'patient' && `Patient: ${currentUser?.fullName?.split(' ')[0] || 'User'}`}
                  {role === 'guest' && 'Guest Mode'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchPersona('patient_rajesh');
                      setPersonaDropdownOpen(false);
                      navigate('/patient/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Rajesh Verma</div>
                      <div className="text-[10px] text-slate-500">Patient (Upcoming Visits)</div>
                    </div>
                    {role === 'patient' && currentUser?.fullName?.includes('Rajesh') && (
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('doctor_aisha');
                      setPersonaDropdownOpen(false);
                      navigate('/professional/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Dr. Aisha Sharma</div>
                      <div className="text-[10px] text-slate-500">Doctor (Consults & Vitals)</div>
                    </div>
                    {role === 'professional' && currentUser?.fullName?.includes('Aisha') && (
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('nurse_sunita');
                      setPersonaDropdownOpen(false);
                      navigate('/professional/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Sister Sunita Rao</div>
                      <div className="text-[10px] text-slate-500">Nurse (Wound & Injections)</div>
                    </div>
                    {role === 'professional' && currentUser?.fullName?.includes('Sunita') && (
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('admin');
                      setPersonaDropdownOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between border-t border-slate-100"
                  >
                    <div>
                      <div className="font-semibold text-purple-700">Operations Admin</div>
                      <div className="text-[10px] text-slate-500">Dispatch & Staff Management</div>
                    </div>
                    {role === 'admin' && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('guest');
                      setPersonaDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between border-t border-slate-100 text-slate-600"
                  >
                    <div>
                      <div className="font-medium">Guest (Browsing)</div>
                      <div className="text-[10px] text-slate-400">View public pages</div>
                    </div>
                    {role === 'guest' && <span className="w-2 h-2 rounded-full bg-slate-400"></span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition">
            <HeartPulse className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition">
              TRUST <span className="text-brand-600">PATHO LAB</span>
            </span>
            <span className="block text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-1">
              Pathology & Diagnostics
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-brand-600 transition"
          >
            Home
          </Link>
          <a
            href="/#services-section"
            className="text-sm font-medium text-slate-700 hover:text-brand-600 transition"
          >
            Services Catalog
          </a>
          <a
            href="/#how-it-works"
            className="text-sm font-medium text-slate-700 hover:text-brand-600 transition"
          >
            How It Works
          </a>
          <a
            href="/#trust-section"
            className="text-sm font-medium text-slate-700 hover:text-brand-600 transition"
          >
            Safety & Trust
          </a>
        </nav>

        {/* Right Action Icons & Dashboard */}
        <div className="flex items-center gap-3">
          {/* Direct CTA */}
          <Link
            to="/book"
            className="hidden sm:inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Checkup
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                  <span className="text-xs text-brand-600 font-medium">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.link) {
                            navigate(n.link);
                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                          !n.isRead ? 'bg-brand-50/50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View All in Dashboard →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Dashboard Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition text-xs font-semibold text-slate-800"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-500/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                    {currentUser?.fullName?.[0] || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline">{getDashboardLabel()}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition shadow-sm"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-brand-600"
          >
            Home
          </Link>
          <a
            href="/#services-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-brand-600"
          >
            Services Catalog
          </a>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-brand-600"
          >
            How It Works
          </a>
          <a
            href="/#trust-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-brand-600"
          >
            Safety & Trust
          </a>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-brand-600"
          >
            Book a Home Checkup Now →
          </Link>
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-900 border-t border-slate-100 pt-3"
            >
              Go to {getDashboardLabel()}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
