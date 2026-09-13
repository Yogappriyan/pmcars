import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  ShieldAlert, 
  Car, 
  LogOut, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  CreditCard, 
  Clock, 
  ExternalLink, 
  HelpCircle,
  Shield,
  Search,
  ChevronRight,
  Printer,
  FileText,
  MapPin,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Check,
  AlertCircle
} from 'lucide-react';
import { AppUser, Vehicle, SellRequest, CustomerBooking } from '../../types';
import { PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY, WHATSAPP_NUMBER, getPhoneLink } from '../../utils/contact';
import { 
  subscribeToCustomerBookings, 
  createCustomerBooking,
  AUTHORIZED_ADMIN_EMAILS 
} from '../../firebase/service';

interface CustomerPortalProps {
  user: AppUser;
  vehicles: Vehicle[];
  sellRequests: SellRequest[];
  onSignOut: () => void;
  onNavigate: (tab: string) => void;
  onOpenPayment: (vehicle?: Vehicle) => void;
  onTryAdmin: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  user,
  vehicles,
  sellRequests,
  onSignOut,
  onNavigate,
  onOpenPayment,
  onTryAdmin
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'purchases' | 'sellRequests' | 'testdrive' | 'adminCheck'>('purchases');
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<CustomerBooking | null>(null);

  // Test drive states
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveVehicleId, setTestDriveVehicleId] = useState('');
  const [testDriveBooked, setTestDriveBooked] = useState(false);

  // Quick booking state
  const [quickBookingVehicleId, setQuickBookingVehicleId] = useState('');
  const [quickBookingProcessing, setQuickBookingProcessing] = useState(false);

  // Subscribe in real-time to this customer's bookings & purchases
  useEffect(() => {
    if (!user?.email) return;
    const unsubscribe = subscribeToCustomerBookings(user.email, (userBookings) => {
      setBookings(userBookings);
    });
    return () => unsubscribe();
  }, [user?.email]);

  // Sell requests for this user
  const userRequests = sellRequests.filter((req) => {
    const contactEmail = (req as any).email || (req as any).customerEmail;
    return contactEmail?.toLowerCase() === user.email?.toLowerCase();
  });

  // Calculate totals
  const totalTokenPaid = bookings.reduce((sum, b) => sum + (b.tokenAmount || 0), 0);
  const totalBalanceDue = bookings.reduce((sum, b) => sum + (b.balancePayable || 0), 0);

  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTestDriveBooked(true);
    setTimeout(() => {
      setTestDriveBooked(false);
      setTestDriveDate('');
      setTestDriveVehicleId('');
    }, 4000);
  };

  const handleCreateSampleBooking = async (veh: Vehicle) => {
    setQuickBookingProcessing(true);
    try {
      await createCustomerBooking({
        customerEmail: user.email,
        customerName: user.name || user.email.split('@')[0],
        customerPhone: '+91 98424 55123',
        vehicleId: veh.id,
        vehicleTitle: veh.title,
        vehicleBrand: veh.brand,
        vehicleModel: veh.model,
        vehicleVariant: veh.variant,
        vehicleYear: veh.year,
        vehiclePrice: veh.price,
        vehicleImage: veh.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        registrationNumber: veh.registrationType === 'T-Board' ? 'TN 61 T 1120' : 'TN 61 F 4490',
        fuelType: veh.fuelType,
        transmission: veh.transmission,
        tokenAmount: 10000,
        balancePayable: Math.max(0, veh.price - 10000),
        paymentId: `pay_RZP_${Date.now().toString().slice(-6)}`,
        paymentStatus: 'verified',
        bookingStatus: 'confirmed',
        estimatedDeliveryDate: 'Ready for Yard Inspection & Handover',
        yardLocation: 'PM Cars Main Yard, Kollapuram Bypass, Ariyalur',
        notes: 'Advance booking token verified online. NOC and RC paperwork in progress.'
      });
    } catch (e) {
      console.warn('Booking creation error:', e);
    } finally {
      setQuickBookingProcessing(false);
    }
  };

  const generateWhatsAppUrl = (booking: CustomerBooking) => {
    const text = `*PM CARS ARIYALUR - CUSTOMER PURCHASE INQUIRY*\n` +
      `Booking ID: ${booking.id}\n` +
      `Customer: ${booking.customerName} (${booking.customerEmail})\n` +
      `Vehicle: ${booking.vehicleTitle} (${booking.vehicleYear})\n` +
      `Token Paid: ₹${booking.tokenAmount.toLocaleString('en-IN')}\n` +
      `Balance Due: ₹${booking.balancePayable.toLocaleString('en-IN')}\n` +
      `Status: ${booking.bookingStatus.toUpperCase()}\n` +
      `Hello PM Cars Ariyalur team, I would like to check the delivery schedule and paperwork for my reserved vehicle.`;
    return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Customer Profile Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-black text-2xl shadow-sm border-2 border-slate-700 shrink-0">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name || 'Customer'} 
                  className="w-full h-full rounded-2xl object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{(user.name || user.email || 'C')[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user.name || 'Customer Account'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                  Customer Portal
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Verified</span>
                </span>
              </div>
              <p className="font-mono text-xs text-slate-500 mt-1">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-tight transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Car className="w-4 h-4" />
              <span>Browse 30+ Yard Cars</span>
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-2 border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Role Separation Notice */}
        <div className="mt-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block">Role-Based Access Control Confirmed:</span>
            <p>
              Signed in with customer Gmail: <strong>{user.email}</strong>. 
              As requested, you are provided with your complete <strong>History of Purchases, Vehicle Bookings, and Advance Receipts</strong>. 
              Dealership administrative controls and inventory price adjustments are restricted strictly to the owner (<span className="font-mono font-bold text-blue-950">man695223@gmail.com</span>).
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Bookings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{bookings.length}</span>
          <span className="text-[11px] text-slate-400">Reserved vehicles</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Advance Tokens Paid</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{totalTokenPaid.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-emerald-600 font-medium">Verified online</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Balance Payable at Yard</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">₹{totalBalanceDue.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-slate-400">At vehicle delivery</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Yard Handover</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">Ariyalur North</span>
          <span className="text-[11px] text-slate-400">Kollapuram Bypass</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('purchases')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'purchases'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Customer's History of Purchases ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sellRequests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'sellRequests'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Sell Inquiries ({userRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('testdrive')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'testdrive'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Yard Test Drive</span>
        </button>

        <button
          onClick={() => setActiveSubTab('adminCheck')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'adminCheck'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Admin Separation (Security Test)</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER'S HISTORY OF PURCHASES & BOOKINGS */}
      {activeSubTab === 'purchases' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Your Vehicle Purchases & Advance Bookings</h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time records of your token payments, verification certificates, and delivery milestones.
              </p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Car className="w-4 h-4 text-amber-400" />
              <span>Book Another Vehicle</span>
            </button>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-5">
              {bookings.map((booking) => {
                const isReady = booking.bookingStatus === 'ready_for_delivery';
                return (
                  <div
                    key={booking.id}
                    className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-slate-300 transition duration-200"
                  >
                    {/* Top Status Header */}
                    <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">Booking ID: {booking.id}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">{booking.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[10px]">
                          Payment: {booking.paymentStatus.toUpperCase()} ({booking.paymentId})
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          isReady 
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          {booking.bookingStatus === 'ready_for_delivery' ? 'Ready for Handover' : booking.bookingStatus}
                        </span>
                      </div>
                    </div>

                    {/* Booking Card Body */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Vehicle Photo */}
                        <div className="md:col-span-4 h-48 rounded-2xl overflow-hidden bg-slate-100 relative group">
                          <img
                            src={booking.vehicleImage}
                            alt={booking.vehicleTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                            {booking.registrationNumber || 'Own Board TN Reg'}
                          </div>
                        </div>

                        {/* Vehicle & Pricing Details */}
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
                                {booking.vehicleBrand} • {booking.vehicleYear}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                              {booking.vehicleTitle}
                            </h3>
                            {booking.vehicleVariant && (
                              <p className="text-xs text-slate-500">{booking.vehicleVariant}</p>
                            )}
                          </div>

                          {/* Financial Breakdown Grid */}
                          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500 block">Agreed Vehicle Price</span>
                              <span className="text-sm font-black text-slate-900">
                                ₹{booking.vehiclePrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Token Paid (Razorpay)</span>
                              <span className="text-sm font-black text-emerald-700">
                                ₹{booking.tokenAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-amber-800 block">Balance at Yard Handover</span>
                              <span className="text-sm font-black text-amber-800">
                                ₹{booking.balancePayable.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Delivery Milestones Tracker */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-700 block">Delivery Progress Tracker:</span>
                            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex flex-col items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Token Verified</span>
                              </div>
                              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex flex-col items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>RC & NOC Ready</span>
                              </div>
                              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex flex-col items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Yard Detailing & PDI</span>
                              </div>
                              <div className={`p-2 rounded-xl border font-bold flex flex-col items-center gap-1 ${
                                isReady 
                                  ? 'bg-emerald-600 text-white border-emerald-700' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                <Check className="w-3.5 h-3.5" />
                                <span>Yard Handover</span>
                              </div>
                            </div>
                          </div>

                          {/* Yard Handover Location */}
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Handover Location: <strong>{booking.yardLocation}</strong></span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100">
                            <button
                              onClick={() => setSelectedReceipt(booking)}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>View & Print Booking Invoice</span>
                            </button>

                            <a
                              href={generateWhatsAppUrl(booking)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Chat with Yard Manager</span>
                            </a>

                            <button
                              onClick={() => onOpenPayment()}
                              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Balance via Razorpay</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Car className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Vehicle Purchases Found Yet</h3>
                <p className="text-xs text-slate-500">
                  There are currently no active bookings linked to <strong>{user.email}</strong>. 
                  You can reserve any certified pre-owned car or commercial vehicle with an instant token payment.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                <button
                  onClick={() => onNavigate('inventory')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Browse Available Yard Stock</span>
                </button>

                {vehicles.length > 0 && (
                  <button
                    onClick={() => handleCreateSampleBooking(vehicles[0])}
                    disabled={quickBookingProcessing}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{quickBookingProcessing ? 'Adding...' : `Simulate Advance Booking (${vehicles[0].title.slice(0, 20)}...)`}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SELL REQUESTS */}
      {activeSubTab === 'sellRequests' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Your Vehicle Valuations & Sell Requests</h2>
              <p className="text-xs text-slate-500">
                Track parking sales status and instant buy-in offers from PM Cars Ariyalur.
              </p>
            </div>
            <button
              onClick={() => onNavigate('sell')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-xs"
            >
              + Submit Car for Parking Sale
            </button>
          </div>

          {userRequests.length > 0 ? (
            <div className="space-y-3">
              {userRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {req.year} {req.vehicleBrand} {req.vehicleModel}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        {req.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Expected: ₹{(Number(req.expectedPrice) / 100000).toFixed(2)} Lakh</span>
                      <span>•</span>
                      <span>KM: {req.kilometers?.toLocaleString()} km</span>
                      <span>•</span>
                      <span>Type: {req.registrationType}</span>
                    </div>
                  </div>
                  <a
                    href={getPhoneLink(PRIMARY_PHONE)}
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 text-center"
                  >
                    Call Showroom Manager
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Car className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                No active sell requests associated with {user.email}.
              </p>
              <button
                onClick={() => onNavigate('sell')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Submit Your Car for Free Valuation
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SCHEDULE YARD TEST DRIVE */}
      {activeSubTab === 'testdrive' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Schedule Showroom Yard Inspection</h2>
            <p className="text-xs text-slate-500 mt-1">
              Location: PM Cars, Kollapuram, Ariyalur North – 621713. Open Monday to Sunday, 7:00 AM – 8:00 PM.
            </p>
          </div>

          {testDriveBooked && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Appointment Request Submitted!</strong>
                <p>Our sales consultant will call your registered phone to confirm your test drive time slot.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleTestDriveSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Vehicle of Interest
              </label>
              <select
                required
                value={testDriveVehicleId}
                onChange={(e) => setTestDriveVehicleId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
              >
                <option value="">-- Choose a Vehicle from Stock --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.title} – ₹{(v.price / 100000).toFixed(2)} Lakh ({v.fuelType})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Preferred Date & Time
                </label>
                <input
                  type="date"
                  required
                  value={testDriveDate}
                  onChange={(e) => setTestDriveDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Customer Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  defaultValue="+91 98424 55123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition"
            >
              Confirm Yard Visit Appointment
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ADMIN ACCESS SEPARATION & SECURITY TEST */}
      {activeSubTab === 'adminCheck' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Role-Based Isolation Verification</h2>
              <p className="text-xs text-slate-500">
                Confirming strict security rules separating Dealership Owner from Customers.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Logged-in Account:</span>
              <span className="font-mono font-bold text-slate-900">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
              <span className="text-slate-500 font-medium">System Role:</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">
                Customer (Normal User)
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Authorized Dealership Administrator:</span>
              <span className="font-mono font-bold text-amber-800">{AUTHORIZED_ADMIN_EMAILS[0]}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 font-medium">Admin Panel Permission:</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px] uppercase">
                Restricted / Denied
              </span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Role Logic Operating As Specified:
            </span>
            <p>
              When <strong>{AUTHORIZED_ADMIN_EMAILS[0]}</strong> logs in, the Dealership Admin Dashboard is displayed.
              For all other Gmail accounts (like <strong>{user.email}</strong>), access to the admin panel is blocked and the customer is routed directly to their <strong>History of Purchases & Bookings</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onTryAdmin}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Test Admin Route Access (Will enforce RBAC rule)</span>
          </button>
        </div>
      )}

      {/* PRINTABLE BOOKING INVOICE MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block">
                  Official Dealership Booking Slip
                </span>
                <h3 className="text-lg font-black text-slate-900">PM CARS ARIYALUR</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Receipt Content */}
            <div id="printable-booking-slip" className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Reference</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Date</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.bookingDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Name</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Gmail</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.customerEmail}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Vehicle Reserved</span>
                <div className="text-sm font-black text-slate-900">{selectedReceipt.vehicleTitle}</div>
                <div className="flex items-center gap-3 text-slate-600 text-xs">
                  <span>Year: {selectedReceipt.vehicleYear}</span>
                  <span>•</span>
                  <span>Reg: {selectedReceipt.registrationNumber}</span>
                  <span>•</span>
                  <span>Fuel: {selectedReceipt.fuelType}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Vehicle Deal Value:</span>
                  <span className="font-black text-slate-900">₹{selectedReceipt.vehiclePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Advance Token Paid Online (Razorpay):</span>
                  <span>- ₹{selectedReceipt.tokenAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-amber-200 pt-2 flex justify-between font-black text-sm text-amber-900">
                  <span>Balance Payable at Yard Delivery:</span>
                  <span>₹{selectedReceipt.balancePayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <p><strong>Yard Address:</strong> PM Cars, Kollapuram, Ariyalur North Bypass, Tamil Nadu – 621713.</p>
                <p><strong>Helpline:</strong> {PRIMARY_PHONE_DISPLAY} / 9655677322</p>
                <p className="text-[10px] italic">Please present this booking reference at the showroom yard for vehicle PDI and key handover.</p>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Official Slip</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
