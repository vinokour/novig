import React from 'react';

// Sportsbook logo components for best line indicators
export const SportsbookLogo = ({ 
  sportsbook, 
  size = 'w-4 h-4',
  className = ''
}: { 
  sportsbook: 'novig' | 'dk' | 'fd' | 'mgm';
  size?: string;
  className?: string;
}) => {
  const baseClasses = `inline-block rounded ${size} flex items-center justify-center text-white text-xs font-bold ${className}`;
  
  switch (sportsbook) {
    case 'novig':
      return (
        <div className={`${baseClasses} bg-black`}>
          N
        </div>
      );
    case 'dk':
      return (
        <div className={`${baseClasses} bg-blue-600`}>
          DK
        </div>
      );
    case 'fd':
      return (
        <div className={`${baseClasses} bg-orange-600`}>
          FD
        </div>
      );
    case 'mgm':
      return (
        <div className={`${baseClasses} bg-green-600`}>
          MGM
        </div>
      );
    default:
      return null;
  }
};

// Helper function to check if a sportsbook has the best line
export const hasBestLine = (
  currentSportsbook: 'novig' | 'dk' | 'fd' | 'mgm',
  bestLineSportsbook: 'novig' | 'dk' | 'fd' | 'mgm' | undefined
): boolean => {
  return bestLineSportsbook === currentSportsbook;
};
