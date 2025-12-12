
import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CapsuleProps {
  title: string;
  type: 'primary' | 'satellite';
  status?: 'active' | 'warning' | 'error' | 'neutral';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isExpanded?: boolean;
  aiInsight?: string;
}

export const Capsule: React.FC<CapsuleProps> = ({
  title,
  type,
  status = 'neutral',
  children,
  onClick,
  className = '',
  isExpanded = false,
  aiInsight
}) => {
  // Enhanced Visual Variants
  // Note: Using group-hover because the group class is on the parent wrapper
  const statusStyles = {
    active: 'border-plasma-200 dark:border-plasma-500/40 group-hover:border-plasma-400 dark:group-hover:border-plasma-400 shadow-[0_0_20px_-10px_rgba(14,165,233,0.3)]',
    warning: 'border-amber-200 dark:border-amber-500/40 group-hover:border-amber-400 dark:group-hover:border-amber-400 shadow-[0_0_20px_-10px_rgba(245,158,11,0.3)]',
    error: 'border-red-200 dark:border-red-500/40 group-hover:border-red-400 dark:group-hover:border-red-400 shadow-[0_0_20px_-10px_rgba(239,68,68,0.3)]',
    neutral: 'border-gray-200 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-white/30'
  };

  const activeStatusStyle = statusStyles[status] || statusStyles.neutral;

  // Inner styles (the visual box with overflow hidden)
  const primaryInner = `
    bg-white dark:bg-[#050505] 
    text-gray-900 dark:text-gray-100
    backdrop-blur-3xl 
    border-2 border-white/80 dark:border-white/20 
    shadow-2xl dark:shadow-spatial
    transition-colors duration-500
  `;

  const satelliteInner = `
    bg-white/95 dark:bg-[#0A0A0A]/90 
    text-gray-700 dark:text-gray-300
    backdrop-blur-2xl 
    border 
    ${activeStatusStyle}
    group-hover:bg-white dark:group-hover:bg-black
    group-hover:shadow-xl 
    transition-all duration-300
  `;

  // Wrapper styles (layout & positioning & hover transforms)
  const wrapperBase = `relative rounded-[2rem] transition-all duration-500 ease-out cursor-pointer group`;
  const primaryWrapper = `z-20 scale-100`;
  const satelliteWrapper = `z-10 hover:scale-[1.02] hover:-translate-y-1`;

  return (
    <div 
      onClick={onClick}
      className={`
        ${wrapperBase}
        ${type === 'primary' ? primaryWrapper : satelliteWrapper}
        ${isExpanded ? 'scale-[1.03] z-30' : ''}
        ${className}
      `}
    >
      {/* AI Insight Badge - Floating OUTSIDE the overflow-hidden container */}
      {aiInsight && (
        <div className="absolute -top-3 right-6 z-50 bg-gradient-to-r from-plasma-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-plasma-500/20 flex items-center gap-1 animate-float whitespace-nowrap border border-white/20 pointer-events-none transition-transform duration-300">
          <Sparkles size={10} className="text-yellow-200" />
          {aiInsight}
        </div>
      )}

      {/* Inner Container (Visuals + Clipping) */}
      <div className={`
        relative h-full w-full rounded-[2rem] overflow-hidden
        ${type === 'primary' ? primaryInner : satelliteInner}
        ${isExpanded ? 'ring-2 ring-plasma-400 ring-offset-2 dark:ring-offset-black bg-white dark:bg-black' : ''}
      `}>
          {/* Subtle Inner Gradient/Sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none transition-opacity duration-500" />
          
          {/* Active Glow for Satellites */}
          {type === 'satellite' && status === 'active' && (
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-plasma-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-plasma-500/20 transition-colors duration-500" />
          )}

          {/* Header */}
          <div className="relative p-6 flex justify-between items-start border-b border-gray-100/50 dark:border-white/10 transition-colors duration-500">
            <h3 className={`font-bold tracking-tight transition-colors duration-300 ${type === 'primary' ? 'text-2xl text-gray-900 dark:text-white' : 'text-lg text-gray-900 dark:text-gray-100'}`}>
              {title}
            </h3>
            {type === 'satellite' && (
              <div className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-plasma-500 hover:text-white dark:hover:bg-plasma-500 text-gray-400 dark:text-gray-400 transition-all duration-300">
                <ArrowUpRight size={16} />
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="relative p-6">
            {children}
          </div>
      </div>
    </div>
  );
};
