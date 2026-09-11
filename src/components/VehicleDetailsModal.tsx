import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Gauge, 
  Users, 
  Fuel, 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Wrench, 
  Clock, 
  Share2, 
  Check,
  CreditCard 
} from 'lucide-react';
import { Vehicle } from '../types';
import { generateWhatsAppLink, getPhoneLink, PRIMARY_PHONE, SECONDARY_PHONE, PRIMARY_PHONE_DISPLAY, SECONDARY_PHONE_DISPLAY, WHATSAPP_NUMBER } from '../utils/contact';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  isTamil: boolean;
  onOpenPayment?: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  onClose,
  isTamil,
  onOpenPayment
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookVisitOpen, setBookVisitOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  if (!vehicle) return null;

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [vehicle.thumbnail || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.title} - PM Cars Ariyalur`,
        text: `Check out this ${vehicle.title} at PM Cars Ariyalur for ${vehicle.priceDisplay}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleBookVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitSubmitted(true);
    // Also generate quick WhatsApp notification
    const visitMsg = `Hello PM Cars Ariyalur, I would like to book a visit to inspect the ${vehicle.title} (${vehicle.year}, ${vehicle.priceDisplay}) on date: ${visitDate}. Name: ${visitName}, Phone: ${visitPhone}.`;
    window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(visitMsg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {vehicle.registrationType}
            </span>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">Ref ID: {vehicle.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-amber-700 transition border border-slate-200 cursor-pointer shadow-2xs"
              title="Share Vehicle"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition border border-slate-200 cursor-pointer shadow-2xs"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Top Title & Price Grid */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
                <span>{vehicle.brand}</span>
                <span>•</span>
                <span>{vehicle.model}</span>
                <span>•</span>
                <span className="capitalize">{vehicle.vehicleCategory} Category</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {vehicle.title}
              </h2>
              {vehicle.variant && (
                <p className="text-xs font-medium text-slate-500 mt-0.5">{vehicle.variant}</p>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 md:text-right shrink-0">
              <span className="text-[11px] uppercase font-mono font-bold text-slate-500 block">Offer Price</span>
              <span className="text-xl sm:text-2xl font-mono font-black text-slate-950">
                {vehicle.priceDisplay}
              </span>
              <div className="mt-1">
                {vehicle.status === 'available' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Available for Inspection
                  </span>
                ) : vehicle.status === 'reserved' ? (
                  <span className="inline-flex items-center text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Currently Reserved
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-mono font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="space-y-3">
            {/* Main Image Stage */}
            <div className="relative h-64 sm:h-84 md:h-96 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <img
                src={images[activeImageIndex]}
                alt={`${vehicle.title} - Photo ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Photo Angle Tag badge on top-left of photo */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-950/85 text-amber-400 text-xs font-mono font-bold backdrop-blur-xs border border-slate-700 shadow-sm">
                  {activeImageIndex === 0 && 'Exterior Front 3/4'}
                  {activeImageIndex === 1 && 'Side Profile & Alloys'}
                  {activeImageIndex === 2 && 'Cockpit & Driver Console'}
                  {activeImageIndex === 3 && 'Interior Seating & Cabin'}
                  {activeImageIndex >= 4 && 'Rear Stance & Details'}
                </span>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-xs transition border border-slate-700 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-xs transition border border-slate-700 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter & Fullscreen button */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 text-white text-xs font-mono font-semibold backdrop-blur-xs border border-slate-700">
                  {activeImageIndex + 1} / {images.length} Photos
                </span>
                <button
                  onClick={() => setFullscreen(true)}
                  className="p-1.5 rounded-md bg-slate-950/80 hover:bg-slate-900 text-white text-xs backdrop-blur-xs border border-slate-700 transition cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery Strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Viewer Overlay */}
          {fullscreen && (
            <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
              <button
                onClick={() => setFullscreen(false)}
                className="absolute top-4 right-4 p-3 text-white hover:text-amber-400 text-xl cursor-pointer"
              >
                <X className="w-7 h-7" />
              </button>
              <img
                src={images[activeImageIndex]}
                alt="Fullscreen"
                className="max-h-[85vh] max-w-[90vw] object-contain"
              />
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={prevImage}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-mono text-xs cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-white text-xs font-mono">
                  {activeImageIndex + 1} of {images.length}
                </span>
                <button
                  onClick={nextImage}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-mono text-xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Key Specifications Grid */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3 flex items-center gap-2 tracking-tight">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Vehicle Specifications</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Car Brand</span>
                <span className="text-sm font-mono font-bold text-amber-600">{vehicle.brand}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Body Style</span>
                <span className="text-sm font-mono font-bold text-slate-900">{vehicle.bodyType || 'Standard'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Model Year</span>
                <span className="text-sm font-mono font-bold text-slate-900">{vehicle.year}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Kilometers Driven</span>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {vehicle.kilometers.toLocaleString('en-IN')} km
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Number of Owners</span>
                <span className="text-sm font-mono font-bold text-slate-900">{vehicle.owners} Owner</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Fuel Type</span>
                <span className="text-sm font-bold text-slate-900">{vehicle.fuelType}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Transmission</span>
                <span className="text-sm font-bold text-slate-900">{vehicle.transmission}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Registration Board</span>
                <span className="text-sm font-mono font-bold text-amber-600">{vehicle.registrationType}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Insurance Status</span>
                <span className="text-sm font-mono font-bold text-emerald-700">{vehicle.insuranceStatus || 'Live Insurance'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/90">
                <span className="text-[11px] font-mono text-slate-500 block">Insurance Expiry</span>
                <span className="text-sm font-mono font-bold text-slate-900">{vehicle.insuranceExpiry || 'Verification in progress'}</span>
              </div>
            </div>
          </div>

          {/* Condition & Service History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Vehicle Condition</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                {vehicle.condition || "Mechanically verified by PM Cars technicians. Smooth engine transmission, clean chassis, verified tyres, and all electricals fully operational."}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Service History</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                {vehicle.serviceHistory || "Complete documentation and periodical service track verified. Ready for immediate ownership transfer."}
              </p>
            </div>
          </div>

          {/* Features Checklist */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3 tracking-tight">Key Highlights & Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-800 text-xs font-normal">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mb-2 tracking-tight">Dealership Remarks</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {vehicle.description}
            </div>
          </div>

          {/* Location & Showroom Yard Info */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-geometric-grid-dark">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">Vehicle Available at PM Cars Yard</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  Kollapuram, Ariyalur North, Tamil Nadu – 621713
                </p>
                <p className="text-[11px] text-amber-400 font-mono mt-1">
                  * Physical inspection and test drives available daily 7:00 AM to 8:00 PM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setBookVisitOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300 cursor-pointer"
              >
                Book Visit
              </button>
              {onOpenPayment && (
                <button
                  id="details-book-token-btn"
                  onClick={() => onOpenPayment(vehicle)}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition border border-amber-300 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Token Online</span>
                </button>
              )}
            </div>
          </div>

          {/* Book Visit Drawer/Form */}
          {bookVisitOpen && (
            <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-black text-slate-900 text-xs sm:text-sm tracking-tight">Schedule Test Drive & Inspection</h4>
                <button onClick={() => setBookVisitOpen(false)} className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {visitSubmitted ? (
                <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-normal border border-emerald-200">
                  Thank you! Your visit request for <strong>{vehicle.title}</strong> has been shared. Our Ariyalur team will have the vehicle ready at our Kollapuram yard.
                </div>
              ) : (
                <form onSubmit={handleBookVisitSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={visitName || ''}
                        onChange={(e) => setVisitName(e.target.value)}
                        placeholder="e.g. Ramesh"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={visitPhone || ''}
                        onChange={(e) => setVisitPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={visitDate || ''}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-800 font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    Confirm & Send to PM Cars on WhatsApp
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-white text-center sm:text-left">
            <span className="text-[11px] font-mono text-slate-400">Direct Inquiries:</span>
            <div className="flex items-center gap-3 mt-0.5 text-xs font-mono">
              <a href={getPhoneLink(PRIMARY_PHONE)} className="text-amber-400 font-bold hover:underline">
                {PRIMARY_PHONE_DISPLAY}
              </a>
              <span className="text-slate-600">/</span>
              <a href={getPhoneLink(SECONDARY_PHONE)} className="text-amber-400 font-bold hover:underline">
                {SECONDARY_PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Pay Token Online CTA */}
            {onOpenPayment && (
              <button
                id="details-footer-pay-token-cta"
                onClick={() => onOpenPayment(vehicle)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-transform active:scale-95 border border-amber-300 cursor-pointer"
                title="Pay ₹5,000 Refundable Advance via Razorpay"
              >
                <CreditCard className="w-4 h-4 stroke-[2.5]" />
                <span>Book / Pay Token</span>
              </button>
            )}

            {/* WhatsApp CTA */}
            <a
              id="details-whatsapp-cta"
              href={generateWhatsAppLink(vehicle)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp Enquiry</span>
            </a>

            {/* Call Button */}
            <a
              id="details-call-cta"
              href={getPhoneLink(PRIMARY_PHONE)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-transform active:scale-95 border border-amber-300"
            >
              <Phone className="w-3.5 h-3.5 fill-slate-950" />
              <span>Call PM Cars</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
