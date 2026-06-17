import React from 'react';

interface FurnitureSketchProps {
  type: 'chair' | 'table' | 'sofa' | 'lamp' | 'storage';
  className?: string;
}

export const FurnitureSketch: React.FC<FurnitureSketchProps> = ({ type, className = '' }) => {
  // Common container with brand-themed gradients
  const gradients = {
    chair: 'from-[#f5ebe0] to-[#e6ccb2]',
    sofa: 'from-[#eddcd2] to-[#ddb892]',
    table: 'from-[#e6dfd5] to-[#c8b6a6]',
    lamp: 'from-[#f0eae1] to-[#d4c3b3]',
    storage: 'from-[#e3d5ca] to-[#d5bdaf]',
  };

  const selectedGradient = gradients[type] || 'from-[#fdf9f4] to-[#e6dfd5]';

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-tr ${selectedGradient} rounded-xl overflow-hidden ${className}`}>
      {/* Decorative premium background grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {/* Minimalist Sketch SVGs */}
      {type === 'chair' && (
        <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-[#31170E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Backrest */}
          <path d="M30,30 C30,25 35,20 50,20 C65,20 70,25 70,30 L70,55 L30,55 Z" strokeWidth="2.5" />
          {/* Cushion */}
          <rect x="25" y="55" width="50" height="8" rx="3" fill="currentColor" fillOpacity="0.1" strokeWidth="2.5" />
          {/* Front Legs */}
          <line x1="32" y1="63" x2="28" y2="80" strokeWidth="2" />
          <line x1="68" y1="63" x2="72" y2="80" strokeWidth="2" />
          {/* Back Legs */}
          <line x1="40" y1="63" x2="38" y2="78" opacity="0.6" strokeWidth="1.5" />
          <line x1="60" y1="63" x2="62" y2="78" opacity="0.6" strokeWidth="1.5" />
          {/* Armrest details */}
          <path d="M25,50 L32,50" />
          <path d="M75,50 L68,50" />
        </svg>
      )}

      {type === 'sofa' && (
        <svg viewBox="0 0 100 100" className="w-[65%] h-[65%] text-[#31170E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Backrest */}
          <path d="M15,40 C15,35 25,32 50,32 C75,32 85,35 85,40 L85,60 L15,60 Z" strokeWidth="2.5" />
          {/* Cushions */}
          <rect x="20" y="52" width="30" height="10" rx="3" fill="currentColor" fillOpacity="0.1" />
          <rect x="50" y="52" width="30" height="10" rx="3" fill="currentColor" fillOpacity="0.1" />
          {/* Armrests */}
          <path d="M10,48 C10,43 15,45 20,48 L20,62 C15,62 10,60 10,55 Z" strokeWidth="2" />
          <path d="M90,48 C90,43 85,45 80,48 L80,62 C85,62 90,60 90,55 Z" strokeWidth="2" />
          {/* Legs */}
          <line x1="22" y1="62" x2="20" y2="72" strokeWidth="2.5" />
          <line x1="78" y1="62" x2="80" y2="72" strokeWidth="2.5" />
          <line x1="50" y1="62" x2="50" y2="70" opacity="0.5" strokeWidth="1.5" />
        </svg>
      )}

      {type === 'table' && (
        <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-[#31170E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Table Top (Isometric/Linear View) */}
          <polygon points="15,40 85,40 75,48 25,48" fill="currentColor" fillOpacity="0.15" strokeWidth="2.5" />
          {/* Table Top thickness */}
          <polygon points="15,40 25,48 25,51 15,43" fill="currentColor" fillOpacity="0.25" />
          <polygon points="25,48 75,48 75,51 25,51" fill="currentColor" fillOpacity="0.25" />
          <polygon points="75,48 85,40 85,43 75,51" fill="currentColor" fillOpacity="0.25" />
          
          {/* Wooden legs */}
          <line x1="28" y1="51" x2="24" y2="75" strokeWidth="3" />
          <line x1="72" y1="51" x2="76" y2="75" strokeWidth="3" />
          {/* Hidden back legs */}
          <line x1="32" y1="47" x2="35" y2="68" opacity="0.5" strokeWidth="2" />
          <line x1="68" y1="47" x2="65" y2="68" opacity="0.5" strokeWidth="2" />
          {/* Support bar */}
          <line x1="28" y1="58" x2="72" y2="58" strokeWidth="1.5" opacity="0.7" />
        </svg>
      )}

      {type === 'lamp' && (
        <svg viewBox="0 0 100 100" className="w-[55%] h-[55%] text-[#31170E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Base */}
          <path d="M35,80 L65,80 C60,77 40,77 35,80" fill="currentColor" strokeWidth="2.5" />
          {/* Curved stand */}
          <path d="M50,80 L50,50 C50,35 68,38 68,28" strokeWidth="2" />
          {/* Lamp shade */}
          <path d="M58,28 L78,28 L73,18 L63,18 Z" fill="currentColor" fillOpacity="0.15" strokeWidth="2.5" />
          {/* Bulb/Light glow ring */}
          <circle cx="68" cy="32" r="3" fill="#d97706" stroke="#d97706" strokeWidth="1" />
          <path d="M68,35 L68,42" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2,2" />
          <path d="M63,38 L58,41" stroke="#d97706" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M73,38 L78,41" stroke="#d97706" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      )}

      {type === 'storage' && (
        <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-[#31170E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Sideboard body */}
          <rect x="15" y="32" width="70" height="36" rx="2" fill="currentColor" fillOpacity="0.1" strokeWidth="2.5" />
          {/* Divider line */}
          <line x1="50" y1="32" x2="50" y2="68" strokeWidth="1.5" />
          {/* Slats pattern on left door */}
          <line x1="22" y1="36" x2="22" y2="64" strokeWidth="1" opacity="0.6" />
          <line x1="28" y1="36" x2="28" y2="64" strokeWidth="1" opacity="0.6" />
          <line x1="34" y1="36" x2="34" y2="64" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="36" x2="40" y2="64" strokeWidth="1" opacity="0.6" />
          <line x1="46" y1="36" x2="46" y2="64" strokeWidth="1" opacity="0.6" />
          {/* Handles on right door */}
          <circle cx="56" cy="50" r="1.5" fill="currentColor" />
          <line x1="55" y1="46" x2="57" y2="46" strokeWidth="1" />
          {/* Drawers lines on right side */}
          <line x1="50" y1="44" x2="85" y2="44" strokeWidth="1.5" />
          <line x1="50" y1="56" x2="85" y2="56" strokeWidth="1.5" />
          <circle cx="67" cy="38" r="1" fill="currentColor" />
          <circle cx="67" cy="50" r="1" fill="currentColor" />
          <circle cx="67" cy="62" r="1" fill="currentColor" />
          {/* Legs */}
          <line x1="22" y1="68" x2="18" y2="78" strokeWidth="2.5" />
          <line x1="78" y1="68" x2="82" y2="78" strokeWidth="2.5" />
        </svg>
      )}
    </div>
  );
};
export default FurnitureSketch;
