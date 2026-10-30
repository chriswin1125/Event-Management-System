import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BrandLogo Component
 * Renders the official NexEvent icon glyph paired with clean, accessible typography.
 * Adapts seamlessly across dark hero, light scrolled nav, footer, and auth containers.
 */
const BrandLogo = ({
  size = 'md',
  isDark = false,
  showTagline = false,
  to = '/',
  asLink = true,
  className = '',
}) => {
  // Dimension mappings
  const dimensions = {
    sm: {
      box: 'w-7 h-7 rounded-lg p-0.5',
      text: 'text-base font-bold',
      tagline: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      box: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl p-1',
      text: 'text-xl sm:text-2xl font-extrabold',
      tagline: 'text-[10px]',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      box: 'w-14 h-14 rounded-2xl p-1.5 shadow-md',
      text: 'text-3xl font-extrabold',
      tagline: 'text-xs',
      gap: 'gap-3.5',
    },
  };

  const dim = dimensions[size] || dimensions.md;

  const content = (
    <div className={`inline-flex items-center ${dim.gap} group select-none ${className}`}>
      {/* Icon Container (Apple-grade rounded squircle with dark backdrop) */}
      <div
        className={`relative flex-shrink-0 ${dim.box} bg-[#000000] border border-white/15 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
      >
        <img
          src="/logo-icon.png"
          alt="NexEvent Glyph"
          className="w-full h-full object-contain"
        />
        {/* Subtle inner gloss highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none rounded-[inherit]" />
      </div>

      {/* Brand Text Container */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`tracking-tight transition-colors duration-200 ${dim.text} ${
            isDark ? 'text-white' : 'text-[#1D1D1F]'
          }`}
        >
          Nex<span className="text-[#0071E3]">Event</span>
        </span>

        {showTagline && (
          <span
            className={`font-semibold uppercase tracking-widest mt-1 ${dim.tagline} ${
              isDark ? 'text-white/60' : 'text-[#86868B]'
            }`}
          >
            Connect • Engage • Experience
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to={to} className="inline-block focus:outline-none" aria-label="NexEvent Home">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
