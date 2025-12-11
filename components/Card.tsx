import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'glass' | 'neon';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverable = false,
  variant = 'default'
}) => {
  const baseStyles = "rounded-xl transition-all duration-200";
  
  const variants = {
    default: "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm",
    glass: "bg-white/70 dark:bg-neutral-900/60 backdrop-blur-lg border border-white/50 dark:border-white/10 shadow-glass",
    neon: "bg-neutral-900 dark:bg-black border border-neutral-800 dark:border-neutral-800 shadow-neon text-white"
  };

  const hoverStyles = hoverable 
    ? "hover:shadow-md hover:border-gray-300 dark:hover:border-neutral-600 cursor-pointer hover:-translate-y-0.5" 
    : "";

  return (
    <div 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className} p-6`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ 
  title: string; 
  subtitle?: string; 
  action?: React.ReactNode; 
  className?: string 
}> = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex justify-between items-start mb-6 ${className}`}>
    <div>
      <h3 className={`text-lg font-bold tracking-tight ${className.includes('text-white') ? 'text-white' : 'text-neutral-800 dark:text-white'}`}>{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);