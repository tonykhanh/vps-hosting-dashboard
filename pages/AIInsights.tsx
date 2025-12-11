import React, { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, ShieldAlert, Zap, 
  ArrowRight, CheckCircle2, AlertTriangle, 
  BrainCircuit, Layers, Clock, Lock
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

// Merged Data for better chart rendering
const CHART_DATA = [
  { time: '00:00', traffic: 2400, prediction: 2400 },
  { time: '04:00', traffic: 1398, prediction: 1398 },
  { time: '08:00', traffic: 3800, prediction: 3800 },
  { time: '12:00', traffic: 3908, prediction: 3908 },
  { time: '16:00', traffic: 4800, prediction: 4800 },
  { time: '20:00', traffic: 3800, prediction: 3800 },
  { time: '23:59', traffic: 4300, prediction: 4300 },
  { time: '04:00 (+1)', traffic: null, prediction: 5100 },
  { time: '08:00 (+1)', traffic: null, prediction: 6800 }, // Spike
  { time: '12:00 (+1)', traffic: null, prediction: 7200 },
  { time: '16:00 (+1)', traffic: null, prediction: 6400 },
];

interface Recommendation {
  id: string;
  type: 'critical' | 'warning' | 'optimization';
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  status: 'pending' | 'executing' | 'resolved';
  icon: any;
}

export const AIInsights: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'rec-1',
      type: 'warning',
      title: 'Traffic Spike Predicted',
      description: 'AI forecasts a 60% traffic increase in 12 hours due to seasonal patterns.',
      impact: 'High Latency Risk',
      actionLabel: 'Auto-Scale to 4 Nodes',
      status: 'pending',
      icon: TrendingUp
    },
    {
      id: 'rec-2',
      type: 'critical',
      title: 'Security Vulnerability Detected',
      description: 'CVE-2024-XYZ affects your current Nginx version. Immediate patch available.',
      impact: 'Security Risk',
      actionLabel: 'Deploy Security Patch',
      status: 'pending',
      icon: Lock
    },
    {
      id: 'rec-3',
      type: 'optimization',
      title: 'Unoptimized Database Queries',
      description: 'Detected 3 slow queries consuming 40% of DB CPU during peak hours.',
      impact: 'Performance Cost',
      actionLabel: 'Apply Indexing Fix',
      status: 'pending',
      icon: Layers
    }
  ]);

  const [aiHealthScore, setAiHealthScore] = useState(82);

  const handleExecute = (id: string) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, status: 'executing' } : rec
    ));

    // Simulate AI Action Execution
    setTimeout(() => {
      setRecommendations(prev => prev.map(rec => 
        rec.id === id ? { ...rec, status: 'resolved' } : rec
      ));
      setAiHealthScore(prev => Math.min(100, prev + 5)); // Improve score
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
             <BrainCircuit className="text-plasma-600" size={32} />
             AI Insights & Recommendations
           </h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1">
             Autonomous analysis engine is <span className="text-green-600 dark:text-green-400 font-medium">Active</span>.
           </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Health Score */}
        <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={64} />
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">System Optimization Score</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-5xl font-bold ${aiHealthScore > 90 ? 'text-green-500' : 'text-plasma-600'} transition-all duration-500`}>
              {aiHealthScore}
            </span>
            <span className="text-xl text-gray-400">/100</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Top 15% of infrastructure efficiency in your region.
          </p>
          <div className="w-full bg-gray-200 dark:bg-neutral-700 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-plasma-500 h-full transition-all duration-1000 ease-out" style={{ width: `${aiHealthScore}%` }}></div>
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
             <ShieldAlert size={16} className="text-amber-500" /> Detected Anomalies
           </h3>
           <div className="mt-4 space-y-3">
             <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
               <span className="text-sm font-medium text-red-800 dark:text-red-300">Unusual Outbound Traffic</span>
               <span className="text-xs bg-white dark:bg-neutral-800 px-2 py-1 rounded text-red-600 font-bold">CRITICAL</span>
             </div>
             <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
               <span className="text-sm font-medium text-amber-800 dark:text-amber-300">High API Latency (95th)</span>
               <span className="text-xs bg-white dark:bg-neutral-800 px-2 py-1 rounded text-amber-600 font-bold">WARN</span>
             </div>
           </div>
        </div>

        {/* Benchmark */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-black dark:to-neutral-900 rounded-3xl p-6 shadow-xl text-white">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
             <TrendingUp size={16} /> Performance Benchmark
           </h3>
           <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Your Response Time</span>
                  <span className="text-neon-mint font-bold">45ms</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full">
                   <div className="bg-neon-mint h-full rounded-full w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Industry Average</span>
                  <span className="text-gray-300">120ms</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full">
                   <div className="bg-gray-400 h-full rounded-full w-[40%]"></div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Grid: Forecasting & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Traffic Forecasting */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">Traffic Forecasting</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">AI projection based on 30-day historical models.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                   <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-plasma-500"></span> Actual</div>
                   <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-400 opacity-50 border border-dashed border-indigo-600"></span> AI Prediction</div>
                </div>
              </div>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <pattern id="patternPrediction" patternUnits="userSpaceOnUse" width="4" height="4">
                         <path d="M 0 4 L 4 0" stroke="#818cf8" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-neutral-700" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                    />
                    
                    {/* Traffic Area (Actual) */}
                    <Area 
                      type="monotone" 
                      dataKey="traffic" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fill="url(#colorTraffic)" 
                    />
                    
                    {/* Prediction Area (Forecast) */}
                    <Area 
                      type="monotone" 
                      dataKey="prediction" 
                      stroke="#818cf8" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      fill="url(#patternPrediction)" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Resolved Actions Log (Mini) */}
           <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Recently Automated Actions</h4>
              <div className="space-y-2">
                 <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Scaled DB Read Replicas (2 -> 3)</span>
                    <span className="text-xs text-gray-400 ml-auto flex items-center gap-1"><Clock size={10}/> 2h ago</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Purged CDN Cache (High Latency Detected)</span>
                    <span className="text-xs text-gray-400 ml-auto flex items-center gap-1"><Clock size={10}/> 5h ago</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Col: Recommendations Engine */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Actionable Insights</h3>
              <div className="bg-plasma-100 dark:bg-plasma-900/30 text-plasma-600 dark:text-plasma-400 px-2 py-1 rounded text-xs font-bold">
                 {recommendations.filter(r => r.status === 'pending').length} Pending
              </div>
           </div>

           {recommendations.map((rec) => (
             <div 
               key={rec.id}
               className={`
                 relative bg-white dark:bg-neutral-800 rounded-2xl p-5 border shadow-sm transition-all duration-300
                 ${rec.status === 'resolved' ? 'opacity-50 grayscale border-gray-100 dark:border-neutral-700' : 'border-gray-200 dark:border-neutral-700 hover:shadow-md hover:border-plasma-200 dark:hover:border-plasma-500/30'}
                 ${rec.type === 'critical' && rec.status === 'pending' ? 'ring-1 ring-red-100 dark:ring-red-900/30 bg-red-50/30 dark:bg-red-900/10' : ''}
               `}
             >
               {rec.status === 'resolved' && (
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-neutral-800/60 backdrop-blur-[1px] rounded-2xl">
                    <span className="flex items-center gap-2 text-green-600 font-bold bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-sm border border-green-100 dark:border-green-800">
                      <CheckCircle2 size={16} /> Resolved
                    </span>
                 </div>
               )}

               <div className="flex items-start gap-4 mb-3">
                  <div className={`
                    p-2.5 rounded-xl shrink-0
                    ${rec.type === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : rec.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}
                  `}>
                    <rec.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{rec.title}</h4>
                    <span className={`text-xs font-bold mt-1 inline-block ${rec.type === 'critical' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                       Impact: {rec.impact}
                    </span>
                  </div>
               </div>
               
               <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                 {rec.description}
               </p>

               <Button 
                 variant={rec.type === 'critical' ? 'danger' : 'primary'}
                 className="w-full justify-between group"
                 isLoading={rec.status === 'executing'}
                 disabled={rec.status !== 'pending'}
                 onClick={() => handleExecute(rec.id)}
               >
                 <span>{rec.actionLabel}</span>
                 <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
               </Button>
             </div>
           ))}

           {/* Empty State / All Clear */}
           {recommendations.every(r => r.status === 'resolved') && (
              <div className="p-8 text-center bg-green-50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-800 border-dashed">
                 <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} />
                 </div>
                 <h4 className="text-green-800 dark:text-green-300 font-bold">All Clear!</h4>
                 <p className="text-green-600 dark:text-green-400 text-xs">System is running optimally.</p>
              </div>
           )}
        </div>

      </div>
    </div>
  );
};