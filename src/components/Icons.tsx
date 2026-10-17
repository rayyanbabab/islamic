import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Clean, geometrically precise 8-pointed Islamic Star (Rub el Hizb)
 * Used as an authentic, non-AI emblem for Asmaul Husna & Islamic sacred texts.
 */
export const RubElHizbIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      {/* Outer 8-point geometric star */}
      <polygon points="12,2 15,6.5 20,4 17.5,9 22,12 17.5,15 20,20 15,17.5 12,22 9,17.5 4,20 6.5,15 2,12 6.5,9 4,4 9,6.5" />
      {/* Inner subtle circle */}
      <circle cx="12" cy="12" r="3.25" strokeWidth="1.5" />
    </svg>
  );
};

/**
 * Authentic Tasbih Beads Icon
 * Clean 3 prayer beads with string and tassel, replacing generic sparkles or dots.
 */
export const TasbihBeadsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      {/* Loop of cord */}
      <path d="M12 3C7.5 3 4 6.5 4 11c0 3.8 2.6 7 6.2 7.8L12 21l1.8-2.2C17.4 18 20 14.8 20 11c0-4.5-3.5-8-8-8z" strokeDasharray="2 3" opacity="0.4" />
      {/* Prayer Beads */}
      <circle cx="8" cy="8" r="2.2" />
      <circle cx="12" cy="5.2" r="2.2" />
      <circle cx="16" cy="8" r="2.2" />
      <circle cx="17.5" cy="12.5" r="2.2" />
      <circle cx="14.5" cy="16.5" r="2.2" />
      <circle cx="9.5" cy="16.5" r="2.2" />
      <circle cx="6.5" cy="12.5" r="2.2" />
      {/* Imamah / Tassel */}
      <path d="M12 19v3.5" />
      <path d="M10.5 22.5h3" />
    </svg>
  );
};

/**
 * Clean Noor Brand Mark
 * Minimalist Crescent with 8-Point Star
 */
export const NoorBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      {/* Crisp crescent */}
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.5 5.5 0 0 1-7.54-7.54C12.92 3.04 12.46 3 12 3z" />
      {/* Small clean geometric focal star */}
      <polygon
        points="17,5 18,6.5 19.5,7 18,7.5 17,9 16,7.5 14.5,7 16,6.5"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
};

/**
 * Minimalist Kaaba Icon for Qibla
 */
export const KaabaIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      {/* 3D isometric cube outline */}
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3z" />
      <path d="M12 12v9" />
      <path d="M12 12 4 7.5" />
      <path d="M12 12l8-4.5" />
      {/* Kiswah gold band accent */}
      <path d="M4 10.5 12 15l8-4.5" opacity="0.6" strokeWidth="1.25" />
    </svg>
  );
};
