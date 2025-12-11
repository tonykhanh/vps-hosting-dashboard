import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score, className = '', size = 'md' }) => {
  // Determine color and icon based on score
  let colorClass = 'text-green-500 dark:text-green-400';
  let strokeColor = '#22c55e';
  let Icon = CheckCircle2;
  let label = 'Excellent';

  if (score < 90) {
    colorClass = 'text-yellow-500 dark:text-yellow-400';
    strokeColor = '#eab308';
    Icon = AlertTriangle;
    label = 'Warning';
  }
  if (score < 70) {
    colorClass = 'text-red-500 dark:text-red-400';
    strokeColor = '#ef4444';
    Icon = ShieldAlert;
    label = 'Critical';
  }

  // Size configurations
  const sizeConfig = {
    sm: { size: 80, stroke: 6, fontSize: 'text-xl' },
    md: { size: 160, stroke: 12, fontSize: 'text-4xl' },
    lg: { size: 240, stroke: 16, fontSize: 'text-6xl' }
  };
  const config = sizeConfig[size];

  // SVG Gauge Calculations
  const center = config.size / 2;
  const radius = (config.size - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Radial Gauge */}
      <div style={{ width: config.size, height: config.size }} className="relative">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${config.size} ${config.size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="transparent"
            className="text-gray-100 dark:text-neutral-700/50"
          />
          {/* Progress Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={strokeColor}
            strokeWidth={config.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${config.fontSize} font-bold ${colorClass} transition-colors duration-500 tracking-tight`}>
            {score}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-1 font-semibold">Health</span>
        </div>
      </div>

      {/* Status Label */}
      <div className={`mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur border border-white/60 dark:border-white/10 shadow-sm ${colorClass}`}>
        <Icon size={14} strokeWidth={2.5} />
        <span className="font-bold text-xs uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
};