import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { POPULAR_BRANDS } from '../data/initialData';
import { Vehicle } from '../types';
import { BrandLogo } from './BrandLogos';

interface BrandCategoryBarProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  vehicles: Vehicle[];
  isTamil: boolean;
}

export const BrandCategoryBar: React.FC<BrandCategoryBarProps> = ({
  selectedBrand,
  onSelectBrand,
  vehicles,
  isTamil
}) => {
  // Count vehicles per brand dynamically
  const getBrandCount = (brandName: string) => {
    if (brandName === 'all') return vehicles.length;
    return vehicles.filter(v => {
      const vBrand = v.brand.toLowerCase();
      const target = brandName.toLowerCase();
      return vBrand.includes(target) || target.includes(vBrand);
    }).length;
  };

  return (
    <section className="mb-10" id="brand-categories-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{isTamil ? 'பிராண்ட் வாரியாக ஆராயுங்கள்' : 'Browse By Car Brand'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isTamil ? 'முன்னணி ஆட்டோமொபைல் பிராண்டுகள்' : 'Shop Top Automobile Brands'}
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-mono">
          {isTamil ? 'காரைப் பார்க்க பிராண்டைக் கிளிக் செய்யவும்' : 'Click brand logo to filter showroom inventory'}
        </p>
      </div>

      {/* Brand Cards Grid styled after authentic brand badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 sm:gap-3.5">
        {/* All Brands Tile */}
        <button
          onClick={() => onSelectBrand('all')}
          id="brand-filter-all"
          className={`group relative text-center p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[148px] ${
            selectedBrand === 'all'
              ? 'bg-white text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400 ring-offset-2'
              : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm hover:-translate-y-1'
          }`}
        >
          {/* Top Status & Count Badge */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono">
            <span className={`px-2 py-0.5 rounded-full font-bold ${
              selectedBrand === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
            }`}>
              {vehicles.length} Total
            </span>
            {selectedBrand === 'all' ? (
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Active</span>
              </span>
            ) : (
              <span className="text-slate-400 font-medium group-hover:text-slate-600">All</span>
            )}
          </div>

          {/* Logo Illustration */}
          <div className="my-auto py-1.5 w-full flex items-center justify-center">
            <BrandLogo brandName="all" className="h-16 w-full max-w-[130px] object-contain transition-transform duration-200 group-hover:scale-105" isSelected={selectedBrand === 'all'} />
          </div>

          {/* Bottom Label */}
          <div className="w-full pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className={`font-black tracking-tight ${selectedBrand === 'all' ? 'text-amber-700' : 'text-slate-800'}`}>
              All Brands
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-amber-600 transition-colors">
              {isTamil ? 'அனைத்தும்' : 'View'} &rarr;
            </span>
          </div>
        </button>

        {/* Popular Brand Specific Tiles */}
        {POPULAR_BRANDS.map((b) => {
          const count = getBrandCount(b.name);
          const isSelected = selectedBrand.toLowerCase() === b.name.toLowerCase() || (b.shortName && selectedBrand.toLowerCase() === b.shortName.toLowerCase());

          return (
            <button
              key={b.id}
              onClick={() => onSelectBrand(b.name)}
              id={`brand-filter-${b.id}`}
              className={`group relative text-center p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[148px] ${
                isSelected
                  ? 'bg-white text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400 ring-offset-2'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm hover:-translate-y-1'
              }`}
            >
              {/* Top Stock Count Tag */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count} in Stock
                </span>
                {isSelected ? (
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium group-hover:text-slate-600 font-mono">
                    {count}
                  </span>
                )}
              </div>

              {/* Centered Brand Logo Graphic */}
              <div className="my-auto py-1.5 w-full flex items-center justify-center">
                <BrandLogo brandName={b.name} className="h-16 w-full max-w-[130px] object-contain transition-transform duration-200 group-hover:scale-105" isSelected={isSelected} />
              </div>

              {/* Bottom Brand Name & Action */}
              <div className="w-full pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className={`font-black tracking-tight line-clamp-1 ${isSelected ? 'text-amber-700' : 'text-slate-800'}`}>
                  {b.shortName || b.name}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-600 transition-colors">
                  {isTamil ? 'பார்' : 'View'} &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
