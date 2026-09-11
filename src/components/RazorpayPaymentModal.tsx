import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Phone, 
  MessageCircle, 
  Printer, 
  ArrowRight,
  Lock,
  RefreshCw,
  Car
} from 'lucide-react';
import { Vehicle } from '../types';
import { openRazorpayCheckout, VerifyPaymentResult, RazorpayPaymentResponse } from '../services/razorpay';
import { PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY, WHATSAPP_NUMBER, getPhoneLink } from '../utils/contact';

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
  onPaymentSuccess?: (verificationResult: VerifyPaymentResult, vehicle?: Vehicle | null) => void;
}

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onPaymentSuccess
}) => {
  // Preset amounts in INR
  const presetAmounts = [
    { label: 'Standard Token', amount: 5000, desc: 'Hold vehicle for 48 hrs' },
    { label: 'Priority Booking', amount: 10000, desc: 'Full yard hold & paperwork' },
    { label: 'Inspection Deposit', amount: 2000, desc: 'Technician inspection hold' }
  ];

  const [selectedPreset, setSelectedPreset] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Customer form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Payment UI state: 'idle' | 'processing' | 'success' | 'failed'
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successDetails, setSuccessDetails] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    timestamp: string;
    isSimulated?: boolean;
  } | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedPreset;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentAmount < 100) {
      alert('Please enter a valid amount of at least ₹100.');
      return;
    }

    if (!name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    const description = vehicle 
      ? `Token Booking for ${vehicle.title} (${vehicle.year || 'Pre-Owned'})`
      : 'Vehicle Booking Token Deposit - PM Cars Ariyalur';

    openRazorpayCheckout({
      amountInRupees: currentAmount,
      title: 'PM CARS ARIYALUR',
      description,
      prefill: {
        name: name.trim(),
        email: email.trim(),
        contact: phone.trim()
      },
      notes: {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        vehicleId: vehicle?.id || 'GENERAL_BOOKING',
        vehicleTitle: vehicle?.title || 'General Token Advance',
        remarks: notes.trim()
      },
      onSuccess: (verificationResult: VerifyPaymentResult, rawResponse: RazorpayPaymentResponse) => {
        setStatus('success');
        const details = {
          paymentId: verificationResult.paymentId || rawResponse.razorpay_payment_id,
          orderId: verificationResult.orderId || rawResponse.razorpay_order_id,
          amount: currentAmount,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          isSimulated: verificationResult.isSimulated
        };
        setSuccessDetails(details);

        if (onPaymentSuccess) {
          onPaymentSuccess(verificationResult, vehicle);
        }
      },
      onFailure: (errMsg: string) => {
        setStatus('failed');
        setErrorMessage(errMsg || 'Payment was declined or signature verification failed.');
      },
      onDismiss: () => {
        if (status === 'processing') {
          setStatus('idle');
        }
      }
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const generateWhatsAppConfirmation = () => {
    if (!successDetails) return '#';
    const text = `*PM CARS ARIYALUR - PAYMENT RECEIPT*\n` +
      `------------------------------------\n` +
      `Payment ID: ${successDetails.paymentId}\n` +
      `Order ID: ${successDetails.orderId}\n` +
      `Amount Paid: ₹${successDetails.amount.toLocaleString('en-IN')}\n` +
      `Vehicle: ${vehicle ? vehicle.title : 'Token Booking'}\n` +
      `Customer Name: ${name}\n` +
      `Contact: ${phone}\n` +
      `Date & Time: ${successDetails.timestamp}\n` +
      `Status: VERIFIED & CONFIRMED\n` +
      `------------------------------------\n` +
      `Hello PM Cars team, I have completed the token payment online via Razorpay. Please hold the vehicle and confirm inspection.`;
    return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Razorpay Real-Time Checkout</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Instant
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">PM Cars Ariyalur Official Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* =================================================================
              SUCCESS FEEDBACK UI
             ================================================================= */}
          {status === 'success' && successDetails && (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-black text-emerald-900">
                  Payment Verified & Booking Confirmed!
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your token payment has been verified by PM Cars Ariyalur backend. The vehicle reservation has been locked in your name.
                </p>
                {successDetails.isSimulated && (
                  <span className="inline-block text-[10px] font-mono font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Test Sandbox Order Verified
                  </span>
                )}
              </div>

              {/* Receipt Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-sans">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Amount Paid</span>
                  <span className="text-lg font-mono font-black text-slate-900">
                    ₹{successDetails.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {vehicle && (
                  <div className="flex items-center gap-3 py-1">
                    <Car className="w-4 h-4 text-amber-600 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900">{vehicle.title}</span>
                      <span className="text-slate-500 block text-[11px]">{vehicle.priceDisplay} • {vehicle.registrationType}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 font-mono text-[11px]">Payment ID</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {successDetails.paymentId}
                      </span>
                      <button
                        onClick={() => handleCopy(successDetails.paymentId, 'pid')}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                        title="Copy Payment ID"
                      >
                        {copiedField === 'pid' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 font-mono text-[11px]">Order ID</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {successDetails.orderId}
                      </span>
                      <button
                        onClick={() => handleCopy(successDetails.orderId, 'oid')}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                        title="Copy Order ID"
                      >
                        {copiedField === 'oid' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 font-mono text-[11px]">Date & Time</span>
                    <span className="font-mono text-slate-700 text-[11px]">{successDetails.timestamp}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 leading-relaxed">
                  <strong>Showroom Location:</strong> PM Cars Ariyalur, Kollapuram, Ariyalur North, Tamil Nadu. Please present this receipt ID upon arrival for test drive or paper completion.
                </div>
              </div>

              {/* Success Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={generateWhatsAppConfirmation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Receipt on WhatsApp</span>
                </a>
                <button
                  onClick={handlePrintReceipt}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close & Return to Showroom
              </button>
            </div>
          )}

          {/* =================================================================
              FAILURE FEEDBACK UI
             ================================================================= */}
          {status === 'failed' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-black text-rose-900">
                  Payment Verification Failed
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {errorMessage || 'The transaction could not be completed or the signature verification did not succeed.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">Common reasons for payment issues:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Payment window was cancelled or closed prematurely.</li>
                  <li>Declined by bank server or UPI app timeout.</li>
                  <li>Gateway credentials setup pending in server environment.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => setStatus('idle')}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition border border-amber-300 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again with Razorpay</span>
                </button>
                <a
                  href={getPhoneLink(PRIMARY_PHONE)}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {PRIMARY_PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          )}

          {/* =================================================================
              INITIAL / ORDER CREATION FORM UI
             ================================================================= */}
          {(status === 'idle' || status === 'processing') && (
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              
              {/* Vehicle Highlight Card (if vehicle is provided) */}
              {vehicle && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <img
                    src={vehicle.thumbnail || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=160&q=80'}
                    alt={vehicle.title}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-700 font-bold uppercase">
                      <span>{vehicle.registrationType}</span>
                      <span>•</span>
                      <span>{vehicle.fuelType}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 truncate">{vehicle.title}</h4>
                    <p className="text-xs font-mono font-bold text-slate-700">{vehicle.priceDisplay}</p>
                  </div>
                </div>
              )}

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Booking Token Amount
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {presetAmounts.map((p) => {
                    const active = !isCustom && selectedPreset === p.amount;
                    return (
                      <button
                        key={p.amount}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(p.amount);
                          setIsCustom(false);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                          active
                            ? 'bg-amber-400/15 border-amber-500 ring-2 ring-amber-400/20 text-slate-950'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-mono font-black text-xs text-slate-900">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-800">{p.label}</div>
                        <div className="text-[10px] text-slate-500">{p.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount option */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer ${
                      isCustom 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Custom Amount
                  </button>
                  {isCustom && (
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">₹</span>
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount (min ₹100)"
                        className="w-full pl-6 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:border-slate-800"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Name"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(for receipt)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Remarks / Preferred Visit Time
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Saturday afternoon test drive"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Guarantee badges */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1.5 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>100% Refundable Token Policy</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  If the vehicle condition does not meet your expectations during the physical yard inspection at Ariyalur, your token amount is instantly refunded.
                </p>
                <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-500 font-mono">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Supported: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'processing' || currentAmount < 100}
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:cursor-not-allowed"
              >
                {status === 'processing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Initiating Razorpay Checkout...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Pay ₹{currentAmount.toLocaleString('en-IN')} via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
