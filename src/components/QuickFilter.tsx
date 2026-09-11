import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Filter, 
  Car, 
  Fuel, 
  IndianRupee, 
  Calendar, 
  SlidersHorizontal, 
  X, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Gauge, 
  Check 
} from 'lucide-react';
import { FilterState, BodyType } from '../types';
import { POPULAR_BRANDS } from '../data/initialData';

interface QuickFilterProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  availableYears: number[];
  totalResults: number;
  isTamil: boolean;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  filter,
  onFilterChange,
  availableYears,
  totalResults,
  isTamil
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleBrandChange = (brand: string) => {
    onFilterChange({ ...filter, brand });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filter, category });
  };

  const handleBodyTypeChange = (bodyType: string) => {
    onFilterChange({ ...filter, bodyType });
  };

  const handleFuelChange = (fuel: string) => {
    onFilterChange({ ...filter, fuel });
  };

  const handlePriceChange = (priceRange: string) => {
    onFilterChange({ ...filter, priceRange });
  };

  const handleTransmissionChange = (transmission: string) => {
    onFilterChange({ ...filter, transmission });
  };

  const handleYearChange = (year: string) => {
    onFilterChange({ ...filter, year });
  };

  const handleOwnersChange = (owners: string) => {
    onFilterChange({ ...filter, owners });
  };

  const handleKmChange = (kmRange: string) => {
    onFilterChange({ ...filter, kmRange });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, sortBy: e.target.value as FilterState['sortBy'] });
  };

  const resetFilters = () => {
    onFilterChange({
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
  };

  // Active filters array for pill tags
  const activePills: { key: string; label: string; onRemove: () => void }[] = [];

  if (filter.search) {
    activePills.push({
      key: 'search',
      label: `"${filter.search}"`,
      onRemove: () => onFilterChange({ ...filter, search: '' })
    });
  }

  if (filter.brand && filter.brand !== 'all') {
    activePills.push({
      key: 'brand',
      label: `Brand: ${filter.brand}`,
      onRemove: () => onFilterChange({ ...filter, brand: 'all' })
    });
  }

  if (filter.category && filter.category !== 'all') {
    activePills.push({
      key: 'category',
      label: filter.category === 'private' ? 'Private Cars' : 'Commercial Vehicles',
      onRemove: () => onFilterChange({ ...filter, category: 'all' })
    });
  }

  if (filter.bodyType && filter.bodyType !== 'all') {
    activePills.push({
      key: 'bodyType',
      label: `Type: ${filter.bodyType}`,
      onRemove: () => onFilterChange({ ...filter, bodyType: 'all' })
    });
  }

  if (filter.priceRange && filter.priceRange !== 'all') {
    const priceLabels: Record<string, string> = {
      under3: 'Under ₹3 Lakh',
      '3to5': '₹3L – ₹5L',
      '5to8': '₹5L – ₹8L',
      '8to15': '₹8L – ₹15L',
      above15: '₹15L & Above'
    };
    activePills.push({
      key: 'price',
      label: priceLabels[filter.priceRange] || filter.priceRange,
      onRemove: () => onFilterChange({ ...filter, priceRange: 'all' })
    });
  }

  if (filter.fuel && filter.fuel !== 'all') {
    activePills.push({
      key: 'fuel',
      label: `Fuel: ${filter.fuel}`,
      onRemove: () => onFilterChange({ ...filter, fuel: 'all' })
    });
  }

  if (filter.transmission && filter.transmission !== 'all') {
    activePills.push({
      key: 'trans',
      label: filter.transmission,
      onRemove: () => onFilterChange({ ...filter, transmission: 'all' })
    });
  }

  if (filter.year && filter.year !== 'all') {
    activePills.push({
      key: 'year',
      label: `${filter.year} Model`,
      onRemove: () => onFilterChange({ ...filter, year: 'all' })
    });
  }

  if (filter.owners && filter.owners !== 'all') {
    activePills.push({
      key: 'owners',
      label: filter.owners === '1' ? '1st Owner' : filter.owners === '2' ? '2nd Owner' : '3+ Owners',
      onRemove: () => onFilterChange({ ...filter, owners: 'all' })
    });
  }

  if (filter.kmRange && filter.kmRange !== 'all') {
    activePills.push({
      key: 'km',
      label: filter.kmRange === 'under50k' ? '< 50,000 km' : '< 1,00,000 km',
      onRemove: () => onFilterChange({ ...filter, kmRange: 'all' })
    });
  }

  const isFiltered = activePills.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-8 transition-all" id="products-filter-container">
      {/* Top Header Row with Title, Total Count & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
              <span>Filter & Search Vehicles</span>
              {isFiltered && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {activePills.length} active
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Showing <span className="font-bold text-slate-900">{totalResults}</span> {totalResults === 1 ? 'vehicle' : 'vehicles'} matching criteria
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="hidden sm:inline text-slate-500 font-mono">Sort:</span>
            <select
              value={filter.sortBy || 'newest'}
              onChange={handleSortChange}
              id="sort-by-select"
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
            >
              <option value="newest">Newest Stock</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="km-low">Lowest Driven (KM)</option>
              <option value="year-high">Latest Model Year</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              id="reset-filter-btn"
              className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-md transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search Input */}
      <div className="mt-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="vehicle-search-input"
            value={filter.search || ''}
            onChange={handleTextChange}
            placeholder="Search by car brand, model, or variant (e.g. Swift, Innova, Creta, Scorpio, Bolero)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Primary Faceted Filter Controls (Row 1) */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Brand Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-mono">
            <Layers className="w-3 h-3 text-amber-600" />
            <span>Car Brand</span>
          </label>
          <select
            id="filter-brand-select"
            value={filter.brand || 'all'}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
          >
            <option value="all">All Brands</option>
            {POPULAR_BRANDS.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Budget / Price */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-mono">
            <IndianRupee className="w-3 h-3 text-amber-600" />
            <span>Price Budget</span>
          </label>
          <select
            id="filter-price-select"
            value={filter.priceRange || 'all'}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
          >
            <option value="all">Any Price</option>
            <option value="under3">Under ₹3 Lakh</option>
            <option value="3to5">₹3 Lakh – ₹5 Lakh</option>
            <option value="5to8">₹5 Lakh – ₹8 Lakh</option>
            <option value="8to15">₹8 Lakh – ₹15 Lakh</option>
            <option value="above15">₹15 Lakh & Above</option>
          </select>
        </div>

        {/* Body Type / Vehicle Style */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-mono">
            <Car className="w-3 h-3 text-amber-600" />
            <span>Body Style</span>
          </label>
          <select
            id="filter-bodytype-select"
            value={filter.bodyType || 'all'}
            onChange={(e) => handleBodyTypeChange(e.target.value)}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
          >
            <option value="all">All Styles</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="MUV">MUV / 7-Seater</option>
            <option value="Commercial">Commercial / Cargo</option>
            <option value="Pickup">Pickup Truck</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-mono">
            <Fuel className="w-3 h-3 text-amber-600" />
            <span>Fuel Type</span>
          </label>
          <select
            id="filter-fuel-select"
            value={filter.fuel || 'all'}
            onChange={(e) => handleFuelChange(e.target.value)}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
          >
            <option value="all">Any Fuel</option>
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
            Transmission
          </label>
          <select
            id="filter-transmission-select"
            value={filter.transmission || 'all'}
            onChange={(e) => handleTransmissionChange(e.target.value)}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
          >
            <option value="all">All Transmissions</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic (AMT/AT)</option>
          </select>
        </div>
      </div>

      {/* Advanced Filter Expansion (Row 2: Year, Category, Owners, KM) */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-150">
          {/* Model Year */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>Model Year</span>
            </label>
            <select
              id="filter-year-select"
              value={filter.year || 'all'}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
            >
              <option value="all">Any Year</option>
              {availableYears.map((y) => (
                <option key={y} value={y.toString()}>
                  {y} Model
                </option>
              ))}
            </select>
          </div>

          {/* Registration Category (Private vs Commercial) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
              Registration Board
            </label>
            <select
              id="filter-category-select"
              value={filter.category || 'all'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
            >
              <option value="all">All Registrations</option>
              <option value="private">Private (Own Board)</option>
              <option value="commercial">Commercial (T-Board)</option>
            </select>
          </div>

          {/* Number of Owners */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-mono">
              <Users className="w-3 h-3 text-amber-600" />
              <span>Ownership</span>
            </label>
            <select
              id="filter-owners-select"
              value={filter.owners || 'all'}
              onChange={(e) => handleOwnersChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
            >
              <option value="all">Any Ownership</option>
              <option value="1">1st Owner Only</option>
              <option value="2">2nd Owner</option>
              <option value="3plus">3 or More Owners</option>
            </select>
          </div>

          {/* Kilometers Driven */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-mono">
              <Gauge className="w-3 h-3 text-amber-600" />
              <span>Kilometers</span>
            </label>
            <select
              id="filter-km-select"
              value={filter.kmRange || 'all'}
              onChange={(e) => handleKmChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition cursor-pointer"
            >
              <option value="all">Any Mileage</option>
              <option value="under50k">Under 50,000 km</option>
              <option value="under100k">Under 1,00,000 km</option>
            </select>
          </div>
        </div>
      )}

      {/* Toggle Advanced Filters Button */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          id="toggle-advanced-filters-btn"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition py-1"
        >
          {showAdvanced ? (
            <>
              <span>Fewer Filters</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>More Filters (Year, Ownership, Mileage, Board)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* Quick Brand Badges on bottom row */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-mono text-[11px]">Popular:</span>
          {['Maruti Suzuki', 'Hyundai', 'Tata', 'Toyota', 'Mahindra'].map((b) => (
            <button
              key={b}
              onClick={() => handleBrandChange(filter.brand === b ? 'all' : b)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                filter.brand === b 
                  ? 'bg-amber-400 text-slate-950 font-bold' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Chips / Pills */}
      {isFiltered && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Active filters:</span>
          {activePills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 group"
            >
              <span>{pill.label}</span>
              <button
                onClick={pill.onRemove}
                className="hover:text-red-600 transition cursor-pointer p-0.5"
                title={`Remove ${pill.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={resetFilters}
            className="text-xs text-amber-700 hover:text-amber-900 font-bold ml-2 underline cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
