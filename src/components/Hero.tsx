import React from 'react';
import { ArrowRight, Car, Banknote, FileCheck, CircleDollarSign, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../types';

interface HeroProps {
  onBrowseVehicles?: () => void;
  onExploreInventory?: () => void;
  onSellCar: () => void;
  featuredVehicle?: Vehicle;
  totalVehicles?: number;
  isTamil?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onBrowseVehicles,
  onExploreInventory,
  onSellCar,
  featuredVehicle,
  totalVehicles
}) => {
  const handleBrowse = onBrowseVehicles || onExploreInventory || (() => {});

  const trustBadges = [
    {
      num: "01",
      icon: Car,
      title: "Multi-Brand Vehicles",
      desc: "Private hatchbacks, sedans, SUVs & commercial T-Boards"
    },
    {
      num: "02",
      icon: Banknote,
      title: "Finance Assistance",
      desc: "Flexible EMI guidance and transparent loan options"
    },
    {
      num: "03",
      icon: FileCheck,
      title: "Insurance Support",
      desc: "Live policy renewals and documentation checks"
    },
    {
      num: "04",
      icon: CircleDollarSign,
      title: "Parking Sales",
      desc: "Park your vehicle with PM Cars to reach genuine local buyers"
    }
  ];

  return (
    <section className="relative bg-white text-slate-900 overflow-hidden pt-4 pb-8 sm:pt-8 sm:pb-16 lg:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 lg:space-y-6">
            {/* Location & Status Pill */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-medium tracking-tight">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <span>Kollapuram, Ariyalur North – Tamil Nadu</span>
              {totalVehicles ? (
                <>
                  <span className="text-amber-300">|</span>
                  <span className="font-bold text-slate-900">{totalVehicles} in Yard</span>
                </>
              ) : null}
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-snug sm:leading-tight">
              Find Reliable <span className="text-amber-600">Pre-Owned Cars</span> & Commercial Vehicles in Ariyalur
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base md:text-lg text-slate-600 max-w-2xl leading-normal sm:leading-relaxed font-normal">
              Multi-brand pre-owned vehicles, simplified finance assistance, parking sales, and vehicle insurance services — all under one roof.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
              <button
                id="hero-browse-btn"
                onClick={handleBrowse}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer border border-amber-400"
              >
                <span>Browse Available Vehicles</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                id="hero-sell-btn"
                onClick={onSellCar}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Sell Your Car</span>
              </button>
            </div>

            {/* Quick trust points */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-[11px] sm:text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Verified RC & Documents</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Own Board & T-Board</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Test Drives</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white border border-slate-200 p-2 sm:p-3 shadow-md overflow-hidden group">
              {/* Highlight vehicle tag */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs font-mono">
                  Featured at Showroom
                </span>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/95 text-slate-800 text-[10px] sm:text-xs font-semibold shadow-xs border border-slate-200">
                  {featuredVehicle ? featuredVehicle.registrationType : 'Own Board'}
                </span>
              </div>

              {/* Vehicle Image */}
              <div className="relative h-44 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={
                    featuredVehicle?.thumbnail ||
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={featuredVehicle?.title || "PM Cars Ariyalur Featured Vehicle"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Overlay content at bottom of image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 flex items-center justify-between shadow-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base">
                      {featuredVehicle?.title || "Toyota Innova Crysta 2.4 V"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-600 font-mono">
                      {featuredVehicle?.year || 2018} • {featuredVehicle?.fuelType || 'Diesel'} • {featuredVehicle?.kilometers ? `${(featuredVehicle.kilometers / 1000).toFixed(0)}k km` : '134k km'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-700 font-bold block">Special Price</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      {featuredVehicle?.priceDisplay || "₹16.50 Lakh"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-bar below vehicle */}
              <div className="mt-2 sm:mt-3 px-1 sm:px-2 py-0.5 sm:py-1 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-medium">Yard: Kollapuram, Ariyalur</span>
                <button
                  onClick={handleBrowse}
                  className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
                >
                  <span>View All In Yard</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Grid */}
        <div className="mt-6 pt-5 sm:mt-12 sm:pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition duration-200 relative shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-2xs">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-400 font-bold">{badge.num}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 sm:mb-1 tracking-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {badge.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
