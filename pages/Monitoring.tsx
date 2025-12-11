import React, { useState, useEffect } from 'react';
import { MetricCard } from '../components/MetricCard';
import { HealthScore } from '../components/HealthScore';
import { MetricPoint } from '../types';
import { 
  Cpu, HardDrive, Network, Server, 
  AlertTriangle, X, CheckCircle2, Sparkles, Activity
} from 'lucide-react';
import { Button } from '../components/Button';

// Initial Mock Data Generator
const generateInitialData = (base: number, variance: number): MetricPoint[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i.toString(),
    value: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance))
  }));
};

export const Monitoring: React.FC = () => {
  // State for metrics
  const [cpuData, setCpuData] = useState<MetricPoint[]>(generateInitialData(30, 15));
  const [ramData, setRamData] = useState<MetricPoint[]>(generateInitialData(45, 5));
  const [netData, setNetData] = useState<MetricPoint[]>(generateInitialData(15, 20));
  const [storageData, setStorageData] = useState<MetricPoint[]>(generateInitialData(60, 2)); // Stable but growing
  
  const [healthScore, setHealthScore] = useState(98);
  const [activeAlert, setActiveAlert] = useState<{id: string, type: 'warning'|'critical', msg: string, action: string} | null>(null);

  // Real-time Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      
      // Update CPU (Random spikes)
      setCpuData(prev => {
        const last = prev[prev.length - 1].value;
        const next = Math.max(10, Math.min(95, last + (Math.random() - 0.5) * 20));
        return [...prev.slice(1), { time: now, value: next }];
      });

      // Update RAM (Slow creep)
      setRamData(prev => {
        const last = prev[prev.length - 1].value;
        const next = Math.max(20, Math.min(90, last + (Math.random() - 0.4) * 2));
        return [...prev.slice(1), { time: now, value: next }];
      });

      // Update Net (Bursty)
      setNetData(prev => {
        const burst = Math.random() > 0.9 ? 50 : 0;
        const base = 10 + Math.random() * 10;
        return [...prev.slice(1), { time: now, value: base + burst }];
      });

      // Simulate Health Score Fluctuations
      setHealthScore(prev => {
        // Drop score randomly to simulate minor issues, recover slowly
        const change = Math.random() > 0.8 ? -2 : 1;
        return Math.min(100, Math.max(75, prev + change));
      });

    }, 2000);

    // AI Predictive Alert Simulator (Once after 5s)
    const alertTimeout = setTimeout(() => {
       setActiveAlert({
         id: 'alert-1',
         type: 'warning',
         msg: 'Storage volume /var/log projected to fill in 12 hours.',
         action: 'Auto-expand Volume'
       });
       setHealthScore(85); // Drop health when alert triggers
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(alertTimeout);
    };
  }, []);

  const handleResolveAlert = () => {
    setActiveAlert(null);
    setHealthScore(98); // Restore health
  };

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Resource Monitoring</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time infrastructure metrics and utilization.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 shadow-sm">
           <Activity size={16} className="text-green-500 animate-pulse" />
           <span className="text-gray-600 dark:text-gray-300">Live Stream Active</span>
        </div>
      </div>

      {/* Top Section: Health Score & Aggregates */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Radial Health Gauge */}
        <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass flex items-center justify-center lg:col-span-1">
           <HealthScore score={healthScore} />
        </div>

        {/* Global Stats Panels */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-white/60 dark:bg-neutral-800/60 rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-glass flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                 <Server size={20} /> <span className="text-xs font-bold uppercase">Active Nodes</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">12<span className="text-gray-400 text-lg">/12</span></div>
              <div className="w-full bg-gray-200 dark:bg-neutral-700 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-green-500 h-full w-full"></div>
              </div>
           </div>
           
           <div className="bg-white/60 dark:bg-neutral-800/60 rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-glass flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                 <Activity size={20} /> <span className="text-xs font-bold uppercase">Error Rate</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">0.02%</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                 <CheckCircle2 size={12} /> Within SLA
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-500 to-plasma-600 rounded-3xl p-6 border border-transparent shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={48} /></div>
              <div className="flex items-center gap-3 text-white/80 mb-2">
                 <Sparkles size={20} /> <span className="text-xs font-bold uppercase">AI Insight</span>
              </div>
              <p className="text-sm leading-relaxed font-medium">
                Traffic patterns indicate a potential 3x spike at 18:00 UTC. Auto-scaling policy is ready.
              </p>
           </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* CPU Card */}
        <div className="md:col-span-2">
          <MetricCard
            title="Total CPU Usage"
            value={`${Math.round(cpuData[cpuData.length-1].value)}%`}
            unit=""
            data={cpuData}
            icon={<Cpu size={20} />}
            color="#3b82f6"
            status={cpuData[cpuData.length-1].value > 80 ? 'critical' : cpuData[cpuData.length-1].value > 60 ? 'warning' : 'healthy'}
            trend="stable"
          />
        </div>

        {/* Memory Card */}
        <div className="md:col-span-1">
          <MetricCard
            title="Memory Load"
            value={`${Math.round(ramData[ramData.length-1].value)}%`}
            unit=""
            data={ramData}
            icon={<HardDrive size={20} />}
            color="#8b5cf6"
            trend="up"
          />
        </div>

         {/* Network Card */}
         <div className="md:col-span-1">
          <MetricCard
            title="Network I/O"
            value={`${Math.round(netData[netData.length-1].value)}`}
            unit="MB/s"
            data={netData}
            icon={<Network size={20} />}
            color="#10b981"
            trend="stable"
            prediction="Spike exp."
          />
        </div>
        
        {/* Storage Prediction Card */}
        <div className="md:col-span-2">
          <MetricCard
             title="Volume Usage (/data)"
             value="68%"
             unit=""
             data={storageData}
             icon={<Server size={20} />}
             color="#f59e0b"
             status={activeAlert ? 'warning' : 'healthy'}
             prediction={activeAlert ? "Full in 12h" : undefined}
          />
        </div>

      </div>

      {/* Predictive Alert Bubble (Toast) */}
      {activeAlert && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500 w-[90%] max-w-lg">
           <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-2xl border border-amber-200 dark:border-amber-700 flex items-start gap-4 ring-4 ring-amber-50 dark:ring-amber-900/30">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                 <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 dark:text-white">Predictive Warning</h4>
                    <button onClick={() => setActiveAlert(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={16}/></button>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">{activeAlert.msg}</p>
                 <div className="flex gap-2">
                    <Button size="sm" onClick={handleResolveAlert} className="bg-amber-500 hover:bg-amber-600 border-none">
                       {activeAlert.action}
                    </Button>
                    <Button size="sm" variant="secondary" className="dark:bg-neutral-700 dark:text-white" onClick={() => setActiveAlert(null)}>
                       Dismiss
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};