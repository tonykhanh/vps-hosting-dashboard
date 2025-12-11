import React, { useState } from 'react';
import { 
  Gauge, Zap, TrendingUp, Server, Database, 
  ArrowRight, CheckCircle2, Sliders, AlertTriangle,
  Clock, Activity, Loader2, Sparkles, MoveRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

// Mock Data for Performance Forecasting
const generatePerformanceData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const isForecast = i > 18;
    data.push({
      time: `${i}:00`,
      usage: isForecast ? null : 40 + Math.random() * 20,
      forecast: isForecast ? 60 + (i - 18) * 5 : null,
      limit: 90
    });
  }
  return data;
};

interface Optimization {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'db' | 'app' | 'network';
  status: 'pending' | 'optimizing' | 'completed';
}

export const Performance: React.FC = () => {
  const [data] = useState(generatePerformanceData());
  const [isAutoTuning, setIsAutoTuning] = useState(false);
  
  // Tuning Parameters
  const [maxWorkers, setMaxWorkers] = useState(4);
  const [cacheSize, setCacheSize] = useState(256);
  const [requestTimeout, setRequestTimeout] = useState(30);

  const [optimizations, setOptimizations] = useState<Optimization[]>([
    {
      id: 'opt-1',
      title: 'Enable Redis Object Caching',
      description: 'Reduce DB load by caching frequent queries. Est. 40% latency drop.',
      impact: 'high',
      type: 'db',
      status: 'pending'
    },
    {
      id: 'opt-2',
      title: 'Optimize Nginx Gzip Compression',
      description: 'Compress static assets to reduce bandwidth usage.',
      impact: 'medium',
      type: 'network',
      status: 'pending'
    }
  ]);

  const handleOptimize = (id: string) => {
    setOptimizations(prev => prev.map(opt => 
      opt.id === id ? { ...opt, status: 'optimizing' } : opt
    ));

    setTimeout(() => {
      setOptimizations(prev => prev.map(opt => 
        opt.id === id ? { ...opt, status: 'completed' } : opt
      ));
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Gauge className="text-plasma-600" size={32} />
            Performance & Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Application tuning, predictive forecasting, and automated optimization.
          </p>
        </div>
        
        {/* Auto-Tune Toggle */}
        <div 
          onClick={() => setIsAutoTuning(!isAutoTuning)}
          className={`
            cursor-pointer px-4 py-2 rounded-full border flex items-center gap-3 transition-all duration-300 select-none w-full md:w-auto justify-between md:justify-start
            ${isAutoTuning ? 'bg-indigo-600 border-indigo-500 text-white shadow-neon' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700'}
          `}
        >
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider">AI Auto-Tuning</span>
            <span className="text-[10px] opacity-80">{isAutoTuning ? 'Active' : 'Disabled'}</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${isAutoTuning ? 'bg-white/30' : 'bg-gray-200 dark:bg-neutral-600'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAutoTuning ? 'translate-x-5' : 'translate-x-1'}`}></div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Response Time', value: '124ms', sub: '-12% vs yesterday', icon: Clock, color: 'text-indigo-600' },
          { label: 'Throughput', value: '4.2k rpm', sub: 'Requests per minute', icon: Activity, color: 'text-green-600' },
          { label: 'Error Rate', value: '0.04%', sub: 'Within SLA', icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'Apdex Score', value: '0.98', sub: 'Excellent', icon: TrendingUp, color: 'text-plasma-600' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass flex items-center gap-4 hover:-translate-y-1 transition-transform">
             <div className={`p-3 rounded-2xl bg-white dark:bg-neutral-700 shadow-sm ${kpi.color}`}>
               <kpi.icon size={24} />
             </div>
             <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{kpi.label}</p>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{kpi.sub}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart: Resource Forecasting */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-8 shadow-glass">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resource Usage Forecast</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400">Predictive analysis for CPU & Memory saturation.</p>
             </div>
             <div className="flex gap-4 text-xs font-medium">
               <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-plasma-500"></span> Actual</div>
               <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-400 opacity-50 border border-dashed border-indigo-600"></span> Predicted</div>
             </div>
           </div>

           <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                 <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <pattern id="patternForecast" patternUnits="userSpaceOnUse" width="4" height="4">
                        <path d="M 0 4 L 4 0" stroke="#818cf8" strokeWidth="1" />
                    </pattern>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-neutral-700" />
                 <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                 <Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#1e293b', borderColor: '#374151', color: '#f3f4f6' }} />
                 {/* Dark Mode Safe Red */}
                 <ReferenceLine y={90} label={{ value: "Saturation Limit", fill: '#ef4444' }} stroke="#ef4444" strokeDasharray="3 3" />
                 
                 <Area type="monotone" dataKey="usage" stroke="#3b82f6" fill="url(#colorUsage)" strokeWidth={3} />
                 <Area type="monotone" dataKey="forecast" stroke="#818cf8" fill="url(#patternForecast)" strokeWidth={3} strokeDasharray="5 5" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
           
           <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl flex items-start gap-3">
              <Sparkles className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">AI Insight</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  Usage is projected to hit 90% saturation at 22:00. Recommendation: Enable auto-scaling or increase max workers before peak load.
                </p>
              </div>
           </div>
        </div>

        {/* Right Col: Optimization Opportunities */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Optimization Opportunities</h3>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">
                 {optimizations.filter(o => o.status === 'pending').length} Available
              </div>
           </div>

           {optimizations.map((opt) => (
             <div key={opt.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                {opt.status === 'completed' && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 z-10 flex items-center justify-center">
                    <span className="flex items-center gap-2 text-green-600 font-bold bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-sm border border-green-100 dark:border-green-800 animate-in zoom-in">
                       <CheckCircle2 size={16} /> Optimized
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                   <div className={`p-2 rounded-lg ${opt.type === 'db' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                      {opt.type === 'db' ? <Database size={18} /> : <Server size={18} />}
                   </div>
                   <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                      opt.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                   }`}>
                      {opt.impact} Impact
                   </span>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white">{opt.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">{opt.description}</p>
                
                <Button 
                   size="sm" 
                   className="w-full text-xs dark:bg-neutral-700 dark:text-white" 
                   variant="secondary"
                   onClick={() => handleOptimize(opt.id)}
                   isLoading={opt.status === 'optimizing'}
                   disabled={opt.status !== 'pending'}
                >
                   {opt.status === 'optimizing' ? 'Applying Fix...' : 'Apply Optimization'}
                </Button>
             </div>
           ))}

           {/* Manual Tuning Panel */}
           <div className={`bg-neutral-900 dark:bg-black rounded-3xl p-6 text-white shadow-xl transition-all duration-500 ${isAutoTuning ? 'opacity-75 grayscale' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                    <Sliders size={16} /> Manual Tuning
                 </h3>
                 {isAutoTuning && <span className="text-xs text-indigo-400 font-bold flex items-center gap-1"><Sparkles size={12}/> AI Controlled</span>}
              </div>

              <div className="space-y-4 pointer-events-auto">
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-gray-400">Max Worker Threads</span>
                       <span className="font-mono">{maxWorkers}</span>
                    </div>
                    <input 
                      type="range" min="1" max="16" step="1" 
                      value={maxWorkers}
                      onChange={(e) => !isAutoTuning && setMaxWorkers(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-plasma-500 disabled:accent-gray-500"
                      disabled={isAutoTuning}
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-gray-400">Cache Size (MB)</span>
                       <span className="font-mono">{cacheSize}MB</span>
                    </div>
                    <input 
                      type="range" min="64" max="1024" step="64" 
                      value={cacheSize}
                      onChange={(e) => !isAutoTuning && setCacheSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-plasma-500 disabled:accent-gray-500"
                      disabled={isAutoTuning}
                    />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-gray-400">Request Timeout (s)</span>
                       <span className="font-mono">{requestTimeout}s</span>
                    </div>
                    <input 
                      type="range" min="5" max="60" step="5" 
                      value={requestTimeout}
                      onChange={(e) => !isAutoTuning && setRequestTimeout(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-plasma-500 disabled:accent-gray-500"
                      disabled={isAutoTuning}
                    />
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};