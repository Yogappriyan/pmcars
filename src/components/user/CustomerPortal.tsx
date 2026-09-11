import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { NormalUser, AppUser, Vehicle, SellRequest } from '../../types';
import { PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY, WHATSAPP_NUMBER, getPhoneLink } from '../../utils/contact';

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
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'sellRequests' | 'testdrive' | 'adminCheck'>('overview');
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveVehicleId, setTestDriveVehicleId] = useState('');
  const [testDriveBooked, setTestDriveBooked] = useState(false);

  // Filter sell requests for this user by email (or show recent if mock user)
  const userRequests = sellRequests.filter(
    (req) => req.email?.toLowerCase() === user.email?.toLowerCase()
  );

  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTestDriveBooked(true);
    setTimeout(() => {
      setTestDriveBooked(false);
      setTestDriveDate('');
      setTestDriveVehicleId('');
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Customer Profile Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-sm border-2 border-slate-800">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name || 'User'} 
                  className="w-full h-full rounded-2xl object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user.name || 'Customer Account'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                  Normal User
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Google Verified</span>
                </span>
              </div>
              <p className="font-mono text-xs text-slate-500 mt-1">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-tight transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Car className="w-4 h-4" />
              <span>Browse Showroom</span>
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

        {/* Security / RBAC Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block">Dealership Administration Restriction:</span>
            <p>
              You are signed in as a <strong>Normal Customer</strong> ({user.email}). 
              Access to the PM Cars Dealership Management Dashboard, vehicle inventory modifications, pricing updates, and yard records is strictly reserved for the registered administrator (<strong className="underline">man695223@gmail.com</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Customer Dashboard
        </button>
        <button
          onClick={() => setActiveSubTab('sellRequests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'sellRequests'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Sell Inquiries ({userRequests.length})
        </button>
        <button
          onClick={() => setActiveSubTab('testdrive')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'testdrive'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Schedule Yard Visit / Test Drive
        </button>
        <button
          onClick={() => setActiveSubTab('adminCheck')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'adminCheck'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Admin Access Test (RBAC Check)
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Card 1: Available Vehicles */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Explore Pre-Owned Cars</h3>
              <p className="text-xs text-slate-500 mt-1">
                {vehicles.length} verified cars and commercial vehicles currently in Ariyalur stock.
              </p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Available Stock</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Card 2: Sell Your Car */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sell via Parking Sales</h3>
              <p className="text-xs text-slate-500 mt-1">
                Park your car at our highway yard in Ariyalur for direct genuine buyers with zero hassle.
              </p>
            </div>
            <button
              onClick={() => onNavigate('sell')}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Car Valuation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Card 3: Online Token Booking */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Secure Token Booking</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pay instant booking token (₹5,000 / ₹10,000) online via Razorpay to hold your car.
              </p>
            </div>
            <button
              onClick={() => onOpenPayment()}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Online (Razorpay)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Sell Requests */}
      {activeSubTab === 'sellRequests' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Vehicle Submissions</h2>
              <p className="text-xs text-slate-500">
                Track status of parking sale and instant valuation submissions.
              </p>
            </div>
            <button
              onClick={() => onNavigate('sell')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
            >
              + Submit New Car
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
                      <span>Expected: ₹{(req.expectedPrice / 100000).toFixed(2)} Lakh</span>
                      <span>•</span>
                      <span>KM: {req.kilometers.toLocaleString()} km</span>
                      <span>•</span>
                      <span>Type: {req.registrationType}</span>
                    </div>
                  </div>
                  <a
                    href={getPhoneLink(PRIMARY_PHONE)}
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 text-center"
                  >
                    Contact Dealership
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
                Submit Your First Vehicle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Schedule Yard Visit */}
      {activeSubTab === 'testdrive' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Schedule Showroom Yard Inspection</h2>
            <p className="text-xs text-slate-500 mt-1">
              Location: PM Cars, Kollapuram, Ariyalur North – 621713. Open Monday to Sunday, 9:00 AM – 8:00 PM.
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
                    {v.year} {v.title} – ₹{(v.price / 100000).toFixed(2)} Lakh
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Preferred Date
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
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98424 55191"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              Confirm Yard Appointment Request
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Admin Access Test (RBAC Check) */}
      {activeSubTab === 'adminCheck' && (
        <div className="bg-white border border-red-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Role-Based Access Control (RBAC) Verification</h2>
              <p className="text-xs text-slate-500">
                Security boundary test confirming normal users cannot enter the admin dashboard.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Current Authenticated Account:</span>
              <span className="font-mono font-bold text-slate-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Assigned System Role:</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                Normal User
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Dealership Admin Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Denied (Restricted to man695223@gmail.com)</span>
              </span>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-2 leading-relaxed">
            <p className="font-bold">Security Enforcement Rule:</p>
            <p>
              When any normal Google account signs in, the system assigns a <code>role: 'user'</code>. 
              The Admin Dashboard checks both the session token and the Firestore <code>/admins</code> collection. 
              Because <code>{user.email}</code> does not match the registered owner, access is firmly blocked.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onTryAdmin}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Test Admin Access</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
