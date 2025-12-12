
import React from 'react';
import { Capsule } from '../../Capsule';
import { Button } from '../../Button';
import { Activity } from 'lucide-react';
import { MetricPoint } from '../../../types';

interface ObservabilitySatelliteProps {
  isProvisioning: boolean;
  isActive: boolean;
  onClick: () => void;
  metrics?: MetricPoint[];
}

// Lightweight SVG Chart Component
const SimpleMetricChart = ({ data, color = "#34d399" }: { data: any[], color?: string }) => {
  if (!data || data.length < 2) return null;

  // Calculate scales
  const values = data.map(d => d.value);
  const min = 0;
  const max = Math.max(...values, 100) * 1.2; 
  
  // Generate path data
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M0,100 ${points} L100,100 Z`;

  return (
    <div className="w-full h-full relative group">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${color})`} className="opacity-50" />
        
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute top-0 right-0 bg-neutral-900/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Live Metrics
      </div>
    </div>
  );
};

export const ObservabilitySatellite: React.FC<ObservabilitySatelliteProps> = ({ isProvisioning, isActive, onClick, metrics }) => {
  return (
    <Capsule 
      title="Observability" 
      type="satellite"
      status={isProvisioning ? "neutral" : "active"} 
      onClick={onClick}
      isExpanded={isActive}
    >
        {isProvisioning ? (
          <div className="h-20 w-full flex items-center justify-center text-gray-400 text-xs italic">
            Waiting for signals...
          </div>
        ) : (
          <div className="h-20 w-full mb-2">
              <SimpleMetricChart data={metrics || []} color="#34d399" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Activity size={16} className="text-neon-mint" />
            {isProvisioning ? 'Initializing' : '99.9% Uptime'}
          </div>
          {!isActive && <span className="text-xs text-gray-400">View Logs</span>}
        </div>
        {isActive && !isProvisioning && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 animate-in slide-in-from-top-2 fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Live Alerts</span>
              <span className="text-xs text-green-600 dark:text-green-400">All Systems Normal</span>
            </div>
            <Button size="sm" variant="ghost" className="w-full">Open Grafana View</Button>
          </div>
        )}
    </Capsule>
  );
};
