import React from 'react';
import pmCarsLogoImg from '../assets/images/logo pm.jpg';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-sm border border-slate-300/80 bg-slate-950 shrink-0 relative flex items-center justify-center`}
      >
        <img
          src={pmCarsLogoImg}
          alt="PM CARS Car Consultancy Logo"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to static public logo if bundler path fails
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition">
              PM CARS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-mono font-bold tracking-wider uppercase">
              Ariyalur
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium tracking-tight">
            Pre-Owned Vehicle Consultancy & Yard
          </p>
        </div>
      )}
    </div>
  );
};
