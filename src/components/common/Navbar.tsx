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
      {/* Top Details & 24/7 Helpline Bar */}
      <div className="bg-obsidian-950 text-slate-200 text-xs py-1.5 px-4 sm:px-6 border-b border-brand-900/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Reg No & Gaya Address */}
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="hidden lg:inline text-gold-400 font-bold">
              Reg. No. 229112131723
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-slate-300 truncate max-w-xs xl:max-w-md">
              📍 Gaya Patna Road, Iqbal Nagar, Near Karbala, Gaya – 823002
            </span>
          </div>

          {/* Emergency 24/7 Helpline & WhatsApp */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gold-400 font-bold tracking-wide text-xs">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
              <span className="hidden sm:inline">24/7 Call:</span>
              <a href="tel:6206175583" className="hover:text-gold-200 underline decoration-dotted transition">
                6206175583
              </a>
              <span className="text-slate-500">/</span>
              <a href="tel:6299476228" className="hover:text-gold-200 underline decoration-dotted transition hidden sm:inline">
                6299476228
              </a>
              <span className="text-slate-500 hidden md:inline">/</span>
              <a href="tel:9142661354" className="hover:text-gold-200 underline decoration-dotted transition hidden md:inline">
                9142661354
              </a>
            </div>

            <a
              href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20inquire%20about%20a%20pathology%20test."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded transition flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>WhatsApp</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo with Official Image */}
        <Link to="/" className="flex items-center gap-3 sm:gap-3.5 group shrink-0 select-none">
          <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14">
            <img
              src="/trust-patho-lab-logo.png"
              alt="Trust Patho Lab Official Logo"
              className="w-full h-full rounded-full border-2 border-gold-500 object-cover shadow-md group-hover:scale-105 transition duration-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col justify-center whitespace-nowrap">
            <span className="text-lg sm:text-xl font-black tracking-tight text-obsidian-950 leading-none group-hover:text-brand-800 transition">
              TRUST <span className="text-gold-600 font-extrabold">PATHO LAB</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-brand-800 uppercase mt-1 leading-none">
              Pathology Laboratory • Gaya
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-6 shrink-0">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-700 hover:text-brand-800 transition whitespace-nowrap"
          >
            Home
          </Link>
          <a
            href="/#test-price-list"
            className="text-sm font-bold text-brand-900 hover:text-gold-600 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Test Price List</span>
            <span className="text-[10px] bg-gold-100 text-gold-900 border border-gold-400 font-black px-2 py-0.5 rounded-full whitespace-nowrap">
              62 Tests
            </span>
          </a>
          <a
            href="/#services-section"
            className="text-sm font-semibold text-slate-700 hover:text-brand-800 transition whitespace-nowrap"
          >
            Clinical Facilities
          </a>
          <a
            href="/#lab-details"
            className="text-sm font-semibold text-slate-700 hover:text-brand-800 transition whitespace-nowrap"
          >
            About Lab
          </a>
          <a
            href="/#how-it-works"
            className="text-sm font-semibold text-slate-700 hover:text-brand-800 transition whitespace-nowrap"
          >
            How It Works
          </a>
          <a
            href="/#lab-details"
            className="text-sm font-semibold text-slate-700 hover:text-brand-800 transition whitespace-nowrap"
          >
            Contact
          </a>
        </nav>

        {/* Right Action Icons & Dashboard */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick WhatsApp Action */}
          <a
            href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20test%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-2 rounded-xl border border-emerald-300 transition whitespace-nowrap shrink-0"
            title="WhatsApp Gaya Desk"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Direct Booking CTA */}
          <Link
            to="/book"
            className="inline-flex items-center gap-1.5 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gold-500/40 shadow-xs transition active:scale-95 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Book Home Visit</span>
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
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition text-xs font-semibold text-slate-800 whitespace-nowrap"
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
              className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition shadow-sm whitespace-nowrap"
            >
              Sign In
            </button>
          )}

          {/* Mobile / Tablet Menu Button (visible on screens below xl) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (visible on screens below xl when open) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-brand-600"
          >
            Home
          </Link>
          <a
            href="/#test-price-list"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm font-bold text-brand-900 hover:text-gold-600"
          >
            <span>Test Price List</span>
            <span className="text-[10px] bg-gold-100 text-gold-900 border border-gold-400 font-bold px-2 py-0.5 rounded-full">
              62 Tests
            </span>
          </a>
          <a
            href="/#services-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
          >
            Clinical Facilities
          </a>
          <a
            href="/#lab-details"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
          >
            About Lab
          </a>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
          >
            How It Works
          </a>
          <a
            href="/#lab-details"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
          >
            Contact
          </a>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20test%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Gaya Desk</span>
            </a>
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs py-2.5 rounded-xl border border-gold-500/40 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <span>Book Home Visit</span>
            </Link>
          </div>
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
