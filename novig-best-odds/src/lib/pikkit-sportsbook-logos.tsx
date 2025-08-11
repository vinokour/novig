import React from 'react';

// Pikkit sportsbook logo components using actual logo URLs
export const PikkitSportsbookLogo = ({ 
  logoUrl, 
  size = 'w-4 h-4',
  className = ''
}: { 
  logoUrl: string | null;
  size?: string;
  className?: string;
}) => {
  if (!logoUrl) return null;
  
  const baseClasses = `inline-block rounded ${size} overflow-hidden ${className}`;
  
  // Use the actual Pikkit logo URL
  return (
    <div className={baseClasses}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={logoUrl} 
        alt="Sportsbook logo" 
        className={`${size} object-contain`}
        onError={(e) => {
          // Fallback to a placeholder if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<div class="w-full h-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">SB</div>`;
          }
        }}
      />
    </div>
  );
};

// Helper function to get sportsbook name from brand ID
export const getSportsbookName = (brandId: string | null): string => {
  if (!brandId) return 'Unknown';
  
  switch (brandId) {
    case '66ec6d77a735d9808f158314': return 'Sportsbook';
    case '62167c03614389c4baf2d01e': return 'FanDuel';
    case '62167bdb614389c4baf2d018': return 'DraftKings';
    case '63d144e0c68fb6437cf98dec': return 'MGM';
    case '62167bf7614389c4baf2d01c': return 'BetRivers';
    case '62167bea614389c4baf2d01a': return 'Caesars';
    case '62167bf0614389c4baf2d01b': return 'PointsBet';
    case '62167be2614389c4baf2d019': return 'Unibet';
    case '6488a765549e2db791b0c935': return 'BetMGM';
    default: return `Brand ${brandId.substring(0, 8)}`;
  }
};
