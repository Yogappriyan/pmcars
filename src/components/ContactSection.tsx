import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Send, Mail, CheckCircle2, Car, ExternalLink } from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE, PRIMARY_PHONE_DISPLAY, SECONDARY_PHONE_DISPLAY, WHATSAPP_NUMBER, getPhoneLink } from '../utils/contact';

interface ContactSectionProps {
  isTamil: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isTamil }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'buying',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);

    const topicLabel =
      formData.topic === 'buying' ? 'Buying a Vehicle' :
      formData.topic === 'selling' ? 'Selling My Car (Parking Sales)' :
      formData.topic === 'finance' ? 'Finance / Loan Guidance' : 'Insurance Renewal';

    const msg = `Hello PM Cars Ariyalur, my name is ${formData.name}. I am inquiring about: ${topicLabel}. My Contact: ${formData.phone}. Notes: ${formData.message || 'Please call me back.'}`;
    window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50/80 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Kollapuram, Ariyalur North</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Contact PM Cars Ariyalur
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Visit our showroom yard at Kollapuram or contact us directly via phone and WhatsApp for immediate assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Contact Cards & Business Hours */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone & WhatsApp Quick Connect Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="font-black text-slate-900 text-base tracking-tight">Direct Dealership Numbers</h3>

              {/* Primary Phone */}
              <a
                href={getPhoneLink(PRIMARY_PHONE)}
                className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-slate-800 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Primary Helpline</span>
                    <span className="text-sm sm:text-base font-mono font-black text-slate-900 group-hover:text-amber-600 transition">
                      {PRIMARY_PHONE_DISPLAY}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600">Call Now</span>
              </a>

              {/* Secondary Phone */}
              <a
                href={getPhoneLink(SECONDARY_PHONE)}
                className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-slate-800 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center font-bold border border-slate-800">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Alternate Contact</span>
                    <span className="text-sm sm:text-base font-mono font-black text-slate-900 group-hover:text-amber-600 transition">
                      {SECONDARY_PHONE_DISPLAY}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600">Call Now</span>
              </a>

              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello PM Cars Ariyalur, I want to inquire about pre-owned vehicles.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">Official WhatsApp Desk</span>
                    <span className="text-sm sm:text-base font-mono font-black text-emerald-950">
                      {PRIMARY_PHONE_DISPLAY}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700">Chat</span>
              </a>
            </div>

            {/* Address & Hours */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">Physical Showroom & Yard Address</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">
                    PM Cars, Kollapuram, Ariyalur North, Tamil Nadu – 621713, India.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Business Working Hours</span>
                </h4>
                <div className="space-y-1 text-xs text-slate-600 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-sans">Monday – Thursday:</span>
                    <span className="font-bold text-slate-900">7:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-sans">Friday:</span>
                    <span className="font-bold text-slate-900">7:00 AM – 8:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-sans">Saturday – Sunday:</span>
                    <span className="font-bold text-slate-900">7:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form & Interactive Map Visual */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-slate-200/90 shadow-xs">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1 tracking-tight">
                Send Direct Message / Schedule Visit
              </h3>
              <p className="text-xs text-slate-500 mb-5 font-normal">
                Fill in your details below and our team will connect with you via phone or WhatsApp.
              </p>

              {sent ? (
                <div className="p-5 bg-emerald-50 rounded-lg border border-emerald-200 text-center space-y-2.5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-950 text-sm">Message Sent to WhatsApp!</h4>
                  <p className="text-xs text-emerald-800">
                    Thank you, {formData.name}. We look forward to welcoming you at our Kollapuram yard.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-xs font-mono font-bold text-emerald-700 underline cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name ?? ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Saravanan"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone ?? ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.topic ?? 'buying'}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    >
                      <option value="buying">Looking to Buy a Pre-Owned Vehicle</option>
                      <option value="selling">Want to Sell My Vehicle (Parking Sales)</option>
                      <option value="commercial">Commercial / T-Board Carrier Inquiry</option>
                      <option value="finance">Vehicle Finance & EMI Guidance</option>
                      <option value="insurance">Insurance Renewal & Policy Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message / Vehicle Preference
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message ?? ''}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us the car model or budget you have in mind..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95 border border-slate-800 cursor-pointer"
                  >
                    <span>Send Inquiry on WhatsApp</span>
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </form>
              )}
            </div>

            {/* Map Preview Card */}
            <div className="bg-slate-950 rounded-xl p-5 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-geometric-grid-dark shadow-xs">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Location Directions
                </span>
                <h4 className="font-black text-sm sm:text-base text-white tracking-tight">
                  Kollapuram Yard, Ariyalur North
                </h4>
                <p className="text-xs text-slate-400 font-normal">
                  Easily accessible from Ariyalur bus stand and railway station.
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Kollapuram,Ariyalur,Tamil+Nadu"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition border border-amber-300"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
