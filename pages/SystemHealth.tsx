import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Activity, Zap, Server, ShieldCheck, 
  AlertTriangle, CheckCircle2, TrendingUp, Cpu, 
  HardDrive, Network, RefreshCw, ArrowRight, Database
} from 'lucide-react';
import { Button } from '../components/Button';
import { HealthScore } from '../components/HealthScore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Mock Data
const PERFORMANCE_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: 30 + Math.random() * 20,
  memory: 40 + Math.random() * 15,
  network: 10 + Math.random() * 40
}));

interface Anomaly {
  id: string;
  type: 'critical' | 'warning';
  message: string;
  component: string;
  timestamp: string;
  status: 'detected' | 'analyzing' | 'resolving' | 'resolved';
}

interface ActionLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  outcome: 'success' | 'pending';
}

export const SystemHealth: React.FC = () => {
  const [healthScore, setHealthScore] = useState(94);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    { id: 'a-1', type: 'warning', message: 'Unusual Memory Growth', component: 'Redis Cache', timestamp: '2m ago', status: 'resolving' }
  ]);
  const [autoActions] = useState<ActionLog[]>([
    { id: 'ac-1', action: 'Scaled Web Nodes', target: '+2 Instances', timestamp: '10:45 AM', outcome: 'success' },
    { id: 'ac-2', action: 'Optimized DB Cache', target: 'Query Pool', timestamp: '09:30 AM', outcome: 'success' },
  ]);

  // Simulate Live Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthScore(prev => Math.max(80, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <HeartPulse className="text-plasma-600" size={32} />
            System Health & Metrics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time observability and AI-driven self-healing.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold border border-green-200 dark:border-green-800">
           <Activity size={16} className="animate-pulse" /> All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Health & KPI */}
        <div className="lg:col-span-4 space-y-6">
           {/* Main Health Card */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-8 shadow-glass flex flex-col items-center text-center">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-6">Global Health Score</h3>
              <div className="scale-125 mt-6 mb-8">
                 <HealthScore score={Math.round(healthScore)} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                 System is performing within optimal parameters. AI predicts stable load for the next 4 hours.
              </p>
           </div>

           {/* Resource Summary */}
           <div className="grid grid-cols-1 gap-4">
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Cpu size={20}/></div>
                    <div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">CPU Usage</div>
                       <div className="font-bold text-gray-900 dark:text-white">34% <span className="text-xs font-normal text-gray-400">avg</span></div>
                    </div>
                 </div>
                 <TrendingUp size={16} className="text-green-500" />
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><HardDrive size={20}/></div>
                    <div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Memory</div>
                       <div className="font-bold text-gray-900 dark:text-white">4.2GB <span className="text-xs font-normal text-gray-400">/ 8GB</span></div>
                    </div>
                 </div>
                 <div className="w-16 h-1.5 bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[52%]"></div>
                 </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><Network size={20}/></div>
                    <div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Network</div>
                       <div className="font-bold text-gray-900 dark:text-white">125 MB/s</div>
                    </div>
                 </div>
                 <Activity size={16} className="text-green-500" />
              </div>
           </div>
        </div>

        {/* Center/Right: Charts & Insights */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Live Metrics Chart */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass h-80">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity size={18} className="text-plasma-600"/> Real-Time Performance
                 </h3>
                 <div className="flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <span className="text-gray-600 dark:text-gray-300">CPU</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> <span className="text-gray-600 dark:text-gray-300">RAM</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> <span className="text-gray-600 dark:text-gray-300">Net</span></div>
                 </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                       <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-neutral-700" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', border: 'none', color: '#fff' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="url(#cpuGrad)" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="memory" stroke="#a855f7" fill="transparent" strokeWidth={2} />
                    <Area type="monotone" dataKey="network" stroke="#22c55e" fill="transparent" strokeWidth={2} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Anomaly Detection */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <ShieldCheck size={18} className="text-plasma-600"/> Anomaly Detection
                    </h3>
                    <span className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">Active</span>
                 </div>
                 <div className="space-y-3">
                    {anomalies.map(a => (
                       <div key={a.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl flex items-start gap-3">
                          <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
                          <div className="flex-1">
                             <div className="flex justify-between">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{a.component}</span>
                                <span className="text-[10px] text-gray-500 uppercase">{a.timestamp}</span>
                             </div>
                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{a.message}</p>
                             <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
                                {a.status === 'resolving' && <RefreshCw size={10} className="animate-spin" />}
                                {a.status === 'resolving' ? 'AI Auto-Resolving...' : 'Detected'}
                             </div>
                          </div>
                       </div>
                    ))}
                    {anomalies.length === 0 && (
                       <div className="text-center py-8 text-gray-400 text-sm">No anomalies detected.</div>
                    )}
                 </div>
              </div>

              {/* Self-Healing Actions */}
              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-indigo-600 dark:text-indigo-400"/> Auto-Adjustments
                 </h3>
                 <div className="space-y-4">
                    {autoActions.map((action, idx) => (
                      <div key={action.id} className="flex gap-3">
                         <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                               {idx + 1}
                            </div>
                            {idx < autoActions.length - 1 && (
                              <div className="absolute top-8 left-4 w-0.5 h-6 bg-indigo-100 dark:bg-indigo-900/30"></div>
                            )}
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{action.action}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{action.target}</p>
                            <span className="text-[10px] text-indigo-500 font-mono mt-1 block flex items-center gap-1">
                               {action.timestamp} • <CheckCircle2 size={10} /> {action.outcome}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
                 <Button size="sm" variant="secondary" className="w-full mt-6 text-xs dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                    View Adjustment Log <ArrowRight size={12} className="ml-1"/>
                 </Button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};