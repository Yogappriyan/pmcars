import React, { useState } from 'react';
import { CircleDollarSign, CheckCircle2, Upload, MessageCircle, Phone, ArrowRight, ShieldCheck, Car, HelpCircle } from 'lucide-react';
import { submitSellRequest } from '../firebase/service';
import { PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY, WHATSAPP_NUMBER, getPhoneLink } from '../utils/contact';

interface SellYourCarProps {
  isTamil: boolean;
}

export const SellYourCar: React.FC<SellYourCarProps> = ({ isTamil }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleBrand: '',
    vehicleModel: '',
    year: new Date().getFullYear(),
    kilometers: '',
    fuelType: 'Petrol',
    expectedPrice: '',
    registrationType: 'Own Board',
    message: '',
    imageURL: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.vehicleBrand.trim() || !formData.vehicleModel.trim()) {
        throw new Error('Please fill in all required fields (Name, Phone, Brand, Model).');
      }

      const id = await submitSellRequest({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        vehicleBrand: formData.vehicleBrand.trim(),
        vehicleModel: formData.vehicleModel.trim(),
        year: Number(formData.year) || new Date().getFullYear(),
        kilometers: Number(formData.kilometers) || 0,
        fuelType: formData.fuelType,
        expectedPrice: formData.expectedPrice.trim() || 'Negotiable',
        registrationType: formData.registrationType,
        message: formData.message.trim(),
        imageURL: formData.imageURL.trim()
      });

      setReferenceId(id);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit vehicle details. Please try again or reach out on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReferenceId('');
    setFormData({
      name: '',
      phone: '',
      vehicleBrand: '',
      vehicleModel: '',
      year: new Date().getFullYear(),
      kilometers: '',
      fuelType: 'Petrol',
      expectedPrice: '',
      registrationType: 'Own Board',
      message: '',
      imageURL: ''
    });
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-slate-800">
            <CircleDollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>On-Site Parking Sales & Consultancy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Want to Sell Your Car?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Park your vehicle with PM Cars and connect with verified local buyers across Ariyalur and Tamil Nadu.
          </p>
        </div>

        {/* 3 Step Process Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-3">
            <span className="w-7 h-7 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
              01
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">Submit Details / Visit Yard</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your vehicle specifications below or drive to our Kollapuram yard.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-3">
            <span className="w-7 h-7 rounded-md bg-slate-900 text-amber-400 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-slate-800">
              02
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">Free Physical Inspection</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our technicians check engine, chassis, and documents to set a fair market price.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-3">
            <span className="w-7 h-7 rounded-md bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
              03
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">Direct Buyer Deal & Payment</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                We handle genuine buyer test drives and assist complete RTO transfer paperwork.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          {submitted ? (
            <div className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Vehicle Details Received Successfully!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our PM Cars Ariyalur team has logged your submission for the <strong>{formData.vehicleBrand} {formData.vehicleModel}</strong>.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 max-w-md mx-auto font-mono">
                <span className="block font-bold text-slate-800">Reference ID: {referenceId}</span>
                <span>Our representative will call your number ({formData.phone}) within business hours for yard inspection.</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello PM Cars Ariyalur, I submitted my car sell request [Ref: ${referenceId}] for ${formData.vehicleBrand} ${formData.vehicleModel}. Please confirm receipt.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200"
                >
                  Submit Another Vehicle
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Owner / Contact Info */}
              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Owner Contact Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. Name"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (WhatsApp preferred) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Particulars */}
              <div className="pt-2">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Vehicle Specifications</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vehicle Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vehicleBrand"
                      required
                      value={formData.vehicleBrand ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. Maruti, Hyundai, Tata, Toyota"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vehicle Model & Variant <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vehicleModel"
                      required
                      value={formData.vehicleModel ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. Swift VDI / Innova 2.5 / Dost"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Manufacturing Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      min="1995"
                      max={new Date().getFullYear() + 1}
                      required
                      value={formData.year ?? new Date().getFullYear()}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mt-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kilometers Driven
                    </label>
                    <input
                      type="number"
                      name="kilometers"
                      value={formData.kilometers ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. 65000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType ?? 'Petrol'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registration Type
                    </label>
                    <select
                      name="registrationType"
                      value={formData.registrationType ?? 'Own Board'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    >
                      <option value="Own Board">Private (Own Board / White Plate)</option>
                      <option value="T-Board">Commercial (T-Board / Yellow Plate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Expected Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expectedPrice"
                      required
                      value={formData.expectedPrice ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. 4,50,000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Photo and Additional Message */}
              <div className="pt-2">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Additional Details & Photos</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Optional Photo URL / Google Drive link
                    </label>
                    <input
                      type="url"
                      name="imageURL"
                      value={formData.imageURL ?? ''}
                      onChange={handleChange}
                      placeholder="Paste image link or share on WhatsApp"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      You can also send vehicle photos directly to our WhatsApp ({PRIMARY_PHONE_DISPLAY}).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Remarks / Condition / Insurance Expiry
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message ?? ''}
                      onChange={handleChange}
                      placeholder="Mention tyres condition, battery, insurance expiry, number of owners, etc."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your phone number is securely stored and used only for PM Cars dealership communication.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="submit-sell-car-btn"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-70 cursor-pointer border border-amber-300"
                >
                  <span>{loading ? 'Submitting...' : 'Submit Vehicle Details'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Local Parking Sales Yard Benefits Banner */}
        <div className="mt-8 p-6 rounded-xl bg-slate-950 text-white flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-800 bg-geometric-grid-dark">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">Why PM Cars Parking Sales?</span>
            <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
              Avoid continuous calls & strange visitors at your home
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-normal leading-relaxed">
              Park your vehicle at our secure, high-footfall Kollapuram showroom yard. We manage professional test drives, verify buyers, and ensure timely, safe financial settlements.
            </p>
          </div>

          <a
            href={getPhoneLink(PRIMARY_PHONE)}
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 font-mono font-bold text-xs shrink-0 flex items-center gap-2 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {PRIMARY_PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
