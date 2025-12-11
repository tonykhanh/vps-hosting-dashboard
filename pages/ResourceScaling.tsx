import React, { useState, useEffect } from 'react';
import { 
  Cpu, Zap, HardDrive, BarChart3, AlertTriangle, 
  CheckCircle2, ArrowUpRight, Scale, Sliders, Lock,
  TrendingUp, Calendar, DollarSign, Activity, History, Network, Database,
  Download, PieChart, Layers
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, BarChart, Bar, Legend, Cell } from 'recharts';

// Mock Data: Usage vs Limit vs Forecast
const generateScalingData = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    // Simulate a traffic curve (peak at noon and evening)
    const baseLoad = 30 + 20 * Math.sin((hour - 6) * Math.PI / 12); 
    const randomVar = Math.random() * 10;
    const usage = Math.max(10, baseLoad + randomVar);
    
    return {
      time: `${hour}:00`,
      usage: Math.round(usage),
      capacity: 80, // Static capacity
      forecast: i > 18 ? Math.round(usage * 1.2) : null // Future prediction
    };
  });
};

const SERVICE_ALLOCATION = [
  { name: 'Web Cluster', cpu: 45, ram: 60, disk: 20, net: 80, color: '#3b82f6' },
  { name: 'Primary DB', cpu: 75, ram: 85, disk: 70, net: 40, color: '#8b5cf6' },
  { name: 'Background Workers', cpu: 15, ram: 20, disk: 10, net: 10, color: '#10b981' },
  { name: 'Redis Cache', cpu: 10, ram: 40, disk: 5, net: 50, color: '#f59e0b' },
];

const SCALING_HISTORY = [
  { id: 1, action: 'Scale Up', resource: 'CPU', detail: '2 vCPU → 4 vCPU', reason: 'High Load (>85%)', time: '2 hours ago', impact: '+$0.04/hr' },
  { id: 2, action: 'Scale Down', resource: 'RAM', detail: '16 GB → 8 GB', reason: 'Underutilization', time: 'Yesterday', impact: '-$0.02/hr' },
  { id: 3, action: 'Scale Up', resource: 'Nodes', detail: '1 → 2 Instances', reason: 'Traffic Spike', time: '2 days ago', impact: '+$0.12/hr' },
];

export const ResourceScaling: React.FC = () => {
  // Scaling State
  const [strategy, setStrategy] = useState(50); // 0 = Cost, 100 = Performance
  const [isAutoScaling, setIsAutoScaling] = useState(true);
  const [scalingData] = useState(generateScalingData());
  const [projectedCost, setProjectedCost] = useState(240);

  // Update cost projection based on strategy
  useEffect(() => {
    // Simple algo: Higher performance strategy = Higher cost
    setProjectedCost(200 + (strategy * 1.5));
  }, [strategy]);

  // Anomalies/Recommendations
  const [recommendations, setRecommendations] = useState([
    { id: 1, type: 'scale_up', resource: 'Database RAM', msg: 'Memory pressure predicted at 18:00', saving: null, performance: 'High Impact' },
    { id: 2, type: 'scale_down', resource: 'Worker Nodes', msg: 'Nodes idle for >4 hours', saving: '$45/mo', performance: 'No Impact' },
  ]);

  const handleApplyRec = (id: number) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Scale className="text-plasma-600" size={32} />
            Resource Allocation & Scaling
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI-Driven Dynamic Optimization & Capacity Planning.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
           <Button variant="secondary" className="dark:bg-neutral-800 dark:text-gray-200 dark:border-neutral-700 flex-1 md:flex-none">
              <Download size={16} className="mr-2"/> Report
           </Button>
           {/* Auto-Scale Toggle */}
           <div 
             onClick={() => setIsAutoScaling(!isAutoScaling)}
             className={`
               cursor-pointer px-4 py-2 rounded-lg border flex items-center gap-3 transition-all duration-300 select-none flex-1 md:flex-none justify-between md:justify-start
               ${isAutoScaling ? 'bg-plasma-600 border-plasma-500 text-white shadow-neon' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700'}
             `}
           >
             <div className="flex flex-col items-end">
               <span className="text-xs font-bold uppercase tracking-wider">Auto-Scaling</span>
               <span className="text-[10px] opacity-80">{isAutoScaling ? 'Active' : 'Paused'}</span>
             </div>
             <div className={`w-10 h-6 rounded-full relative transition-colors ${isAutoScaling ? 'bg-white/30' : 'bg-gray-200 dark:bg-neutral-600'}`}>
               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAutoScaling ? 'translate-x-5' : 'translate-x-1'}`}></div>
             </div>
           </div>
        </div>
      </div>

      {/* 3.4 Real-Time Resource Monitoring - Live Pulse */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
            { label: 'Total vCPU', value: '12 / 16', usage: 75, icon: Cpu, color: 'text-blue-500' },
            { label: 'Total RAM', value: '24GB / 32GB', usage: 60, icon: HardDrive, color: 'text-purple-500' },
            { label: 'Storage', value: '1.2TB / 2TB', usage: 55, icon: Database, color: 'text-amber-500' },
            { label: 'Bandwidth', value: '450 Mbps', usage: 45, icon: Network, color: 'text-green-500' },
         ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm flex flex-col justify-between h-28">
               <div className="flex justify-between items-start">
                  <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg text-gray-600 dark:text-gray-300">
                     <stat.icon size={18} />
                  </div>
                  <span className={`text-sm font-bold ${stat.color}`}>{stat.usage}%</span>
               </div>
               <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">{stat.label}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-700 h-1 rounded-full mt-2 overflow-hidden">
                     <div className={`h-full ${stat.color.replace('text-', 'bg-')}`} style={{ width: `${stat.usage}%` }}></div>
                  </div>
               </div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Forecast & Strategy */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* 3.3 Predictive Resource Scaling */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-8 shadow-glass">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <TrendingUp size={20} className="text-plasma-600"/> Demand vs Capacity Forecast
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">24-Hour AI Projection. Dotted line indicates prediction.</p>
                 </div>
                 <div className="flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-plasma-500"></div> Usage</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-indigo-400 opacity-50"></div> AI Forecast</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-1 rounded bg-red-500"></div> Capacity Limit</div>
                 </div>
              </div>

              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scalingData}>
                       <defs>
                          <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-neutral-700" />
                       <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} minTickGap={30} />
                       <Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#1e293b', borderColor: '#374151', color: '#f3f4f6' }} />
                       
                       <Area type="monotone" dataKey="usage" stroke="#3b82f6" fill="url(#usageGrad)" strokeWidth={3} />
                       <Area type="monotone" dataKey="forecast" stroke="#818cf8" fill="transparent" strokeDasharray="5 5" strokeWidth={3} />
                       {/* Capacity Line */}
                       <Area type="step" dataKey="capacity" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="3 3" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* 3.1 Resource Allocation by Service/Project */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compute Allocation */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Layers size={18} /> Service Compute Breakdown
                 </h3>
                 <div className="space-y-5">
                    {SERVICE_ALLOCATION.map(service => (
                       <div key={service.name}>
                          <div className="flex justify-between text-xs mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                             <span>{service.name}</span>
                             <span className={service.cpu > 70 ? 'text-amber-500 font-bold' : ''}>{service.cpu}% / {service.ram}%</span>
                          </div>
                          <div className="flex gap-1 h-2 rounded-full overflow-hidden w-full bg-gray-100 dark:bg-neutral-700">
                             <div className="h-full bg-blue-500" style={{ width: `${service.cpu}%` }} title="CPU"></div>
                             <div className="h-full bg-purple-500 opacity-50" style={{ width: `${Math.max(0, service.ram - service.cpu)}%` }} title="RAM"></div>
                          </div>
                          <div className="flex justify-between mt-1">
                             <span className="text-[10px] text-gray-400">CPU</span>
                             <span className="text-[10px] text-gray-400">RAM</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Storage & Network Allocation */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Database size={18} /> Storage & Network
                 </h3>
                 <div className="space-y-5">
                    {SERVICE_ALLOCATION.map(service => (
                       <div key={service.name} className="space-y-1">
                          <div className="flex justify-between text-xs mb-1 font-medium text-gray-700 dark:text-gray-300">
                             <span>{service.name}</span>
                          </div>
                          <div className="flex gap-2">
                             <div className="h-1.5 rounded-full bg-amber-500 opacity-80" style={{ width: `${service.disk}%` }} title={`Disk: ${service.disk}%`}></div>
                             <div className="h-1.5 rounded-full bg-green-500 opacity-80" style={{ width: `${service.net}%` }} title={`Net: ${service.net}%`}></div>
                          </div>
                       </div>
                    ))}
                    <div className="flex gap-4 text-[10px] text-gray-400 pt-2 border-t border-gray-100 dark:border-neutral-700 mt-4">
                       <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Disk Usage</span>
                       <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Bandwidth</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Right Column: Controls & Recommendations */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* 3.5 Cost vs. Performance Trade-offs */}
           <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-indigo-800 dark:text-indigo-300 font-bold">
                 <Sliders size={20} /> Optimization Strategy
              </div>
              
              <div className="relative pt-6 pb-2">
                 <input 
                   type="range" 
                   min="0" max="100" 
                   value={strategy}
                   onChange={(e) => setStrategy(parseInt(e.target.value))}
                   className="w-full h-2 bg-indigo-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
                 <div className="flex justify-between text-xs font-bold mt-3 text-gray-500 dark:text-gray-400">
                    <span className={strategy < 30 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Cost Saving</span>
                    <span className={strategy > 30 && strategy < 70 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Balanced</span>
                    <span className={strategy > 70 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Performance</span>
                 </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-indigo-100 dark:border-indigo-900/20">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Projected Cost</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${projectedCost}/mo</span>
                 </div>
                 <p className="text-[10px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
                    {strategy < 30 ? 'Prioritizes minimal resource usage. Scale-down is aggressive (5m idle). Potential latency during bursts.' : 
                     strategy > 70 ? 'Maintains 20% headroom buffer. Instant scaling. Higher cost but lowest latency.' : 
                     'Balanced approach. Scales up when load > 70% sustained for 2m.'}
                 </p>
              </div>
           </div>

           {/* 3.2 AI-Driven Scaling Recommendations */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <Zap size={18} className="text-amber-500"/> AI Recommendations
              </h3>
              <div className="space-y-3">
                 {recommendations.map(rec => (
                    <div key={rec.id} className="p-4 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl shadow-sm relative overflow-hidden">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                             rec.type === 'scale_up' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          }`}>
                             {rec.type.replace('_', ' ')}
                          </span>
                          {rec.saving && <span className="text-xs font-bold text-green-600 dark:text-green-400">{rec.saving}</span>}
                       </div>
                       <h4 className="font-bold text-sm text-gray-900 dark:text-white">{rec.resource}</h4>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{rec.msg}</p>
                       <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-3">
                          <Activity size={10} /> Impact: {rec.performance}
                       </div>
                       <Button size="sm" onClick={() => handleApplyRec(rec.id)} className="w-full text-xs h-8">
                          Apply Adjustment
                       </Button>
                    </div>
                 ))}
                 {recommendations.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">All optimizations applied.</div>
                 )}
              </div>
           </div>

           {/* 3.6 Resource Scaling Reports (History) */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <History size={18} className="text-gray-500"/> Scaling Logs
                 </h3>
                 <button className="text-xs text-plasma-600 dark:text-plasma-400 hover:underline">Full Report</button>
              </div>
              <div className="space-y-4 relative">
                 <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-neutral-700"></div>
                 {SCALING_HISTORY.map(log => (
                    <div key={log.id} className="relative pl-6">
                       <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${
                          log.action.includes('Up') ? 'bg-blue-500' : 'bg-green-500'
                       }`}></div>
                       <div className="flex justify-between items-start">
                          <div>
                             <div className="text-sm font-bold text-gray-900 dark:text-white">{log.action} {log.resource}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">{log.detail}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] text-gray-400 font-mono">{log.time}</div>
                             <div className={`text-[10px] font-bold ${log.impact.startsWith('+') ? 'text-amber-500' : 'text-green-500'}`}>
                                {log.impact}
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};