import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  PhoneCall,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Calendar,
  FlaskConical,
  MapPin,
  Home,
  Share2,
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
  const location = useLocation();

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

  // Close menus on route change or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setPersonaDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setNotifDropdownOpen(false);
        setPersonaDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/tests', label: 'Test Price List', badge: '62 Tests' },
    { to: '/book', label: 'Book Home Visit' },
    { to: '/contact', label: 'Contact & Lab' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* ─── Top Utility Bar ──────────────────────────────────────────────── */}
      <div className="bg-obsidian-950 text-slate-200 text-xs py-1.5 px-3 sm:px-6 border-b border-brand-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Reg No & Lab Location */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-300">
            <span className="text-gold-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
              Reg. No. 229112131723
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden md:inline truncate max-w-xs xl:max-w-md">
              📍 Gaya Patna Road, Iqbal Nagar, Gaya – 823002
            </span>
          </div>

          {/* Right: Phone Hotline + Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Phone link */}
            <div className="flex items-center gap-1 text-gold-400 font-bold text-[11px] sm:text-xs">
              <PhoneCall className="w-3 h-3 text-gold-400 shrink-0" />
              <a href="tel:6206175583" className="hover:text-gold-200 transition">
                6206175583
              </a>
            </div>

            {/* Persona Switcher for Evaluation */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="bg-brand-900/80 hover:bg-brand-800 text-slate-100 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium flex items-center gap-1 border border-gold-500/30 transition"
                aria-expanded={personaDropdownOpen}
                aria-label="Switch Persona"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="truncate max-w-[100px] sm:max-w-[130px]">
                  {role === 'admin' && 'Admin Console'}
                  {role === 'professional' && `Clinician: ${currentUser?.fullName?.split(' ')[0] || 'Pro'}`}
                  {role === 'patient' && `Patient: ${currentUser?.fullName?.split(' ')[0] || 'User'}`}
                  {role === 'guest' && 'Guest Mode'}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 max-w-[calc(100vw-1.5rem)] bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchPersona('patient_rajesh');
                      setPersonaDropdownOpen(false);
                      navigate('/patient/dashboard');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between"
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
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between"
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
                      switchPersona('admin');
                      setPersonaDropdownOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between border-t border-slate-100"
                  >
                    <div>
                      <div className="font-semibold text-purple-700">Operations Admin</div>
                      <div className="text-[10px] text-slate-500">Price Management & Staff</div>
                    </div>
                    {role === 'admin' && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('guest');
                      setPersonaDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between border-t border-slate-100 text-slate-600"
                  >
                    <div>
                      <div className="font-medium">Guest (Public Browsing)</div>
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

      {/* ─── Main Navbar Header ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 select-none">
          <div className="relative shrink-0 w-10 h-10 sm:w-11 sm:h-11">
            <img
              src="/trust-patho-lab-logo.png"
              alt="Trust Patho Lab Official Logo"
              className="w-full h-full rounded-full border-2 border-gold-500 object-cover shadow-sm group-hover:scale-105 transition duration-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-base sm:text-lg font-black tracking-tight text-obsidian-950 leading-none group-hover:text-brand-800 transition truncate">
              TRUST <span className="text-gold-600 font-extrabold">PATHO LAB</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-brand-800 uppercase mt-0.5 leading-none truncate">
              Pathology Laboratory • Gaya
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-900 text-gold-300 shadow-xs'
                    : 'text-slate-700 hover:text-brand-900 hover:bg-slate-100'
                }`
              }
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gold-400/20 text-gold-600 border border-gold-400/40">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick WhatsApp Action (Hidden on tiny screens) */}
          <a
            href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20test."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-emerald-300 transition shrink-0"
            title="Chat on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          {/* Direct Booking CTA */}
          <Link
            to="/book"
            className="inline-flex items-center gap-1.5 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-gold-500/40 shadow-xs transition active:scale-95 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden xs:inline">Book Visit</span>
          </Link>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Notifications"
              aria-expanded={notifDropdownOpen}
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">Notifications</h4>
                  <span className="text-[10px] text-brand-600 font-medium">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.link) {
                            navigate(n.link);
                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`p-2.5 text-xs cursor-pointer hover:bg-slate-50 transition ${
                          !n.isRead ? 'bg-brand-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-900 text-xs mb-0.5">{n.title}</div>
                        <p className="text-[11px] text-slate-600 leading-tight">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-3 py-1.5 border-t border-slate-100 text-center">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View in Dashboard →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Sign In */}
          {isAuthenticated && role !== 'guest' ? (
            <div className="flex items-center gap-1">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition text-xs font-semibold text-slate-800 whitespace-nowrap"
                title={getDashboardLabel()}
              >
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                  {currentUser?.fullName?.[0] || 'U'}
                </div>
                <span className="hidden md:inline text-xs">{getDashboardLabel()}</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="text-xs font-semibold bg-slate-900 text-white px-2.5 py-1.5 rounded-xl hover:bg-slate-800 transition shadow-xs whitespace-nowrap"
            >
              Sign In
            </button>
          )}

          {/* Compact Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ─── Compact Mobile Drawer ────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-900 text-gold-300'
                    : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-400">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="https://wa.me/916206175583?text=Hello%20Trust%20Patho%20Lab,%20I%20want%20to%20book%20a%20doorstep%20test."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Gaya Desk</span>
            </a>
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs py-2.5 rounded-xl border border-gold-500/40 transition shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <span>Book Home Visit</span>
            </Link>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center border-t border-slate-100">
            <p className="font-semibold text-slate-600">Trust Patho Lab • Reg. No. 229112131723</p>
            <p className="text-gold-600 font-bold">24/7 Helpline: 6206175583</p>
          </div>
        </div>
      )}
    </header>
  );
};
