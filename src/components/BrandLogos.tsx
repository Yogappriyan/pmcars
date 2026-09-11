import React from 'react';

interface BrandLogoProps {
  brandName: string;
  className?: string;
  isSelected?: boolean;
}

// 1. Maruti Suzuki (Navy Blue Wing 'M' + Red Suzuki 'S' + MARUTI SUZUKI text)
export const MarutiSuzukiLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Maruti Wing Symbol (Left) */}
    <g transform="translate(24, 8)">
      <rect width="38" height="36" rx="3" fill="#002d72" />
      <path d="M4 32L19 6L19 32Z" fill="white" />
      <path d="M19 6L34 32L19 32Z" fill="white" />
      <path d="M19 12L9 30L29 30Z" fill="#002d72" />
      <path d="M14 24L24 24L19 15Z" fill="white" />
    </g>
    {/* Suzuki S Symbol (Right) */}
    <g transform="translate(74, 8)">
      <path
        d="M6 36 L30 36 C34 36 38 33 38 28 L38 23 C38 20 35 18 31 18 L14 18 L34 4 L12 4 C7 4 3 7 3 12 L3 17 C3 20 6 22 10 22 L27 22 L6 36 Z"
        fill="#e11922"
      />
    </g>
    {/* Text: MARUTI SUZUKI */}
    <text x="75" y="62" textAnchor="middle" fill="#0a0a0a" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="13" letterSpacing="0.6">
      MARUTI
    </text>
    <text x="75" y="78" textAnchor="middle" fill="#0a0a0a" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="13" letterSpacing="0.6">
      SUZUKI
    </text>
  </svg>
);

// 2. Hyundai (Chrome Slanted H in Oval + HYUNDAI Blue Text)
export const HyundaiLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hyundai-chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="20%" stopColor="#94a3b8" />
        <stop offset="40%" stopColor="#f8fafc" />
        <stop offset="60%" stopColor="#cbd5e1" />
        <stop offset="85%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="hyundai-h-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="35%" stopColor="#f1f5f9" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    {/* Tilted Oval Ring & Slanted H */}
    <g transform="translate(75, 26) rotate(-7)">
      <ellipse cx="0" cy="0" rx="36" ry="19" stroke="url(#hyundai-chrome-grad)" strokeWidth="4.5" fill="none" />
      {/* Left arm */}
      <path
        d="M-16 -13 C-14 -5 -10 6 -7 13 C-5 13 -4 12 -5 10 C-8 3 -11 -6 -12 -12 Z"
        fill="url(#hyundai-h-grad)"
      />
      {/* Right arm */}
      <path
        d="M6 -13 C8 -5 12 6 15 13 C17 13 18 12 17 10 C14 3 11 -6 10 -12 Z"
        fill="url(#hyundai-h-grad)"
      />
      {/* Arched Crossbar */}
      <path
        d="M-9 -1 C-3 3 4 3 9 -1 C9 1 8 2 6 2 C1 4 -4 4 -9 1 Z"
        fill="url(#hyundai-h-grad)"
      />
    </g>
    {/* Text: HYUNDAI */}
    <text x="75" y="70" textAnchor="middle" fill="#002c6c" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="14" letterSpacing="1.8">
      HYUNDAI
    </text>
  </svg>
);

// 3. Mahindra (Red Twin Peaks / Rise Emblem + Mahindra Dark Slate Text)
export const MahindraLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Iconic Red Twin Swoop / Peak Emblem */}
    <g transform="translate(75, 24)">
      {/* Upper arched curve */}
      <path
        d="M-30 -3 C-16 -15 16 -15 30 -3 C22 -11 -22 -11 -30 -3 Z"
        fill="#e31837"
      />
      {/* Left swoop joining in middle */}
      <path
        d="M-26 -1 C-18 13 -3 16 0 17 C-7 13 -13 6 -16 -1 C-20 -4 -24 -4 -26 -1 Z"
        fill="#e31837"
      />
      {/* Right swoop joining in middle */}
      <path
        d="M26 -1 C18 13 3 16 0 17 C7 13 13 6 16 -1 C20 -4 24 -4 26 -1 Z"
        fill="#e31837"
      />
    </g>
    {/* Text: Mahindra */}
    <text x="75" y="70" textAnchor="middle" fill="#333333" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="800" fontSize="16" letterSpacing="0.2">
      Mahindra
    </text>
  </svg>
);

// 4. Toyota (Triple Ellipse Chrome + Red TOYOTA Text)
export const ToyotaLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="toyota-chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="25%" stopColor="#cbd5e1" />
        <stop offset="45%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    <g transform="translate(75, 26)">
      {/* Outer Ellipse */}
      <ellipse cx="0" cy="0" rx="34" ry="22" stroke="url(#toyota-chrome-grad)" strokeWidth="4.2" fill="none" />
      {/* Inner Vertical Ellipse */}
      <ellipse cx="0" cy="2" rx="13" ry="17" stroke="url(#toyota-chrome-grad)" strokeWidth="3.6" fill="none" />
      {/* Inner Horizontal Ellipse */}
      <ellipse cx="0" cy="-6" rx="21" ry="8" stroke="url(#toyota-chrome-grad)" strokeWidth="3.6" fill="none" />
    </g>
    {/* Text: TOYOTA */}
    <text x="75" y="70" textAnchor="middle" fill="#d71920" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="14.5" letterSpacing="1.6">
      TOYOTA
    </text>
  </svg>
);

// 5. Tata (Cobalt Blue Oval with Stylized 'T' + Blue TATA Text)
export const TataLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(75, 24)">
      {/* Blue Oval background */}
      <ellipse cx="0" cy="0" rx="28" ry="20" fill="#004890" />
      {/* Stylized White bifurcated T */}
      <path
        d="M-15 -9 C-8 -4 -3 4 -2 12 L2 12 C3 4 8 -4 15 -9 C11 -8 6 -3 4 3 L3.5 12 L-3.5 12 L-4 3 C-6 -3 -11 -8 -15 -9 Z"
        fill="white"
      />
      <path
        d="M-17 -9 C-9 -13 -3 -10 0 -5 C3 -10 9 -13 17 -9 C12 -11 6 -8 2 -4 L-2 -4 C-6 -8 -12 -11 -17 -9 Z"
        fill="white"
      />
    </g>
    {/* Text: TATA */}
    <text x="75" y="70" textAnchor="middle" fill="#004890" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="15.5" letterSpacing="2.5">
      TATA
    </text>
  </svg>
);

// 6. Honda (Chrome Boxed 'H' + Red HONDA Text)
export const HondaLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="honda-chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="25%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="75%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    <g transform="translate(75, 24)">
      {/* Outer rounded frame with tapered bottom */}
      <rect x="-26" y="-18" width="52" height="36" rx="8" stroke="url(#honda-chrome-grad)" strokeWidth="3.8" fill="none" />
      {/* Left leg */}
      <path
        d="M-16 -12 C-14 -4 -11 3 -8 11 L-4 11 C-6 2 -9 -5 -11 -12 Z"
        fill="url(#honda-chrome-grad)"
      />
      {/* Right leg */}
      <path
        d="M16 -12 C14 -4 11 3 8 11 L4 11 C6 2 9 -5 11 -12 Z"
        fill="url(#honda-chrome-grad)"
      />
      {/* Horizontal Crossbar */}
      <rect x="-8" y="-3" width="16" height="4" rx="1.5" fill="url(#honda-chrome-grad)" />
    </g>
    {/* Text: HONDA */}
    <text x="75" y="70" textAnchor="middle" fill="#cc0000" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="14" letterSpacing="1.4">
      HONDA
    </text>
  </svg>
);

// 7. Ashok Leyland
export const AshokLeylandLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(75, 23)">
      <circle cx="0" cy="0" r="19" fill="#003580" />
      <circle cx="0" cy="0" r="16.5" stroke="#f59e0b" strokeWidth="1.6" fill="none" />
      <path
        d="M-8 -9 L-2 -9 C2 -9 6 -5 6 0 C6 5 2 9 -2 9 L-8 9 Z"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M-8 -9 L-8 9 L4 9" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
    <text x="75" y="58" textAnchor="middle" fill="#003580" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="10" letterSpacing="0.8">
      ASHOK
    </text>
    <text x="75" y="72" textAnchor="middle" fill="#003580" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="10" letterSpacing="0.8">
      LEYLAND
    </text>
  </svg>
);

// 8. Renault
export const RenaultLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="renault-chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="30%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    <g transform="translate(75, 23)">
      <path
        d="M0 -18 L16 0 L0 18 L-16 0 Z"
        stroke="url(#renault-chrome-grad)"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M0 -9 L8 0 L0 9 L-8 0 Z"
        stroke="url(#renault-chrome-grad)"
        strokeWidth="2"
        fill="none"
      />
    </g>
    <text x="75" y="70" textAnchor="middle" fill="#1e293b" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1.8">
      RENAULT
    </text>
  </svg>
);

// 9. All Brands Star / Showcase Emblem
export const AllBrandsLogo: React.FC<{ className?: string }> = ({ className = "h-14 w-full" }) => (
  <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(75, 24)">
      <rect x="-21" y="-18" width="42" height="36" rx="9" fill="#0f172a" />
      <path d="M0 -11 L3 -3 L11 0 L3 3 L0 11 L-3 3 L-11 0 L-3 -3 Z" fill="#f59e0b" />
    </g>
    <text x="75" y="60" textAnchor="middle" fill="#0f172a" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="11" letterSpacing="1.2">
      ALL BRANDS
    </text>
    <text x="75" y="73" textAnchor="middle" fill="#d97706" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="800" fontSize="9" letterSpacing="0.8">
      SHOWROOM
    </text>
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandName, className, isSelected }) => {
  const norm = brandName.toLowerCase().trim();

  if (norm === 'all' || norm === 'all brands') {
    return <AllBrandsLogo className={className} />;
  }
  if (norm.includes('maruti') || norm.includes('suzuki')) {
    return <MarutiSuzukiLogo className={className} />;
  }
  if (norm.includes('hyundai')) {
    return <HyundaiLogo className={className} />;
  }
  if (norm.includes('mahindra')) {
    return <MahindraLogo className={className} />;
  }
  if (norm.includes('toyota')) {
    return <ToyotaLogo className={className} />;
  }
  if (norm.includes('tata')) {
    return <TataLogo className={className} />;
  }
  if (norm.includes('honda')) {
    return <HondaLogo className={className} />;
  }
  if (norm.includes('ashok') || norm.includes('leyland')) {
    return <AshokLeylandLogo className={className} />;
  }
  if (norm.includes('renault')) {
    return <RenaultLogo className={className} />;
  }

  // Fallback
  return (
    <div className={`h-14 w-full flex items-center justify-center font-mono font-black text-sm ${isSelected ? 'text-amber-400' : 'text-slate-800'}`}>
      {brandName.slice(0, 3).toUpperCase()}
    </div>
  );
};
