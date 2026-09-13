/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Vehicle, SellRequest, AdminUser, BusinessSettings, FilterState, AppUser } from './types';
import { 
  onVehiclesChange, 
  onSellRequestsChange, 
  getBusinessSettings, 
  getCurrentAdminUser,
  getCurrentUser,
  getVehicles,
  subscribeToAdminAuth,
  subscribeToUserAuth,
  adminSignOut,
  AUTHORIZED_ADMIN_EMAILS,
  createCustomerBooking
} from './firebase/service';
import { DEFAULT_BUSINESS_SETTINGS } from './data/initialData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandCategoryBar } from './components/BrandCategoryBar';
import { QuickFilter } from './components/QuickFilter';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetailsModal } from './components/VehicleDetailsModal';
import { ValueProposition } from './components/ValueProposition';
import { CommercialVehicles } from './components/CommercialVehicles';
import { SellYourCar } from './components/SellYourCar';
import { FinanceSection } from './components/FinanceSection';
import { InsuranceSection } from './components/InsuranceSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerPortal } from './components/user/CustomerPortal';
import { GoogleAuthModal } from './components/auth/GoogleAuthModal';
import { RazorpayPaymentModal } from './components/RazorpayPaymentModal';
import { motion } from 'motion/react';
import { 
  Phone, 
  MessageCircle, 
  Car, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  PRIMARY_PHONE, 
  PRIMARY_PHONE_DISPLAY, 
  WHATSAPP_NUMBER, 
  getPhoneLink, 
  generateGeneralWhatsAppLink 
} from './utils/contact';

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function App() {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isTamil, setIsTamil] = useState<boolean>(false);

  // Data state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sellRequests, setSellRequests] = useState<SellRequest[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(DEFAULT_BUSINESS_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  // Admin session state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // App user state (distinguishes Admin from Normal User)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Selected vehicle for modal details
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Razorpay Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [paymentVehicle, setPaymentVehicle] = useState<Vehicle | null>(null);

  const handleOpenPayment = (vehicle?: Vehicle | null) => {
    setPaymentVehicle(vehicle || null);
    setPaymentModalOpen(true);
  };

  const handleSignOut = async () => {
    await adminSignOut();
    setAdminUser(null);
    setCurrentUser(null);
    if (activeTab === 'admin' || activeTab === 'portal') {
      handleTabChange('home');
    }
  };

  // Filter state for inventory
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    brand: 'all',
    category: 'all',
    bodyType: 'all',
    fuel: 'all',
    priceRange: 'all',
    transmission: 'all',
    year: 'all',
    owners: 'all',
    kmRange: 'all',
    sortBy: 'newest'
  });

  // Listen to hash changes for direct routing (#admin, #portal, #sell, #inventory, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['admin', 'portal', 'sell', 'inventory', 'commercial', 'finance', 'insurance', 'about', 'contact'].includes(hash)) {
        setActiveTab(hash);
      } else if (!hash || hash === 'home') {
        setActiveTab('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subscribe to real-time vehicles, sell requests, & admin/user auth state
  useEffect(() => {
    // Fetch initial business settings
    getBusinessSettings().then((settings) => {
      if (settings) setBusinessSettings(settings);
    });

    // Real-time listener for admin auth
    const unsubscribeAuth = subscribeToAdminAuth((currentAdmin) => {
      setAdminUser(currentAdmin);
    });

    // Real-time listener for general user auth (admin vs normal user)
    const unsubscribeUser = subscribeToUserAuth((user) => {
      setCurrentUser(user);
    });

    // Real-time listener for vehicles
    const unsubscribeVehicles = onVehiclesChange((updatedVehicles) => {
      setVehicles(updatedVehicles);
      setLoading(false);
    });

    // Real-time listener for sell requests
    const unsubscribeRequests = onSellRequestsChange((updatedRequests) => {
      setSellRequests(updatedRequests);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser();
      unsubscribeVehicles();
      unsubscribeRequests();
    };
  }, []);

  // Refresh data explicitly after admin operations
  const refreshData = async () => {
    const freshVehicles = await getVehicles();
    setVehicles(freshVehicles);
  };

  // Dynamic available years list
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(vehicles.map((v) => Number(v.year)))).sort((a: number, b: number) => b - a);
    return years.length > 0 ? years : [2024, 2023, 2022, 2021, 2020, 2019, 2018];
  }, [vehicles]);

  // Dynamic vehicle filtering and sorting
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Search term
      if (filter.search.trim()) {
        const term = filter.search.toLowerCase();
        const matchesTitle = v.title.toLowerCase().includes(term);
        const matchesBrand = v.brand.toLowerCase().includes(term);
        const matchesModel = v.model.toLowerCase().includes(term);
        const matchesDesc = (v.description || '').toLowerCase().includes(term);
        if (!matchesTitle && !matchesBrand && !matchesModel && !matchesDesc) {
          return false;
        }
      }

      // Brand filter
      if (filter.brand && filter.brand !== 'all') {
        const target = filter.brand.toLowerCase();
        const vBrand = v.brand.toLowerCase();
        if (!vBrand.includes(target) && !target.includes(vBrand)) {
          return false;
        }
      }

      // Category: 'all' | 'private' | 'commercial'
      if (filter.category !== 'all' && v.vehicleCategory !== filter.category) {
        return false;
      }

      // Body Type: 'all' | 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Commercial' | 'Pickup'
      if (filter.bodyType && filter.bodyType !== 'all') {
        if (v.bodyType !== filter.bodyType) {
          return false;
        }
      }

      // Fuel: 'all' | 'Petrol' | 'Diesel' | 'CNG' | 'Electric'
      if (filter.fuel !== 'all' && v.fuelType !== filter.fuel) {
        return false;
      }

      // Transmission
      if (filter.transmission !== 'all' && v.transmission !== filter.transmission) {
        return false;
      }

      // Year
      if (filter.year !== 'all' && v.year.toString() !== filter.year) {
        return false;
      }

      // Number of owners
      if (filter.owners && filter.owners !== 'all') {
        if (filter.owners === '1' && v.owners !== 1) return false;
        if (filter.owners === '2' && v.owners !== 2) return false;
        if (filter.owners === '3plus' && v.owners < 3) return false;
      }

      // KM Range
      if (filter.kmRange && filter.kmRange !== 'all') {
        if (filter.kmRange === 'under50k' && (v.kilometers || 0) > 50000) return false;
        if (filter.kmRange === 'under100k' && (v.kilometers || 0) > 100000) return false;
      }

      // Price Range
      if (filter.priceRange !== 'all') {
        const p = v.price;
        if (filter.priceRange === 'under3' && p >= 300000) return false;
        if (filter.priceRange === '3to5' && (p < 300000 || p > 500000)) return false;
        if (filter.priceRange === '5to8' && (p < 500000 || p > 800000)) return false;
        if (filter.priceRange === '8to15' && (p < 800000 || p > 1500000)) return false;
        if (filter.priceRange === 'above15' && p < 1500000) return false;
        // legacy backwards compatibility
        if (filter.priceRange === '5to10' && (p < 500000 || p > 1000000)) return false;
        if (filter.priceRange === 'above10' && p < 1000000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price-low') return a.price - b.price;
      if (filter.sortBy === 'price-high') return b.price - a.price;
      if (filter.sortBy === 'km-low') return (a.kilometers || 0) - (b.kilometers || 0);
      if (filter.sortBy === 'year-high') return b.year - a.year;
      // Default newest
      return (b.year || 0) - (a.year || 0);
    });
  }, [vehicles, filter]);

  // Unique filter key string to re-trigger smooth entrance animations when any filter criteria change
  const filterKey = useMemo(() => {
    return `${filter.search}_${filter.brand}_${filter.category}_${filter.bodyType}_${filter.fuel}_${filter.priceRange}_${filter.transmission}_${filter.year}_${filter.owners}_${filter.kmRange}_${filter.sortBy}`;
  }, [filter]);

  // Featured vehicles
  const featuredVehicles = useMemo(() => {
    return vehicles.filter((v) => v.featured);
  }, [vehicles]);

  // ADMIN ROUTE INTERCEPTION
  if (activeTab === 'admin') {
    if (!adminUser || adminUser.email !== AUTHORIZED_ADMIN_EMAILS[0]) {
      return (
        <AdminLogin
          onBackToWebsite={() => handleTabChange('home')}
          onLoginSuccess={() => {
            const current = getCurrentAdminUser();
            setAdminUser(current);
          }}
          onNavigateToCustomerPortal={() => handleTabChange('portal')}
        />
      );
    }

    return (
      <AdminDashboard
        adminUser={adminUser}
        vehicles={vehicles}
        sellRequests={sellRequests}
        businessSettings={businessSettings}
        onRefreshData={refreshData}
        onBackToWebsite={() => handleTabChange('home')}
        onSignOut={handleSignOut}
        onUpdateSettings={(newSettings) => setBusinessSettings(newSettings)}
      />
    );
  }

  // PUBLIC WEBSITE
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans antialiased text-slate-900 pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isTamil={isTamil}
        setIsTamil={setIsTamil}
        onOpenPayment={() => handleOpenPayment(null)}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenAdmin={() => handleTabChange('admin')}
      />

      {/* Main Content Area based on activeTab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onExploreInventory={() => {
                const invElem = document.getElementById('inventory-section');
                if (invElem) invElem.scrollIntoView({ behavior: 'smooth' });
                else handleTabChange('inventory');
              }}
              onSellCar={() => handleTabChange('sell')}
              totalVehicles={vehicles.length}
              isTamil={isTamil}
            />

            {/* Main Showroom Section */}
            <section id="inventory-section" className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
              {/* E-Commerce Car Brands Carousel & Showcase */}
              <BrandCategoryBar
                selectedBrand={filter.brand || 'all'}
                onSelectBrand={(brand) => {
                  setFilter((prev) => ({ ...prev, brand }));
                  const invElem = document.getElementById('inventory-section');
                  if (invElem) {
                    invElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                vehicles={vehicles}
                isTamil={isTamil}
              />

              {/* Quick Search & Filters */}
              <QuickFilter
                filter={filter}
                onFilterChange={setFilter}
                availableYears={availableYears}
                totalResults={filteredVehicles.length}
                isTamil={isTamil}
              />

              {/* Inventory Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Current Yard Inventory in Ariyalur
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Showing {filteredVehicles.length} verified pre-owned cars & commercial vehicles ready for immediate delivery.
                    {filter.brand && filter.brand !== 'all' && (
                      <span className="font-bold text-amber-700 ml-1">
                        Filtered by brand: {filter.brand}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Vehicle Cards Grid */}
              {filteredVehicles.length > 0 ? (
                <motion.div
                  key={`home-grid-${filterKey}`}
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredVehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      variants={cardVariants}
                      className="h-full flex flex-col"
                    >
                      <VehicleCard
                        vehicle={vehicle}
                        onViewDetails={(v) => setSelectedVehicle(v)}
                        isTamil={isTamil}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`home-empty-${filterKey}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Car className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">No Vehicles Match Your Search</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Try resetting your filter options or contact our dealership directly to inquire about incoming vehicles.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFilter({
                        search: '',
                        brand: 'all',
                        category: 'all',
                        bodyType: 'all',
                        fuel: 'all',
                        priceRange: 'all',
                        transmission: 'all',
                        year: 'all',
                        owners: 'all',
                        kmRange: 'all',
                        sortBy: 'newest'
                      })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </motion.div>
              )}
            </section>

            {/* Value Proposition: 01 Finance, 02 Parking Sales, 03 Insurance */}
            <ValueProposition
              onSelectAction={(tab) => handleTabChange(tab)}
              isTamil={isTamil}
            />

            {/* Commercial Vehicles Spotlight */}
            <CommercialVehicles
              vehicles={vehicles}
              onViewDetails={(v) => setSelectedVehicle(v)}
              isTamil={isTamil}
            />

            {/* Finance & EMI Planner */}
            <FinanceSection isTamil={isTamil} />

            {/* Sell Your Car Section */}
            <SellYourCar isTamil={isTamil} />

            {/* Insurance Section */}
            <InsuranceSection isTamil={isTamil} />

            {/* About Dealership */}
            <AboutSection isTamil={isTamil} />

            {/* Contact & Showroom Hours */}
            <ContactSection isTamil={isTamil} />
          </>
        )}

        {activeTab === 'inventory' && (
          <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-6">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                PM Cars Showroom Yard
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                All Available Pre-Owned Vehicles
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Browse our complete stock of Own Board family cars and T-Board commercial carriers in Ariyalur.
                {filter.brand && filter.brand !== 'all' && (
                  <span className="font-bold text-amber-700 ml-1">
                    Filtered by brand: {filter.brand}
                  </span>
                )}
              </p>
            </div>

            {/* E-Commerce Car Brands Carousel & Showcase */}
            <BrandCategoryBar
              selectedBrand={filter.brand || 'all'}
              onSelectBrand={(brand) => setFilter((prev) => ({ ...prev, brand }))}
              vehicles={vehicles}
              isTamil={isTamil}
            />

            <QuickFilter
              filter={filter}
              onFilterChange={setFilter}
              availableYears={availableYears}
              totalResults={filteredVehicles.length}
              isTamil={isTamil}
            />

            {filteredVehicles.length > 0 ? (
              <motion.div
                key={`inv-grid-${filterKey}`}
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredVehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    variants={cardVariants}
                    className="h-full flex flex-col"
                  >
                    <VehicleCard
                      vehicle={vehicle}
                      onViewDetails={(v) => setSelectedVehicle(v)}
                      isTamil={isTamil}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`inv-empty-${filterKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4"
              >
                <Car className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-900 text-lg">No vehicles matched your search filters</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting or resetting your filter criteria to view available stock.
                </p>
                <button
                  onClick={() =>
                    setFilter({
                      search: '',
                      brand: 'all',
                      category: 'all',
                      bodyType: 'all',
                      fuel: 'all',
                      priceRange: 'all',
                      transmission: 'all',
                      year: 'all',
                      owners: 'all',
                      kmRange: 'all',
                      sortBy: 'newest'
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'commercial' && (
          <div className="py-8">
            <CommercialVehicles
              vehicles={vehicles}
              onViewDetails={(v) => setSelectedVehicle(v)}
              isTamil={isTamil}
            />
          </div>
        )}

        {activeTab === 'sell' && (
          <SellYourCar isTamil={isTamil} />
        )}

        {activeTab === 'finance' && (
          <FinanceSection isTamil={isTamil} />
        )}

        {activeTab === 'insurance' && (
          <InsuranceSection isTamil={isTamil} />
        )}

        {activeTab === 'about' && (
          <AboutSection isTamil={isTamil} />
        )}

        {activeTab === 'contact' && (
          <ContactSection isTamil={isTamil} />
        )}

        {activeTab === 'portal' && (
          <CustomerPortal
            user={currentUser || { uid: 'guest', email: 'guest@pmcars.in', name: 'Guest Customer', role: 'user', active: true }}
            vehicles={vehicles}
            sellRequests={sellRequests}
            onSignOut={handleSignOut}
            onNavigate={handleTabChange}
            onOpenPayment={(v) => handleOpenPayment(v)}
            onTryAdmin={() => handleTabChange('admin')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={businessSettings}
        onNavigate={handleTabChange}
        onSelectTab={handleTabChange}
        onOpenAdmin={() => handleTabChange('admin')}
        isTamil={isTamil}
      />

      {/* Floating WhatsApp Quick Action Button (bottom right on desktop) */}
      <aside aria-label="WhatsApp quick chat" className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        <a
          id="floating-whatsapp-widget"
          href={generateGeneralWhatsAppLink('general')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-900/40 font-bold text-xs sm:text-sm transition transform hover:scale-105 active:scale-95 group"
          title="Chat with PM Cars on WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-white" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -top-1 -right-1 border border-emerald-600 animate-pulse" />
          </div>
          <span className="hidden sm:inline">WhatsApp PM Cars</span>
        </a>
      </aside>

      {/* Sticky Mobile Bottom Quick Action Bar (Section 6 & 11) */}
      <nav aria-label="Mobile quick actions" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-4 flex items-center justify-between gap-3 shadow-2xl">
        {/* Call Now */}
        <a
          id="mobile-sticky-call-btn"
          href={getPhoneLink(PRIMARY_PHONE)}
          className="flex-1 py-3 px-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
        >
          <Phone className="w-4 h-4 fill-slate-950" />
          <span>Call PM Cars</span>
        </a>

        {/* WhatsApp */}
        <a
          id="mobile-sticky-whatsapp-btn"
          href={generateGeneralWhatsAppLink('general')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp Chat</span>
        </a>
      </nav>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          isTamil={isTamil}
          onOpenPayment={(v) => handleOpenPayment(v)}
        />
      )}

      {/* Razorpay Checkout & Signature Verification Modal */}
      <RazorpayPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        vehicle={paymentVehicle}
        onPaymentSuccess={(_verification, bookedVehicle) => {
          if (bookedVehicle) {
            setVehicles((prev) =>
              prev.map((v) =>
                v.id === bookedVehicle.id ? { ...v, status: 'reserved' as const } : v
              )
            );
            const targetEmail = currentUser?.email || 'customer@pmcars.in';
            const targetName = currentUser?.name || 'Customer';
            createCustomerBooking({
              customerEmail: targetEmail,
              customerName: targetName,
              customerPhone: '+91 98424 55123',
              vehicleId: bookedVehicle.id,
              vehicleTitle: bookedVehicle.title,
              vehicleBrand: bookedVehicle.brand,
              vehicleModel: bookedVehicle.model,
              vehicleVariant: bookedVehicle.variant,
              vehicleYear: bookedVehicle.year,
              vehiclePrice: bookedVehicle.price,
              vehicleImage: bookedVehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
              registrationNumber: bookedVehicle.registrationType === 'T-Board' ? 'TN 61 T 1120' : 'TN 61 F 4490',
              fuelType: bookedVehicle.fuelType,
              transmission: bookedVehicle.transmission,
              tokenAmount: 10000,
              balancePayable: Math.max(0, bookedVehicle.price - 10000),
              paymentId: _verification.paymentId || `pay_${Date.now()}`,
              paymentStatus: 'verified',
              bookingStatus: 'confirmed',
              estimatedDeliveryDate: 'Ready for Yard Inspection & Handover',
              yardLocation: 'PM Cars Main Yard, Kollapuram Bypass, Ariyalur',
              notes: 'Advance booking token verified online. Ready for delivery handover.'
            }).then(() => {
              handleTabChange('portal');
            });
          }
        }}
      />

      {/* Google Account Authentication Modal */}
      <GoogleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user, isAdmin) => {
          setCurrentUser(user);
          if (isAdmin) {
            setAdminUser(user as AdminUser);
            handleTabChange('admin');
          } else {
            setAdminUser(null);
            handleTabChange('portal');
          }
        }}
      />
    </div>
  );
}
