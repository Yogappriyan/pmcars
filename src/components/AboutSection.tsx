import React from 'react';
import { MapPin, Phone, Car, ShieldCheck, FileCheck, CheckCircle2, Clock, Users } from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE, PRIMARY_PHONE_DISPLAY, SECONDARY_PHONE_DISPLAY, getPhoneLink } from '../utils/contact';

interface AboutSectionProps {
  isTamil: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isTamil }) => {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Story & Identity */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-slate-800">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Ariyalur Pre-Owned Vehicle Consultancy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Your Local Pre-Owned <span className="text-amber-600">Vehicle Partner</span> in Ariyalur
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <p>
                <strong>PM Cars Ariyalur</strong> operates as a multi-brand pre-owned vehicle consultancy located at Kollapuram, Ariyalur North, Tamil Nadu. We serve local buyers and sellers looking for dependable private cars, rugged commercial carriers, transparent parking sales, vehicle finance assistance, and live insurance renewal.
              </p>
              <p>
                In the pre-owned vehicle market, transparency and genuine paperwork make all the difference. Whether you are purchasing your first family hatchback, acquiring a T-Board commercial carrier for daily cargo, or seeking to sell an existing vehicle at fair market value, PM Cars provides personalized guidance right here in Ariyalur.
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-800">
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 tracking-tight">Private & Commercial Vehicles</strong>
                  <span className="text-slate-500">Own Board hatchbacks & sedans, and T-Board commercial carriers.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 tracking-tight">On-Site Parking Sales</strong>
                  <span className="text-slate-500">Park your car at our secure yard to connect directly with local buyers.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 tracking-tight">Finance & EMI Guidance</strong>
                  <span className="text-slate-500">Flexible loan consultation with leading banks and vehicle NBFCs.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 tracking-tight">Live Insurance & Verification</strong>
                  <span className="text-slate-500">Complete policy renewals and official RTO document checks.</span>
                </div>
              </div>
            </div>

            {/* Direct helpline buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getPhoneLink(PRIMARY_PHONE)}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center gap-2 transition border border-slate-800"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {PRIMARY_PHONE_DISPLAY}</span>
              </a>
              <a
                href={getPhoneLink(SECONDARY_PHONE)}
                className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center gap-2 transition border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Alt: {SECONDARY_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Location / Showroom Identity Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950 text-white p-6 sm:p-7 rounded-xl border border-slate-800 shadow-md space-y-5 bg-geometric-grid-dark">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black border border-amber-300">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white tracking-tight">PM CARS</h3>
                  <span className="text-[11px] text-amber-400 font-mono font-semibold tracking-wider uppercase">
                    Kollapuram, Ariyalur North
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs border-t border-slate-800">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-slate-300">
                    <strong className="block text-white font-medium">Showroom & Yard Address:</strong>
                    <span>Kollapuram, Ariyalur North, Tamil Nadu – 621713</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-slate-300 font-mono">
                    <strong className="block text-white font-sans font-medium">Showroom Timings:</strong>
                    <span>Mon–Thu: 7:00 AM – 8:00 PM</span>
                    <span className="block">Fri: 7:00 AM – 8:30 PM</span>
                    <span className="block">Sat–Sun: 7:00 AM – 8:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-slate-300">
                    <strong className="block text-white font-medium">Serving Region:</strong>
                    <span>Ariyalur town, Sendurai, Jayankondam, Udayarpalayam, Perambalur & nearby Tamil Nadu areas.</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className="text-amber-400 font-mono font-bold block mb-1">Vehicle Verification Standard</span>
                Every pre-owned vehicle listed by PM Cars is physically verified at our Kollapuram yard for engine condition, chassis authenticity, tyre life, and valid registration papers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
