import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Shield, 
  ChevronDown, 
  Car, 
  ExternalLink, 
  CreditCard,
  User,
  LogOut,
  Lock
} from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE, PRIMARY_PHONE_DISPLAY, SECONDARY_PHONE_DISPLAY, WHATSAPP_NUMBER, getPhoneLink } from '../utils/contact';
import { BusinessSettings, AppUser } from '../types';
import pmCarsLogoImg from '../assets/images/logo pm.jpg';

interface HeaderProps {
  activeTab?: string;
  currentTab?: string;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  settings?: BusinessSettings;
  onOpenAdmin?: () => void;
  onOpenPayment?: () => void;
  currentUser?: AppUser | null;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
  isTamil?: boolean;
  setIsTamil?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onToggleLang?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentTab,
  setActiveTab,
  onNavigate,
  settings,
  onOpenAdmin,
  onOpenPayment,
  currentUser,
  onOpenAuthModal,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [callDropdownOpen, setCallDropdownOpen] = useState(false);

  const selectedTab = currentTab || activeTab || 'home';
  const handleNavigation = onNavigate || setActiveTab || (() => {});

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'vehicles', label: 'Available Cars' },
    { id: 'commercial', label: 'Commercial Vehicles' },
    { id: 'sell', label: 'Sell Your Car' },
    { id: 'finance', label: 'Finance' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  if (currentUser?.role === 'user') {
    navItems.push({ id: 'portal', label: 'Customer Portal' });
  } else if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Dashboard' });
  }

  const handleNavClick = (id: string) => {
    handleNavigation(id === 'vehicles' ? 'inventory' : id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = currentUser?.role === 'admin';
  const isNormalUser = currentUser?.role === 'user';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro-bar for local trust info */}
      <div className="bg-slate-50 text-slate-600 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="font-medium text-slate-700">Kollapuram, Ariyalur North, Tamil Nadu – 621713</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-amber-700 font-semibold">Multi-Brand Pre-Owned Showroom & Parking Sales</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <button
                    onClick={onOpenAdmin || (() => handleNavigation('admin'))}
                    id="admin-status-badge"
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-200 transition cursor-pointer"
                    title="Dealership Administrator"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    <span>Admin ({currentUser.email.split('@')[0]})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation('portal')}
                    id="customer-status-badge"
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition cursor-pointer"
                    title="Customer Account"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Customer: {currentUser.name || currentUser.email.split('@')[0]}</span>
                  </button>
                )}

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="text-slate-500 hover:text-slate-900 p-1 rounded-md text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}

                {/* Admin Portal access button if not currently in admin */}
                {!isAdmin && (
                  <button
                    onClick={onOpenAdmin || (() => handleNavigation('admin'))}
                    id="admin-access-btn"
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded text-xs font-medium border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer ml-1"
                    title="Dealership Admin Portal (Registered Owner Only)"
                  >
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Admin Portal</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    id="header-google-signin-btn"
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign In</span>
                  </button>
                )}

                <button
                  onClick={onOpenAdmin || (() => handleNavigation('admin'))}
                  id="admin-access-btn"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition text-xs cursor-pointer font-semibold border border-transparent hover:border-slate-200"
                  title="Authorized Gmail Admin Login"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin Portal</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          id="brand-logo-btn"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-sm border-2 border-slate-200 bg-slate-950 shrink-0 group-hover:scale-105 group-hover:border-amber-400 transition duration-200">
            <img
              src={pmCarsLogoImg}
              alt="PM CARS Car Consultancy Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition">
                PM CARS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-mono font-bold tracking-wider uppercase">
                Ariyalur
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight">
              Pre-Owned Vehicle Consultancy & Yard
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              selectedTab === item.id ||
              (item.id === 'vehicles' && selectedTab === 'inventory');
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer border ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Call Dropdown */}
          <div className="relative">
            <button
              id="call-dropdown-btn"
              onClick={() => setCallDropdownOpen(!callDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold tracking-wide transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Call Us</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {callDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  PM Cars Direct Helpline
                </div>
                <a
                  href={getPhoneLink(PRIMARY_PHONE)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 hover:text-amber-700 transition"
                  onClick={() => setCallDropdownOpen(false)}
                >
                  <span className="font-semibold">{PRIMARY_PHONE_DISPLAY}</span>
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">Primary</span>
                </a>
                <a
                  href={getPhoneLink(SECONDARY_PHONE)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 hover:text-amber-700 transition"
                  onClick={() => setCallDropdownOpen(false)}
                >
                  <span className="font-semibold">{SECONDARY_PHONE_DISPLAY}</span>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Secondary</span>
                </a>
              </div>
            )}
          </div>

          {/* WhatsApp CTA */}
          <a
            id="header-whatsapp-cta"
            href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello PM Cars Ariyalur, I would like to inquire about available pre-owned vehicles.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Razorpay Online Payment / Token Booking CTA */}
          {onOpenPayment && (
            <button
              id="header-pay-token-btn"
              onClick={onOpenPayment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-black shadow-xs transition-transform active:scale-95 border border-slate-800 cursor-pointer"
              title="Pay Booking Token Online via Razorpay"
            >
              <CreditCard className="w-4 h-4 stroke-[2.4]" />
              <span>Book Online</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={getPhoneLink(PRIMARY_PHONE)}
            className="p-2 rounded-lg bg-slate-100 text-amber-600 border border-slate-200 sm:hidden"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                selectedTab === item.id ||
                (item.id === 'vehicles' && selectedTab === 'inventory');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition border ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={getPhoneLink(PRIMARY_PHONE)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Call Primary</span>
              </a>
              <a
                href={getPhoneLink(SECONDARY_PHONE)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Call Secondary</span>
              </a>
            </div>

            <a
              href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello PM Cars Ariyalur, I would like to inquire about available pre-owned vehicles.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs text-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>

            {onOpenPayment && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPayment();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-400 rounded-xl font-bold shadow-xs text-xs cursor-pointer border border-slate-800"
              >
                <CreditCard className="w-4 h-4" />
                <span>Book Online / Pay Token (Razorpay)</span>
              </button>
            )}

            <div className="flex justify-end items-center pt-2 text-xs">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAdmin) onOpenAdmin();
                  else handleNavigation('admin');
                }}
                className="text-slate-600 hover:text-slate-900 py-1 px-2 rounded font-medium"
              >
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
