import React, { useState } from 'react';
import { 
  Fuel, 
  Gauge, 
  Users, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  ArrowUpRight, 
  Sparkles, 
  Check, 
  Car, 
  ChevronLeft, 
  ChevronRight, 
  Camera 
} from 'lucide-react';
import { Vehicle } from '../types';
import { generateWhatsAppLink, getPhoneLink, PRIMARY_PHONE } from '../utils/contact';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
  isTamil: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  isTamil
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Compile full image list with fallbacks
  const fallbackImage =
    vehicle.vehicleCategory === 'commercial'
      ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  const imageList = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [vehicle.thumbnail || fallbackImage];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImgIndex(index);
  };

  // Status badges
  const isAvailable = vehicle.status === 'available';
  const isReserved = vehicle.status === 'reserved';
  const isSold = vehicle.status === 'sold';

  const statusBadge = () => {
    if (isAvailable) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Available</span>
        </span>
      );
    }
    if (isReserved) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
          <span>Reserved</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-700 text-slate-200 shadow-sm">
        <span>Sold Out</span>
      </span>
    );
  };

  return (
    <div
      id={`vehicle-card-${vehicle.id}`}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden h-full"
    >
      {/* E-Commerce Interactive Photo Area */}
      <div 
        onClick={() => onViewDetails(vehicle)}
        className="relative h-56 sm:h-60 w-full bg-slate-950 overflow-hidden border-b border-slate-200/80 cursor-pointer select-none"
      >
        <img
          src={imgError ? fallbackImage : imageList[currentImgIndex]}
          alt={`${vehicle.title} - View ${currentImgIndex + 1}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/30 pointer-events-none" />

        {/* Left & Right Chevron Controls for E-Commerce gallery navigation */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              id={`prev-photo-btn-${vehicle.id}`}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm border border-slate-700/60 transition-opacity opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer z-20"
              title="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              id={`next-photo-btn-${vehicle.id}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm border border-slate-700/60 transition-opacity opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer z-20"
              title="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex flex-wrap gap-1.5 font-mono">
            {statusBadge()}
            {vehicle.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950 shadow-sm">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Multi-Photo Counter Badge */}
            {imageList.length > 1 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-950/90 text-slate-200 border border-slate-700 backdrop-blur-sm flex items-center gap-1">
                <Camera className="w-3 h-3 text-amber-400" />
                <span>{currentImgIndex + 1}/{imageList.length}</span>
              </span>
            )}

            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-950/90 text-amber-400 border border-slate-700 backdrop-blur-sm">
              {vehicle.registrationType}
            </span>
          </div>
        </div>

        {/* Interactive Dots for photo position */}
        {imageList.length > 1 && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-10">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentImgIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
                title={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom Bar: Year & Body Type on Left, Price on Right */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-semibold text-slate-200 bg-slate-900/90 border border-slate-700/60 px-2 py-0.5 rounded backdrop-blur-sm">
              {vehicle.year} Model
            </span>
            {vehicle.bodyType && (
              <span className="text-[11px] font-mono font-semibold text-amber-300 bg-slate-900/90 border border-slate-700/60 px-2 py-0.5 rounded backdrop-blur-sm">
                {vehicle.bodyType}
              </span>
            )}
          </div>

          <div className="bg-slate-950/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-right shadow-md">
            <span className="text-[9px] uppercase font-mono font-bold text-amber-400 block tracking-wider">PM Cars Offer</span>
            <span className="text-base font-black text-white">{vehicle.priceDisplay}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Title */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
                {vehicle.brand} • {vehicle.model}
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-400">
                {vehicle.vehicleCategory === 'commercial' ? 'T-Board Commercial' : 'Own Board Private'}
              </span>
            </div>
            <h3 
              onClick={() => onViewDetails(vehicle)}
              className="text-base sm:text-lg font-black text-slate-900 line-clamp-1 hover:text-amber-700 transition tracking-tight cursor-pointer"
            >
              {vehicle.title}
            </h3>
            {vehicle.variant && (
              <p className="text-xs text-slate-500 font-medium">{vehicle.variant}</p>
            )}
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 my-3 text-xs text-slate-600 bg-slate-50/80 rounded-lg px-2">
            <div className="flex flex-col items-center justify-center text-center">
              <Gauge className="w-3.5 h-3.5 text-slate-500 mb-1" />
              <span className="font-bold text-slate-900 font-mono text-xs">
                {vehicle.kilometers ? `${(vehicle.kilometers / 1000).toFixed(0)}k km` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Driven</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-x border-slate-200">
              <Fuel className="w-3.5 h-3.5 text-slate-500 mb-1" />
              <span className="font-bold text-slate-900 text-xs">{vehicle.fuelType}</span>
              <span className="text-[10px] text-slate-400 font-mono">{vehicle.transmission}</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <Users className="w-3.5 h-3.5 text-slate-500 mb-1" />
              <span className="font-bold text-slate-900 text-xs">
                {vehicle.owners} {vehicle.owners === 1 ? 'Owner' : 'Owners'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Registry</span>
            </div>
          </div>

          {/* Key Feature Highlight Badges */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {vehicle.features.slice(0, 2).map((feat, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-200/60"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{feat}</span>
                </span>
              ))}
              {vehicle.insuranceStatus && (
                <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200/60 font-mono">
                  {vehicle.insuranceStatus}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Action Buttons */}
        <div className="pt-2 space-y-2">
          {/* Primary View Details Button */}
          <button
            onClick={() => onViewDetails(vehicle)}
            id={`view-details-btn-${vehicle.id}`}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm border border-slate-800"
          >
            <span>View All Photos & Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Direct Enquiry Row (WhatsApp + Call) */}
          <div className="grid grid-cols-2 gap-2">
            <a
              id={`whatsapp-card-btn-${vehicle.id}`}
              href={generateWhatsAppLink(vehicle)}
              target="_blank"
              rel="noopener noreferrer"
              className={`py-2 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition text-white ${
                isSold
                  ? 'bg-slate-300 text-slate-600 pointer-events-none'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-sm'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>

            <a
              id={`call-card-btn-${vehicle.id}`}
              href={getPhoneLink(PRIMARY_PHONE)}
              className="py-2 px-2.5 rounded-lg border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
