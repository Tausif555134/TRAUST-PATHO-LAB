import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Sparkles,
  User,
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
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full max-w-full">
      {/* ─── Top Bar (Shown on Tablet & Desktop to prevent mobile overflow) ── */}
      <div className="hidden sm:block bg-obsidian-950 text-slate-200 text-xs py-1.5 px-3 sm:px-6 border-b border-brand-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Reg No */}
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="text-gold-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
              Govt. Reg. No. 229112131723
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Estd. 2024 • Gaya, Bihar</span>
          </div>

          {/* Persona Switcher for Evaluation */}
          <div className="relative ml-auto">
            <button
              onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
              className="bg-brand-900/80 hover:bg-brand-800 text-slate-100 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium flex items-center gap-1 border border-gold-500/30 transition"
              aria-expanded={personaDropdownOpen}
              aria-label="Switch Persona"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span className="truncate max-w-[120px]">
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
                  Switch Demo Persona
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

      {/* ─── Compact Header: Logo on left, Hamburger on right for mobile ─── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo with Official Image */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink min-w-0 select-none">
          <div className="relative shrink-0 w-8 h-8 sm:w-10 sm:h-10">
            <img
              src="/trust-patho-lab-logo.png"
              alt="Trust Patho Lab"
              className="w-full h-full rounded-full border border-gold-500 object-cover shadow-xs group-hover:scale-105 transition duration-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/trust-patho-lab-logo.jpg';
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border border-white rounded-full"></span>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-obsidian-950 leading-none group-hover:text-brand-800 transition truncate">
              TRUST <span className="text-gold-600 font-extrabold">PATHO LAB</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-brand-800 uppercase mt-0.5 leading-none truncate hidden xs:block">
              Pathology Laboratory • Gaya
            </span>
          </div>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0">
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

        {/* Right Action Buttons on Desktop (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Direct Booking CTA */}
          <Link
            to="/book"
            className="inline-flex items-center gap-1.5 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-gold-500/40 shadow-xs transition active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Book Home Visit</span>
          </Link>

          {/* Notifications Dropdown */}
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
              <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
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

          {/* User Profile / Dashboard Button */}
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
                <span className="hidden lg:inline text-xs">{getDashboardLabel()}</span>
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
        </div>

        {/* ─── Mobile Hamburger Menu Button (ONLY control on right for mobile) ─ */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none shrink-0"
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
        </button>
      </div>

      {/* ─── Compact Mobile Menu Drawer with Desktop Items Included ──────── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Navigation Links */}
          <div className="space-y-1">
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
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-gold-500/40 shadow-xs transition"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <span>Book Home Visit</span>
            </Link>
          </div>

          {/* Account / Sign In section */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isAuthenticated && role !== 'guest' ? (
              <div className="w-full flex items-center justify-between">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Go to {getDashboardLabel()} →</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full text-center py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                Sign In / Patient Account
              </button>
            )}
          </div>

          {/* Mobile Demo Persona Switcher */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="block font-bold text-slate-700 mb-1">Demo Persona:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  switchPersona('patient_rajesh');
                  setMobileMenuOpen(false);
                  navigate('/patient/dashboard');
                }}
                className="text-left p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px]"
              >
                👤 Rajesh (Patient)
              </button>
              <button
                onClick={() => {
                  switchPersona('doctor_aisha');
                  setMobileMenuOpen(false);
                  navigate('/professional/dashboard');
                }}
                className="text-left p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px]"
              >
                🩺 Dr. Aisha (Doctor)
              </button>
              <button
                onClick={() => {
                  switchPersona('admin');
                  setMobileMenuOpen(false);
                  navigate('/admin');
                }}
                className="text-left p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px]"
              >
                ⚙️ Admin Console
              </button>
              <button
                onClick={() => {
                  switchPersona('guest');
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="text-left p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px]"
              >
                🌐 Guest Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
