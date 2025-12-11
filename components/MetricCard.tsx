import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { ArrowUp, ArrowDown, Sparkles, Maximize2, Minimize2, MoreHorizontal } from 'lucide-react';
import { MetricPoint } from '../types';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  data: MetricPoint[];
  status?: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  prediction?: string;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  data,
  status = 'healthy',
  trend = 'stable',
  color = '#3b82f6', // Default blue
  prediction,
  icon
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusBg = {
    healthy: 'bg-white/60 border-white/60',
    warning: 'bg-amber-50/80 border-amber-200',
    critical: 'bg-red-50/80 border-red-200'
  };

  const statusGlow = {
    healthy: 'shadow-glass',
    warning: 'shadow-[0_0_15px_rgba(251,191,36,0.2)]',
    critical: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
  };

  return (
    <div 
      className={`
        relative rounded-3xl p-6 backdrop-blur-xl transition-all duration-500 ease-out border
        ${statusBg[status]} ${statusGlow[status]}
        ${isExpanded ? 'col-span-2 row-span-2 z-30 scale-[1.02]' : 'hover:-translate-y-1 hover:bg-white/80'}
      `}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-white shadow-sm text-gray-600`}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
            <div className="flex items-baseline gap-1">
               <span className="text-3xl font-bold text-gray-800 tracking-tight">{value}</span>
               <span className="text-sm text-gray-400 font-medium">{unit}</span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex gap-2">
           {isExpanded && (
             <button 
               onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
               className="p-1.5 hover:bg-black/5 rounded-full text-gray-400 transition-colors"
             >
               <Minimize2 size={16} />
             </button>
           )}
           {!isExpanded && (
             <button className="p-1.5 hover:bg-black/5 rounded-full text-gray-400 transition-colors">
               <MoreHorizontal size={16} />
             </button>
           )}
        </div>
      </div>

      {/* Chart Area */}
      <div className={`w-full transition-all duration-500 ${isExpanded ? 'h-64' : 'h-24'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {isExpanded && <YAxis hide domain={['auto', 'auto']} />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={3}
              fill={`url(#gradient-${title})`} 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info / Prediction */}
      <div className="mt-4 flex items-center justify-between">
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${trend === 'up' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          <span>2.4% vs last hour</span>
        </div>

        {prediction && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium animate-pulse">
            <Sparkles size={12} />
            {prediction}
          </div>
        )}
      </div>

      {/* Detail View Content (Only when expanded) */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4">
           <div className="grid grid-cols-3 gap-4">
             <div className="bg-white/50 p-3 rounded-xl border border-white/60">
                <div className="text-xs text-gray-500 mb-1">Peak (24h)</div>
                <div className="font-bold text-gray-800">85 {unit}</div>
             </div>
             <div className="bg-white/50 p-3 rounded-xl border border-white/60">
                <div className="text-xs text-gray-500 mb-1">Average</div>
                <div className="font-bold text-gray-800">42 {unit}</div>
             </div>
             <div className="bg-white/50 p-3 rounded-xl border border-white/60">
                <div className="text-xs text-gray-500 mb-1">Forecast</div>
                <div className="font-bold text-indigo-600">+5% exp.</div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
