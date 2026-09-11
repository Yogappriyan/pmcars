import React from 'react';
import { Phone, MapPin, Clock, MessageCircle, Car, Shield } from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE, PRIMARY_PHONE_DISPLAY, SECONDARY_PHONE_DISPLAY, WHATSAPP_NUMBER, getPhoneLink } from '../utils/contact';
import { BusinessSettings } from '../types';
import { DEFAULT_BUSINESS_SETTINGS } from '../data/initialData';
import pmCarsLogoImg from '../assets/images/logo pm.jpg';

interface FooterProps {
  settings?: BusinessSettings;
  onNavigate?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  onOpenAdmin?: () => void;
  isTamil?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings = DEFAULT_BUSINESS_SETTINGS,
  onNavigate,
  onSelectTab,
  onOpenAdmin
}) => {
  const activeSettings = settings || DEFAULT_BUSINESS_SETTINGS;

  const handleNav = (tab: string) => {
    const targetTab = tab === 'vehicles' ? 'inventory' : tab;
    if (onNavigate) {
      onNavigate(targetTab);
    } else if (onSelectTab) {
      onSelectTab(targetTab);
    }
  };

  const handleOpenAdminPortal = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else {
      handleNav('admin');
    }
  };

  return (
    <footer className="bg-slate-100 text-slate-700 border-t border-slate-200">
      {/* Top Banner / Quick Action Row */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
              Ariyalur Pre-Owned Vehicle Consultancy
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
              Ready to buy or sell a verified vehicle in Ariyalur?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Visit our Kollapuram yard for direct vehicle inspection, live documentation check, and immediate on-site valuation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={getPhoneLink(PRIMARY_PHONE)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs border border-amber-400 transition-transform active:scale-95"
            >
              <Phone className="w-4 h-4 fill-slate-950" />
              <span className="font-mono">{PRIMARY_PHONE_DISPLAY}</span>
            </a>
            <a
              href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello PM Cars Ariyalur, I want to discuss buying/selling a vehicle.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xs border border-emerald-600 transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-slate-200 bg-slate-950 shrink-0">
                <img
                  src={pmCarsLogoImg}
                  alt="PM CARS Logo"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-tight">PM CARS</span>
                <span className="block text-[10px] font-mono font-semibold text-amber-700 uppercase tracking-wider">Ariyalur North</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              PM Cars is Ariyalur's trusted multi-brand pre-owned vehicle consultancy. Specializing in quality inspected private cars, commercial T-Board vehicles, on-site parking sales, flexible finance assistance, and insurance renewals.
            </p>

            <div className="pt-1 text-[11px] text-slate-500 font-mono">
              <span className="block font-medium text-slate-700 font-sans">Tamil Nadu Reg No. Support</span>
              <span>All RTO transfers & documentation verified locally.</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('inventory')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  Available Vehicles
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('commercial')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  Commercial / T-Board Vehicles
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('sell')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  Sell Your Car (Parking Sales)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('finance')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  Finance Assistance
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('insurance')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  Insurance Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  About PM Cars
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-slate-600 hover:text-amber-700 transition cursor-pointer"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Showroom Hours</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-600 font-mono">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-medium text-slate-700 font-sans">Monday – Thursday</span>
                <span className="text-amber-800 font-semibold">{activeSettings?.businessHoursWeekdays || DEFAULT_BUSINESS_SETTINGS.businessHoursWeekdays}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-medium text-slate-700 font-sans">Friday</span>
                <span className="text-amber-800 font-semibold">{activeSettings?.businessHoursFriday || DEFAULT_BUSINESS_SETTINGS.businessHoursFriday}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-medium text-slate-700 font-sans">Saturday – Sunday</span>
                <span className="text-amber-800 font-semibold">{activeSettings?.businessHoursWeekend || DEFAULT_BUSINESS_SETTINGS.businessHoursWeekend}</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-0.5 font-sans">
                * Open 7 days a week for yard vehicle visits and test drives.
              </p>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Showroom Location</span>
            </h4>
            <address className="not-italic text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900">PM Cars Ariyalur</p>
              <p>Kollapuram, Ariyalur North</p>
              <p>Tamil Nadu – 621713, India</p>
              <div className="pt-2 space-y-1 font-mono">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Phone:</span>
                  <a href={getPhoneLink(PRIMARY_PHONE)} className="text-slate-900 hover:text-amber-700 font-medium">
                    {PRIMARY_PHONE_DISPLAY}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Alt Phone:</span>
                  <a href={getPhoneLink(SECONDARY_PHONE)} className="text-slate-900 hover:text-amber-700 font-medium">
                    {SECONDARY_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </address>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleOpenAdminPortal}
                className="text-xs font-mono text-slate-500 hover:text-amber-700 flex items-center gap-1 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Authorized Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="mt-10 pt-5 border-t border-slate-200 text-xs text-slate-500 space-y-2">
          <p className="leading-relaxed text-slate-600 text-[11px]">
            <strong className="text-slate-800">Disclaimer:</strong> Vehicle information is subject to availability and physical verification. Please contact PM Cars directly for current pricing, RC documents, insurance status, and test drive availability. All transactions follow transparent documentation practices.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-500 font-mono text-[11px]">
            <p>© {new Date().getFullYear()} PM Cars Ariyalur. All rights reserved.</p>
            <p>Kollapuram, Ariyalur North, Tamil Nadu – 621713</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
