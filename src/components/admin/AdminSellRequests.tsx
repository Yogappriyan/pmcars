import React, { useState } from 'react';
import { SellRequest } from '../../types';
import { updateSellRequestStatus } from '../../firebase/service';
import { 
  CircleDollarSign, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Car
} from 'lucide-react';
import { getPhoneLink, formatPhoneDisplay } from '../../utils/contact';

interface AdminSellRequestsProps {
  requests: SellRequest[];
  onRefresh: () => void;
}

export const AdminSellRequests: React.FC<AdminSellRequestsProps> = ({
  requests,
  onRefresh
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = requests.filter((req) => {
    const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.includes(searchTerm) ||
      req.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (requestId: string, newStatus: 'new' | 'contacted' | 'closed') => {
    setUpdatingId(requestId);
    try {
      await updateSellRequestStatus(requestId, newStatus);
      onRefresh();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getWhatsAppMessageUrl = (req: SellRequest) => {
    const text = `Hello ${req.name}, greetings from PM Cars Ariyalur. We received your sell inquiry for your ${req.year} ${req.vehicleBrand} ${req.vehicleModel} (Expected: ${req.expectedPrice}). We would like to schedule a quick inspection at our Kollapuram yard. Are you available this week?`;
    const cleanPhone = req.phone.replace(/[^0-9]/g, '');
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Customer Vehicle Sell Submissions ({requests.length})
          </h3>
          <p className="text-xs text-slate-500">
            Vehicles submitted by local owners for parking sales and showroom yard inspection.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          {(['all', 'new', 'contacted', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                filterStatus === status
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by customer name, phone, model..."
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Requests Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length > 0 ? (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs hover:border-slate-300 transition"
            >
              {/* Card Top: Customer & Status */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">{req.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a
                      href={getPhoneLink(req.phone)}
                      className="text-amber-700 font-bold text-sm hover:underline flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{formatPhoneDisplay(req.phone)}</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value as any)}
                    disabled={updatingId === req.id}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                      req.status === 'new'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : req.status === 'contacted'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed / Sold</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Particulars */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">
                    {req.vehicleBrand} {req.vehicleModel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px]">
                    {req.registrationType}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-slate-500 pt-1.5 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] block">Year:</span>
                    <span className="text-slate-800 font-semibold">{req.year}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Kilometers:</span>
                    <span className="text-slate-800 font-semibold">{req.kilometers.toLocaleString('en-IN')} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Fuel:</span>
                    <span className="text-slate-800 font-semibold">{req.fuelType}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">Expected Price:</span>
                  <span className="font-bold text-amber-700 text-sm">₹{req.expectedPrice}</span>
                </div>
              </div>

              {/* Customer Remarks */}
              {req.message && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-800 block mb-0.5">Customer Remarks:</span>
                  <p className="italic">"{req.message}"</p>
                </div>
              )}

              {/* Date & Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Ref: {req.id}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppMessageUrl(req)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={getPhoneLink(req.phone)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-2 shadow-xs">
            <CircleDollarSign className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">No Sell Requests Matching Filter</h4>
            <p className="text-xs text-slate-500">
              When customers submit their vehicle on the website "Want to Sell Your Car" form, they appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
