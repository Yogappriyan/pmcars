import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  CircleDollarSign, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Star, 
  Truck, 
  Layers, 
  Phone,
  Sparkles,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Vehicle, SellRequest, AdminUser, BusinessSettings } from '../../types';
import { signOutAdmin, setVehicleStatus } from '../../firebase/service';
import pmCarsLogoImg from '../../assets/images/logo pm.jpg';
import { AdminInventory } from './AdminInventory';
import { AdminVehicleForm } from './AdminVehicleForm';
import { AdminSellRequests } from './AdminSellRequests';
import { AdminSettings } from './AdminSettings';

interface AdminDashboardProps {
  adminUser: AdminUser;
  vehicles: Vehicle[];
  sellRequests: SellRequest[];
  businessSettings: BusinessSettings;
  onRefreshData: () => void;
  onBackToWebsite: () => void;
  onSignOut: () => void;
  onUpdateSettings: (newSettings: BusinessSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  vehicles,
  sellRequests,
  businessSettings,
  onRefreshData,
  onBackToWebsite,
  onSignOut,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'add' | 'sellRequests' | 'settings'>('overview');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Computed metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
  const reservedVehicles = vehicles.filter((v) => v.status === 'reserved').length;
  const soldVehicles = vehicles.filter((v) => v.status === 'sold').length;
  const featuredVehicles = vehicles.filter((v) => v.featured).length;
  const commercialVehicles = vehicles.filter((v) => v.vehicleCategory === 'commercial').length;
  const pendingRequests = sellRequests.filter((r) => r.status === 'new').length;

  const handleSignOut = async () => {
    await signOutAdmin();
    onSignOut();
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setActiveTab('add');
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setActiveTab('add');
  };

  const handleFormSaved = () => {
    setEditingVehicle(null);
    setActiveTab('inventory');
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Admin Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-slate-200 bg-slate-950 shrink-0">
              <img
                src={pmCarsLogoImg}
                alt="PM CARS Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 text-base tracking-tight">PM CARS</h1>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Admin Panel
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Ariyalur Dealership Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Authenticated Authorized Admin Badge */}
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <div className="text-left">
                <span className="font-bold text-slate-900 block leading-tight">Authorized Admin</span>
                <span className="text-[11px] font-mono text-slate-600">{adminUser.email}</span>
              </div>
            </div>

            {/* Back to Live Site Button */}
            <button
              onClick={onBackToWebsite}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              id="admin-sign-out-btn"
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 shrink-0 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 space-y-1 shadow-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>Vehicle Inventory</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'inventory' ? 'bg-slate-950 text-amber-400' : 'bg-slate-100 text-slate-700'
              }`}>
                {totalVehicles}
              </span>
            </button>

            <button
              onClick={handleAddVehicle}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('sellRequests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'sellRequests'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4" />
                <span>Sell Requests</span>
              </div>
              {pendingRequests > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  {pendingRequests} New
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Dealership Settings</span>
              </div>
            </button>
          </div>

          {/* Quick Yard Info Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-600 shadow-xs">
            <span className="font-bold text-slate-900 block">Showroom Yard Status</span>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="text-slate-900 font-medium">Kollapuram</span>
            </div>
            <div className="flex justify-between">
              <span>Helpline:</span>
              <span className="text-amber-600 font-bold">{businessSettings.phone1}</span>
            </div>
            <div className="flex justify-between">
              <span>Hours Today:</span>
              <span className="text-slate-900 font-medium">7:00 AM – 8:00 PM</span>
            </div>
          </div>
        </aside>

        {/* Tab Content Body */}
        <main className="flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                    Welcome, {adminUser.email}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    PM Cars Ariyalur Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    Live overview of vehicles in showroom yard, active customer requests, and inquiries.
                  </p>
                </div>

                <button
                  onClick={handleAddVehicle}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              {/* Statistics Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-medium text-slate-500 block">Total Inventory</span>
                  <span className="text-2xl font-mono font-black text-slate-900 mt-1 block">{totalVehicles}</span>
                  <span className="text-[10px] text-slate-400">Listed vehicles</span>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-medium text-emerald-600 block">Available</span>
                  <span className="text-2xl font-mono font-black text-emerald-600 mt-1 block">{availableVehicles}</span>
                  <span className="text-[10px] text-slate-400">Ready for sale</span>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-medium text-amber-600 block">Reserved</span>
                  <span className="text-2xl font-mono font-black text-amber-600 mt-1 block">{reservedVehicles}</span>
                  <span className="text-[10px] text-slate-400">Token received</span>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-medium text-slate-500 block">Sold</span>
                  <span className="text-2xl font-mono font-black text-slate-600 mt-1 block">{soldVehicles}</span>
                  <span className="text-[10px] text-slate-400">Closed deals</span>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-medium text-amber-600 block">Featured</span>
                  <span className="text-2xl font-mono font-black text-amber-600 mt-1 block">{featuredVehicles}</span>
                  <span className="text-[10px] text-slate-400">Hero highlights</span>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-medium text-blue-600 block">Sell Requests</span>
                  <span className="text-2xl font-mono font-black text-blue-600 mt-1 block">{pendingRequests}</span>
                  <span className="text-[10px] text-slate-400">Pending review</span>
                </div>
              </div>

              {/* Quick Actions & Recent Inventory */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Recent Inventory List */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">Recent Inventory Additions</h3>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {vehicles.slice(0, 4).map((veh) => (
                      <div
                        key={veh.id}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between gap-3 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={veh.thumbnail || veh.images?.[0]}
                            alt={veh.title}
                            className="w-12 h-9 object-cover rounded-lg bg-slate-200 shrink-0 border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">{veh.title}</span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {veh.year} • {veh.priceDisplay} • {veh.registrationType}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            id={`recent-vehicle-status-${veh.id}`}
                            value={veh.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as 'available' | 'reserved' | 'sold';
                              await setVehicleStatus(veh.id, newStatus);
                              onRefreshData();
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer transition ${
                              veh.status === 'available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : veh.status === 'reserved'
                                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <option value="available" className="bg-white text-emerald-800 font-bold">Available</option>
                            <option value="reserved" className="bg-white text-amber-900 font-bold">Reserved</option>
                            <option value="sold" className="bg-white text-slate-700 font-bold">Sold Out</option>
                          </select>
                          <button
                            onClick={() => handleEditVehicle(veh)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 cursor-pointer transition shadow-2xs"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sell Requests Quick Panel */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">New Submissions</h3>
                    <button
                      onClick={() => setActiveTab('sellRequests')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {sellRequests.slice(0, 3).map((req) => (
                      <div
                        key={req.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-900">{req.name}</span>
                          <span className="text-[11px] font-mono font-bold text-amber-700">₹{req.expectedPrice}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">
                          {req.year} {req.vehicleBrand} {req.vehicleModel}
                        </p>
                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 text-[10px] font-mono">
                          <span className="text-slate-500">{req.phone}</span>
                          <span className="capitalize text-emerald-700 font-bold">{req.status}</span>
                        </div>
                      </div>
                    ))}
                    {sellRequests.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">No pending sell requests</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <AdminInventory
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'add' && (
            <AdminVehicleForm
              initialVehicle={editingVehicle}
              onCancel={() => {
                setEditingVehicle(null);
                setActiveTab('inventory');
              }}
              onSaved={handleFormSaved}
            />
          )}

          {activeTab === 'sellRequests' && (
            <AdminSellRequests
              requests={sellRequests}
              onRefresh={onRefreshData}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settings={businessSettings}
              onSaved={onUpdateSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
};
