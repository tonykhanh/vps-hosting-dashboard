import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, Zap, Play, CheckCircle2, AlertTriangle, 
  Terminal, Activity, Clock, FileText, ArrowRight,
  Loader2, RefreshCw, Server, StopCircle, RotateCcw
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface TimelineEvent {
  id: string;
  time: string;
  type: 'system' | 'user' | 'ai' | 'alert';
  message: string;
  status?: 'success' | 'error' | 'info';
}

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  actionLabel: string;
}

export const Recovery: React.FC = () => {
  // State for War Room
  const [incidentTime, setIncidentTime] = useState(0); // Seconds elapsed
  const [status, setStatus] = useState<'active' | 'recovering' | 'resolved'>('active');
  
  // Mock Playbook
  const [playbook, setPlaybook] = useState<PlaybookStep[]>([
    { id: '1', title: 'Drain Connections', description: 'Stop new traffic to affected node', status: 'pending', actionLabel: 'Drain' },
    { id: '2', title: 'Restart Service', description: 'Hard restart of payment-gateway process', status: 'pending', actionLabel: 'Restart' },
    { id: '3', title: 'Verify Health', description: 'Check liveness probes', status: 'pending', actionLabel: 'Verify' },
    { id: '4', title: 'Scale Replicas', description: 'Increase capacity to handle backlog', status: 'pending', actionLabel: 'Scale' },
  ]);

  // Mock Timeline
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { id: 'e-1', time: '10:00:00', type: 'alert', message: 'CRITICAL: Payment Gateway 500 Error Rate > 10%', status: 'error' },
    { id: 'e-2', time: '10:00:02', type: 'system', message: 'Incident #INC-992 Created', status: 'info' },
    { id: 'e-3', time: '10:00:05', type: 'ai', message: 'RCA: Deadlock detected in Transaction DB Shard 3.', status: 'info' },
  ]);

  // Mock Metrics Data
  const [errorRateData, setErrorRateData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ time: i, value: i > 15 ? 15 : 0.5 }))
  );

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      if (status !== 'resolved') {
        setIncidentTime(prev => prev + 1);
      }
    }, 1000);

    // Live Metrics Simulation
    const metricTimer = setInterval(() => {
      if (status === 'resolved') {
         setErrorRateData(prev => [...prev.slice(1), { time: prev[prev.length-1].time + 1, value: 0 }]);
      } else if (status === 'recovering') {
         setErrorRateData(prev => [...prev.slice(1), { time: prev[prev.length-1].time + 1, value: Math.max(0, prev[prev.length-1].value - 2) }]);
      } else {
         // Active incident
         setErrorRateData(prev => [...prev.slice(1), { time: prev[prev.length-1].time + 1, value: 15 + Math.random() * 5 }]);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(metricTimer);
    };
  }, [status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const executeStep = (stepId: string) => {
    // Update step to running
    setPlaybook(prev => prev.map(s => s.id === stepId ? { ...s, status: 'running' } : s));
    setStatus('recovering');

    // Add log
    const step = playbook.find(s => s.id === stepId);
    setTimeline(prev => [{
      id: `e-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      type: 'user',
      message: `Executing Playbook: ${step?.title}`,
      status: 'info'
    }, ...prev]);

    // Simulate completion
    setTimeout(() => {
      setPlaybook(prev => prev.map(s => s.id === stepId ? { ...s, status: 'completed' } : s));
      setTimeline(prev => [{
        id: `e-${Date.now()}_2`,
        time: new Date().toLocaleTimeString(),
        type: 'system',
        message: `${step?.title} Completed Successfully`,
        status: 'success'
      }, ...prev]);

      // If last step
      if (stepId === '4') {
        setStatus('resolved');
        setTimeline(prev => [{
          id: `e-${Date.now()}_3`,
          time: new Date().toLocaleTimeString(),
          type: 'ai',
          message: `Incident Resolved. MTTR: ${formatTime(incidentTime)}. Generating Post-Mortem...`,
          status: 'success'
        }, ...prev]);
      }
    }, 2000);
  };

  const runFullAuto = () => {
    // Sequentially run all pending steps
    const pending = playbook.filter(s => s.status === 'pending');
    if (pending.length === 0) return;
    
    // Simplification: Just trigger the first, in real app would chain promises
    executeStep(pending[0].id);
  };

  return (
    <div className="space-y-8 pb-20 relative h-auto min-h-[calc(100vh-100px)]">
      {/* Header / War Room Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-6 rounded-3xl shadow-sm relative overflow-hidden transition-colors duration-300">
        {status === 'active' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>}
        {status === 'recovering' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse"></div>}
        {status === 'resolved' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <LifeBuoy className={status === 'resolved' ? 'text-green-500' : 'text-red-500'} size={28} />
            Incident Resolution: Payment Gateway Outage
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock size={14} /> Duration: <span className="font-mono font-bold text-gray-900 dark:text-white">{formatTime(incidentTime)}</span>
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Activity size={14} /> Impact: <span className="font-bold text-red-600 dark:text-red-400">High</span>
            </span>
          </div>
        </div>

        <div className="flex gap-3">
           {status !== 'resolved' && (
             <Button 
               className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-500/20 animate-pulse"
               onClick={runFullAuto}
             >
               <Zap size={18} className="mr-2" /> Auto-Remediate (AI)
             </Button>
           )}
           {status === 'resolved' && (
             <Button variant="secondary" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40">
               <FileText size={18} className="mr-2" /> View Post-Mortem
             </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Left Col: Timeline & Chat */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
           
           {/* Live Metrics Mini-Chart */}
           <div className="bg-neutral-900 dark:bg-black rounded-3xl p-5 text-white shadow-lg border border-neutral-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                 <Activity size={14} className="text-red-500" /> Error Rate (5xx)
              </h3>
              <div className="h-32 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={errorRateData}>
                       <defs>
                          <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis hide />
                       <YAxis hide domain={[0, 20]} />
                       <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#colorError)" strokeWidth={2} isAnimationActive={false} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="text-center mt-2 font-mono text-2xl font-bold text-red-400">
                 {Math.round(errorRateData[errorRateData.length-1].value)}%
              </div>
           </div>

           {/* Timeline Feed */}
           <div className="flex-1 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass flex flex-col overflow-hidden">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <Terminal size={16} /> Live Event Log
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                 {timeline.map((event) => (
                    <div key={event.id} className="flex gap-3 text-sm animate-in slide-in-from-left duration-300">
                       <span className="text-xs font-mono text-gray-400 dark:text-gray-500 pt-0.5">{event.time}</span>
                       <div className="flex-1">
                          <div className={`font-bold text-xs uppercase mb-0.5 ${
                             event.type === 'alert' ? 'text-red-600 dark:text-red-400' :
                             event.type === 'ai' ? 'text-purple-600 dark:text-purple-400' :
                             event.type === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                             {event.type}
                          </div>
                          <div className={`text-gray-700 dark:text-gray-300 ${event.status === 'success' ? 'text-green-700 dark:text-green-400' : ''}`}>
                             {event.message}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Center/Right: Playbook & RCA */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           
           {/* RCA Panel */}
           <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm flex gap-6 items-start">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
                 <Zap size={32} />
              </div>
              <div className="flex-1">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Root Cause Analysis</h3>
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The payment gateway service is experiencing high latency due to a <strong>database deadlock</strong> in the transaction shard. 
                    This was likely triggered by the high-concurrency batch job (ID: #9921) starting at 10:00.
                 </p>
                 <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg w-fit">
                    <CheckCircle2 size={16} /> Confidence Score: 98%
                 </div>
              </div>
           </div>

           {/* Playbook Execution */}
           <div className="flex-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recovery Playbook</h2>
                    <p className="text-gray-500 dark:text-gray-400">Recommended automated steps for DB Deadlock Recovery.</p>
                 </div>
                 <div className="text-sm text-gray-400 dark:text-gray-500 font-mono">
                    Steps Completed: {playbook.filter(s => s.status === 'completed').length}/{playbook.length}
                 </div>
              </div>

              <div className="space-y-6 relative">
                 {/* Connection Line */}
                 <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-100 dark:bg-neutral-700 -z-10"></div>

                 {playbook.map((step, index) => {
                    const isActive = step.status === 'running';
                    const isDone = step.status === 'completed';
                    const isPending = step.status === 'pending';

                    return (
                       <div key={step.id} className={`flex items-start gap-6 transition-all duration-300 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
                          {/* Step Number/Icon */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shrink-0 bg-white dark:bg-neutral-800 transition-colors duration-300 ${
                             isDone ? 'border-green-500 text-green-500' :
                             isActive ? 'border-blue-500 text-blue-500' :
                             'border-gray-200 dark:border-neutral-700 text-gray-300 dark:text-gray-600'
                          }`}>
                             {isDone ? <CheckCircle2 size={24} /> : 
                              isActive ? <Loader2 size={24} className="animate-spin" /> : 
                              <span className="font-bold text-lg">{index + 1}</span>}
                          </div>

                          {/* Content */}
                          <div className={`flex-1 p-5 rounded-2xl border transition-all duration-300 ${
                             isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md transform scale-102' : 
                             isDone ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' : 
                             'bg-white dark:bg-neutral-800 border-gray-100 dark:border-neutral-700'
                          }`}>
                             <div className="flex justify-between items-center mb-2">
                                <h3 className={`font-bold text-lg ${isDone ? 'text-green-800 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                   {step.title}
                                </h3>
                                {isDone && <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded">DONE</span>}
                             </div>
                             <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{step.description}</p>
                             
                             {!isDone && (
                                <Button 
                                   size="sm" 
                                   onClick={() => executeStep(step.id)}
                                   disabled={isActive || (index > 0 && playbook[index-1].status !== 'completed')}
                                   className={isActive ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600' : 'dark:bg-neutral-700 dark:text-white'}
                                >
                                   {isActive ? (
                                      <><Loader2 size={16} className="animate-spin mr-2"/> Executing...</>
                                   ) : (
                                      <><Play size={16} className="mr-2"/> Run {step.actionLabel}</>
                                   )}
                                </Button>
                             )}
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>

        </div>
      </div>
      
      {/* Post-Mortem Overlay (When Resolved) */}
      {status === 'resolved' && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm animate-in fade-in duration-1000">
            <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-neutral-700 text-center space-y-6">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 size={40} />
               </div>
               <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Incident Resolved Successfully</h2>
               <p className="text-gray-600 dark:text-gray-300">
                  System stability has been restored. All services are operating within normal parameters.
               </p>
               
               <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 dark:border-neutral-700">
                  <div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Downtime</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(incidentTime)}</div>
                  </div>
                  <div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Impact</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">342 Users</div>
                  </div>
                  <div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Automated Actions</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">4</div>
                  </div>
               </div>

               <div className="flex justify-center gap-4">
                  <Button onClick={() => setStatus('active')}>Simulate New Incident</Button>
                  <Button variant="secondary" className="dark:bg-neutral-700 dark:text-white" onClick={() => window.location.reload()}>Return to Dashboard</Button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};