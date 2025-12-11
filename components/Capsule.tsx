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
  // Visual variants based on status
  const statusColors = {
    active: 'border-white/40 bg-white/60 dark:bg-neutral-800/60 dark:border-white/10 shadow-glass hover:border-plasma-400 dark:hover:border-plasma-500/50',
    warning: 'border-amber-200 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-700/50 shadow-glass hover:border-amber-400',
    error: 'border-red-200 bg-red-50/80 dark:bg-red-900/20 dark:border-red-700/50 shadow-glass hover:border-red-400',
    neutral: 'border-white/30 bg-white/40 dark:bg-neutral-800/40 dark:border-white/5 shadow-glass hover:border-white/60 dark:hover:border-white/20'
  };

  const primaryStyles = "scale-100 z-20 border-plasma-200 bg-white/80 dark:bg-neutral-900/80 dark:border-plasma-500/30 shadow-2xl ring-1 ring-white/50 dark:ring-white/5";
  const satelliteStyles = `scale-95 hover:scale-100 hover:-translate-y-1 z-10 ${statusColors[status]}`;

  return (
    <div 
      onClick={onClick}
      className={`
        relative rounded-3xl backdrop-blur-xl transition-all duration-500 ease-out cursor-pointer
        ${type === 'primary' ? primaryStyles : satelliteStyles}
        ${isExpanded ? 'ring-2 ring-plasma-400 scale-[1.02] bg-white/90 dark:bg-neutral-800/90 z-30' : ''}
        ${className}
      `}
    >
      {/* Glossy sheen effect - rounded-3xl needed since parent no longer clips */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none dark:from-white/5 rounded-3xl" />
      
      {/* AI Insight Badge (Floating) */}
      {aiInsight && (
        <div className="absolute -top-3 right-6 bg-gradient-to-r from-plasma-500 to-indigo-600 text-white text-[10px] px-3 py-1 rounded-full shadow-neon flex items-center gap-1 z-40 animate-float whitespace-nowrap">
          <Sparkles size={10} />
          {aiInsight}
        </div>
      )}

      {/* Header */}
      <div className="relative p-6 flex justify-between items-start border-b border-black/5 dark:border-white/5">
        <h3 className={`font-bold tracking-tight ${type === 'primary' ? 'text-2xl text-neutral-900 dark:text-white' : 'text-lg text-neutral-800 dark:text-gray-200'}`}>
          {title}
        </h3>
        {type === 'satellite' && (
          <div className="p-2 rounded-full bg-white/50 dark:bg-white/5 hover:bg-plasma-500 hover:text-white transition-colors group">
            <ArrowUpRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-white transition-colors" />
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="relative p-6">
        {children}
      </div>
    </div>
  );
};