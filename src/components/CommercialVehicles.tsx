import React from 'react';
import { Truck, Check, MessageCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../types';
import { generateWhatsAppLink, generateGeneralWhatsAppLink, getPhoneLink, PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY, WHATSAPP_NUMBER } from '../utils/contact';

interface CommercialVehiclesProps {
  vehicles: Vehicle[];
  onViewDetails: (vehicle: Vehicle) => void;
  isTamil: boolean;
}

export const CommercialVehicles: React.FC<CommercialVehiclesProps> = ({
  vehicles,
  onViewDetails,
  isTamil
}) => {
  const commercialList = vehicles.filter((v) => v.vehicleCategory === 'commercial');

  const popularModels = [
    { name: "Ashok Leyland Dost / Strong", tag: "Heavy Load 1.5L Turbo" },
    { name: "Tata Ace Gold / Mega", tag: "Ariyalur Intra-City Cargo" },
    { name: "Mahindra Bolero Pik-Up 1.7T", tag: "Cement & Agricultural Haul" },
    { name: "Ashok Leyland Bada Dost", tag: "Long Deck Inter-District" },
    { name: "Mahindra Jeeto Plus", tag: "High Mileage Budget Carrier" }
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50/80 border-t border-slate-200/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-slate-800">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>T-Board & Commercial Marketplace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Commercial Vehicles for Your Business
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Verified pre-owned commercial carriers, mini-trucks, and pickups with valid FC, tax, and permit documentation.
          </p>
        </div>

        {/* Commercial Highlights Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {popularModels.map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 bg-white rounded-md border border-slate-200 shadow-xs text-xs font-semibold text-slate-800 flex items-center gap-2 font-mono"
            >
              <span className="w-1.5 h-1.5 rounded-sm bg-amber-500" />
              <span>{item.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">({item.tag})</span>
            </div>
          ))}
        </div>

        {/* Commercial Grid */}
        {commercialList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commercialList.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm hover:border-slate-800 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-950 border-b border-slate-200/80">
                    <img
                      src={vehicle.thumbnail || vehicle.images?.[0]}
                      alt={vehicle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 font-mono">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[11px] font-bold">
                        T-Board
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950/90 text-white text-[11px] font-medium border border-slate-800">
                        {vehicle.year} Model
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/95 text-amber-400 text-xs font-mono font-black border border-slate-800">
                        {vehicle.priceDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
                      {vehicle.brand} Commercial
                    </span>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">{vehicle.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{vehicle.description}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Mileage / Km:</span>
                        <span className="font-bold text-slate-900">{(vehicle.kilometers ?? 0).toLocaleString('en-IN')} km</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Fuel & Gear:</span>
                        <span className="font-bold text-slate-900">{vehicle.fuelType} • {vehicle.transmission}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Insurance:</span>
                        <span className="font-bold text-emerald-600">{vehicle.insuranceStatus || 'Live'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Ownership:</span>
                        <span className="font-bold text-slate-900">{vehicle.owners} Owner</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 space-y-2">
                  <button
                    onClick={() => onViewDetails(vehicle)}
                    className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-800"
                  >
                    <span>View Specifications & FC</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={generateWhatsAppLink(vehicle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={getPhoneLink(PRIMARY_PHONE)}
                      className="py-2 border border-slate-200 hover:border-slate-800 text-slate-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center max-w-xl mx-auto space-y-3 shadow-xs">
            <Truck className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Looking for a specific commercial vehicle?</h4>
            <p className="text-xs text-slate-500">
              We frequently receive Dost, Tata Ace, and Bolero Pickups at our yard. Contact our commercial desk to register your requirement.
            </p>
            <a
              href={generateGeneralWhatsAppLink('commercial')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Inquire for Commercial Vehicle</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
