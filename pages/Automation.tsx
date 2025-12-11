import React, { useState, useEffect } from 'react';
import { 
  GitMerge, Play, Pause, Plus, MoreHorizontal, 
  Clock, CheckCircle2, AlertCircle, RefreshCw, 
  Zap, Bell, Database, Server, ArrowRight,
  Loader2, Trash2, Save, Sparkles, FileText,
  Activity, XCircle, Settings, Shield, BarChart3,
  GripVertical
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Types
interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'notification';
  label: string;
  icon: any;
  config: string;
}

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'running' | 'error';
  lastRun: string;
  successRate: number;
  avgDuration: string;
  steps: WorkflowStep[];
  executionLog?: {
    stepId: string;
    status: 'pending' | 'running' | 'success' | 'error' | 'retrying';
    progress?: number;
  }[];
}

interface AutoCorrection {
  id: string;
  workflowId: string;
  workflowName: string;
  issue: string;
  action: string;
  timestamp: string;
}

// Mock Data
const MOCK_PERFORMANCE_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  executions: Math.floor(Math.random() * 50) + 10,
  errors: Math.floor(Math.random() * 5)
}));

export const Automation: React.FC = () => {
  // State
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-1',
      name: 'Auto-Deploy on Git Push',
      status: 'active',
      lastRun: '2 hours ago',
      successRate: 98,
      avgDuration: '45s',
      steps: [
        { id: 's-1', type: 'trigger', label: 'Git Push (Main)', icon: GitMerge, config: 'Branch: main' },
        { id: 's-2', type: 'action', label: 'Run Tests', icon:  CheckCircle2, config: 'npm test' },
        { id: 's-3', type: 'action', label: 'Deploy to Prod', icon: Server, config: 'Target: VPS-1' },
        { id: 's-4', type: 'notification', label: 'Slack Alert', icon: Bell, config: '#deployments' },
      ]
    },
    {
      id: 'wf-2',
      name: 'Daily DB Backup & Prune',
      status: 'active',
      lastRun: '10 hours ago',
      successRate: 100,
      avgDuration: '2m 10s',
      steps: [
        { id: 's-1', type: 'trigger', label: 'Schedule', icon: Clock, config: 'Every 24h @ 00:00' },
        { id: 's-2', type: 'action', label: 'Dump Database', icon: Database, config: 'pg_dump' },
        { id: 's-3', type: 'action', label: 'Upload to S3', icon:  Server, config: 'Bucket: backup-prod' },
        { id: 's-4', type: 'action', label: 'Prune Old', icon: Trash2, config: 'Older than 7d' },
      ]
    },
    {
      id: 'wf-3',
      name: 'Incident Response',
      status: 'active',
      lastRun: '1 day ago',
      successRate: 92,
      avgDuration: '15s',
      steps: [
        { id: 's-1', type: 'trigger', label: 'Alert Trigger', icon: AlertCircle, config: 'Severity: Critical' },
        { id: 's-2', type: 'action', label: 'Scale Up', icon: Server, config: '+2 Nodes' },
        { id: 's-3', type: 'notification', label: 'Page On-Call', icon:  Bell, config: 'PagerDuty' },
      ]
    }
  ]);

  const [corrections, setCorrections] = useState<AutoCorrection[]>([
    { id: 'c-1', workflowId: 'wf-1', workflowName: 'Auto-Deploy', issue: 'Timeout during NPM Install', action: 'Auto-Retried (Attempt 2)', timestamp: '2h ago' },
    { id: 'c-2', workflowId: 'wf-2', workflowName: 'DB Backup', issue: 'S3 Connection Reset', action: 'Switched to Fallback Region', timestamp: 'Yesterday' }
  ]);

  const [activeBuilder, setActiveBuilder] = useState<boolean>(false);
  const [builderSteps, setBuilderSteps] = useState<WorkflowStep[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Simulation Logic
  const handleRunWorkflow = (id: string) => {
    const wfIndex = workflows.findIndex(w => w.id === id);
    if (wfIndex === -1) return;

    const updatedWorkflows = [...workflows];
    updatedWorkflows[wfIndex].status = 'running';
    updatedWorkflows[wfIndex].executionLog = updatedWorkflows[wfIndex].steps.map(s => ({ stepId: s.id, status: 'pending', progress: 0 }));
    setWorkflows(updatedWorkflows);

    let stepIdx = 0;
    const interval = setInterval(() => {
      setWorkflows(prev => {
        const next = [...prev];
        const wf = next[wfIndex];
        
        if (!wf.executionLog) return next;

        // Update previous step to success
        if (stepIdx > 0 && stepIdx <= wf.executionLog.length) {
           wf.executionLog[stepIdx - 1].status = 'success';
           wf.executionLog[stepIdx - 1].progress = 100;
        }

        // Update current step to running
        if (stepIdx < wf.executionLog.length) {
            wf.executionLog[stepIdx].status = 'running';
            wf.executionLog[stepIdx].progress = 50; // Visual progress
        }
        
        return next;
      });

      stepIdx++;
      if (stepIdx > updatedWorkflows[wfIndex].steps.length) {
        clearInterval(interval);
        setTimeout(() => {
           setWorkflows(prev => {
             const next = [...prev];
             next[wfIndex].status = 'active';
             next[wfIndex].lastRun = 'Just now';
             next[wfIndex].executionLog = undefined;
             return next;
           });
        }, 1000);
      }
    }, 1200);
  };

  const addToBuilder = (type: WorkflowStep['type'], label: string, icon: any) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      label,
      icon,
      config: 'Configure...'
    };
    setBuilderSteps([...builderSteps, newStep]);
  };

  const loadRecommendation = (rec: any) => {
    setBuilderSteps([
       { id: '1', type: 'trigger', label: 'Monitor Alert', icon: AlertCircle, config: 'CPU > 80%' },
       { id: '2', type: 'action', label: 'Scale Up', icon:  Server, config: '+1 Node' },
       { id: '3', type: 'notification', label: 'Notify Admin', icon: Bell, config: 'Email' },
    ]);
    setActiveBuilder(true);
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, type: WorkflowStep['type'], label: string) => {
    e.dataTransfer.setData('stepType', type);
    e.dataTransfer.setData('stepLabel', label);
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const type = e.dataTransfer.getData('stepType') as WorkflowStep['type'];
    const label = e.dataTransfer.getData('stepLabel');
    
    if (type && label) {
        // Map label back to icon
        let icon = GitMerge;
        if (label === 'Webhook') icon = GitMerge;
        else if (label === 'Schedule') icon = Clock;
        else if (label === 'Alert') icon = AlertCircle;
        else if (label === 'Deploy') icon = RefreshCw;
        else if (label === 'Scale') icon = Server;
        else if (label === 'Notify') icon = Bell;

        addToBuilder(type, label, icon);
    }
  };

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <GitMerge className="text-plasma-600" size={32} />
            Task Automation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Build, schedule, and self-healing intelligent workflows.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <Button variant="secondary" className="flex-1 md:flex-none dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
              <Activity size={16} className="mr-2"/> Logs
           </Button>
           <Button className="flex-1 md:flex-none" onClick={() => { setBuilderSteps([]); setActiveBuilder(true); }}>
              <Plus size={18} className="mr-2" /> New Workflow
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
               <Zap size={24} />
            </div>
            <div>
               <div className="text-2xl font-bold text-gray-900 dark:text-white">24.5k</div>
               <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Tasks Automations</div>
            </div>
         </div>
         <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
               <Clock size={24} />
            </div>
            <div>
               <div className="text-2xl font-bold text-gray-900 dark:text-white">120h</div>
               <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Time Saved (Mo)</div>
            </div>
         </div>
         <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
               <Shield size={24} />
            </div>
            <div>
               <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
               <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Success Rate</div>
            </div>
         </div>
         
         {/* Live Activity Chart */}
         <div className="bg-neutral-900 dark:bg-black p-4 rounded-3xl border border-neutral-800 shadow-lg relative overflow-hidden h-32 md:h-auto">
            <div className="absolute top-4 left-4 z-10">
               <div className="text-xs font-bold text-gray-400 uppercase">Live Activity</div>
               <div className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Running
               </div>
            </div>
            <div className="h-full w-full pt-6">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_PERFORMANCE_DATA}>
                     <defs>
                        <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Tooltip contentStyle={{background: '#333', border: 'none', color: '#fff', fontSize: '12px'}} />
                     <Area type="monotone" dataKey="executions" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAct)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-300px)]">
        
        {/* Left Column: Active Workflows & Monitoring */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2 pb-20 custom-scrollbar">
           
           <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Play size={20} className="text-plasma-600"/> Active Workflows
           </h3>

           <div className="grid grid-cols-1 gap-4">
              {workflows.map(wf => (
                <div key={wf.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                   
                   {/* Header Row */}
                   <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 md:gap-0">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-2xl ${
                            wf.status === 'running' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'
                         }`}>
                            {wf.status === 'running' ? <Loader2 size={24} className="animate-spin" /> : <GitMerge size={24} />}
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{wf.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                               <span className="flex items-center gap-1"><Clock size={12} /> {wf.lastRun}</span>
                               <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> {wf.successRate}% Success</span>
                               <span>Avg: {wf.avgDuration}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full md:w-auto">
                         <Button 
                           size="sm" 
                           variant="secondary" 
                           className="text-xs dark:bg-neutral-700 dark:text-white flex-1 md:flex-none"
                           disabled={wf.status === 'running'}
                           onClick={() => handleRunWorkflow(wf.id)}
                         >
                            {wf.status === 'running' ? 'Running...' : 'Run Now'}
                         </Button>
                         <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                            <Settings size={18} />
                         </button>
                      </div>
                   </div>

                   {/* Step Visualization Pipeline */}
                   <div className="relative pt-4 pb-2 px-2 overflow-x-auto">
                      {/* Progress Line Background */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-neutral-700 -z-10 rounded-full"></div>
                      
                      {/* Active Progress Line */}
                      {wf.status === 'running' && (
                         <div className="absolute top-1/2 left-0 h-1 bg-plasma-500 -z-10 rounded-full transition-all duration-500" style={{
                            width: `${(wf.executionLog?.filter(s => s.status === 'success').length || 0) / wf.steps.length * 100}%`
                         }}></div>
                      )}

                      <div className="flex justify-between items-center relative min-w-[300px]">
                         {wf.steps.map((step, idx) => {
                           const log = wf.executionLog?.[idx];
                           const status = log?.status || 'idle';
                           const isRunning = status === 'running';
                           const isSuccess = status === 'success';
                           const isPending = status === 'pending';

                           return (
                             <div key={step.id} className="flex flex-col items-center gap-2 relative group/step">
                                <div className={`
                                   w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 bg-white dark:bg-neutral-800
                                   ${isSuccess ? 'border-green-500 text-green-500' : 
                                     isRunning ? 'border-plasma-500 text-plasma-500 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                                     'border-gray-200 dark:border-neutral-600 text-gray-300 dark:text-gray-600'}
                                `}>
                                   {isSuccess ? <CheckCircle2 size={18} /> : 
                                    isRunning ? <Loader2 size={18} className="animate-spin" /> : 
                                    <step.icon size={16} />}
                                </div>
                                <span className={`text-[10px] font-bold absolute -bottom-6 w-24 text-center transition-colors ${
                                   isRunning || isSuccess ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                                }`}>
                                   {step.label}
                                </span>
                             </div>
                           );
                         })}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Column: AI Suggestions & Corrections */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Self-Healing Logs */}
           <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <Sparkles size={18} className="text-plasma-600"/> AI Auto-Corrections
              </h3>
              <div className="space-y-4">
                 {corrections.map(c => (
                    <div key={c.id} className="p-3 bg-plasma-50 dark:bg-neutral-800 border border-plasma-100 dark:border-neutral-700 rounded-2xl">
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-plasma-700 dark:text-plasma-400 uppercase bg-white dark:bg-plasma-950/50 px-2 py-0.5 rounded shadow-sm">
                             {c.workflowName}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{c.timestamp}</span>
                       </div>
                       <div className="mt-2 text-sm text-gray-900 dark:text-white font-medium flex items-center gap-2">
                          <XCircle size={14} className="text-red-500 shrink-0" /> <span className="line-clamp-1">{c.issue}</span>
                       </div>
                       <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-2 pl-5 font-medium">
                          <ArrowRight size={12} /> {c.action}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Suggestions */}
           <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-black dark:to-neutral-900 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <Zap size={18} className="text-amber-400" /> Automation Opportunities
              </h3>
              <div className="space-y-4">
                 <div className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="font-bold text-sm mb-1">Backup Retention Policy</h4>
                    <p className="text-xs text-gray-300 mb-3">
                       Storage costs increasing. Automate pruning of backups older than 30 days.
                    </p>
                    <Button size="sm" className="w-full bg-white text-black hover:bg-gray-100 border-none h-7 text-xs dark:bg-white dark:text-black dark:hover:bg-gray-200">
                       Create Workflow
                    </Button>
                 </div>
                 <div className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="font-bold text-sm mb-1">Staging Environment Cleanup</h4>
                    <p className="text-xs text-gray-300 mb-3">
                       Detect idle staging VPS and shut them down after 18:00 daily.
                    </p>
                    <Button size="sm" className="w-full bg-white text-black hover:bg-gray-100 border-none h-7 text-xs dark:bg-white dark:text-black dark:hover:bg-gray-200">
                       Create Workflow
                    </Button>
                 </div>
              </div>
           </div>

        </div>

      </div>

      {/* Builder Modal */}
      {activeBuilder && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-5xl h-full md:h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95">
              
              {/* Builder UI Header */}
              <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800 shrink-0">
                 <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <GitMerge size={20} className="text-plasma-600"/> Workflow Builder
                 </h2>
                 <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setActiveBuilder(false)} className="dark:bg-neutral-700 dark:text-white">Cancel</Button>
                    <Button onClick={() => setActiveBuilder(false)} className="gap-2"><Save size={16}/> Save</Button>
                 </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
                 {/* Sidebar Tools - Hidden on small mobile or stacked */}
                 <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900 overflow-y-auto shrink-0 max-h-[30vh] md:max-h-none">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Triggers</h3>
                    <div className="space-y-2 mb-6">
                       <button 
                         onClick={() => addToBuilder('trigger', 'Webhook', GitMerge)}
                         draggable="true" 
                         onDragStart={(e) => handleDragStart(e, 'trigger', 'Webhook')}
                         className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-neutral-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-grab active:cursor-grabbing transition-colors group"
                       >
                          <GitMerge size={16} className="text-amber-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-700 dark:group-hover:text-amber-300">Webhook</span>
                       </button>
                       <button 
                         onClick={() => addToBuilder('trigger', 'Schedule', Clock)}
                         draggable="true" 
                         onDragStart={(e) => handleDragStart(e, 'trigger', 'Schedule')}
                         className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-neutral-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-grab active:cursor-grabbing transition-colors group"
                       >
                          <Clock size={16} className="text-amber-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-700 dark:group-hover:text-amber-300">Schedule</span>
                       </button>
                       <button 
                         onClick={() => addToBuilder('trigger', 'Alert', AlertCircle)}
                         draggable="true" 
                         onDragStart={(e) => handleDragStart(e, 'trigger', 'Alert')}
                         className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-neutral-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-grab active:cursor-grabbing transition-colors group"
                       >
                          <AlertCircle size={16} className="text-amber-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-700 dark:group-hover:text-amber-300">Alert</span>
                       </button>
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Actions</h3>
                    <div className="space-y-2">
                       <button 
                         onClick={() => addToBuilder('action', 'Deploy', RefreshCw)}
                         draggable="true" 
                         onDragStart={(e) => handleDragStart(e, 'action', 'Deploy')}
                         className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-neutral-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-grab active:cursor-grabbing transition-colors group"
                       >
                          <RefreshCw size={16} className="text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">Deploy</span>
                       </button>
                       <button 
                         onClick={() => addToBuilder('action', 'Scale', Server)}
                         draggable="true" 
                         onDragStart={(e) => handleDragStart(e, 'action', 'Scale')}
                         className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-neutral-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-grab active:cursor-grabbing transition-colors group"
                       >
                          <Server size={16} className="text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">Scale</span>
                       </button>
                       <button 
                         onClick={() => addToBuilder('notification', 'Notify', Bell)}
                         draggable="true" 
                         onDragStart={(e) => handleDragStart(e, 'notification', 'Notify')}
                         className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-neutral-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-grab active:cursor-grabbing transition-colors group"
                       >
                          <Bell size={16} className="text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">Notify</span>
                       </button>
                    </div>
                 </div>

                 {/* Drop Zone / Canvas */}
                 <div 
                    className={`flex-1 bg-gray-50/50 dark:bg-black/20 p-8 overflow-y-auto relative transition-colors ${isDragging ? 'bg-plasma-50/30 dark:bg-plasma-900/10' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                 >
                    <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-50"></div>
                    
                    {builderSteps.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-3xl m-4 transition-all p-4 text-center">
                          <Zap size={48} className={`mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 text-plasma-500 animate-pulse' : 'opacity-20'}`} />
                          <p>{isDragging ? 'Drop here to start workflow' : 'Drag items from sidebar or tap to add'}</p>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center gap-4 max-w-lg mx-auto pb-10">
                          {builderSteps.map((step, index) => (
                             <React.Fragment key={step.id}>
                                <div className="w-full bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 relative group hover:border-plasma-400 transition-colors animate-in slide-in-from-bottom-2 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="cursor-move text-gray-300 hover:text-gray-500"><GripVertical size={16} /></div>
                                      <div className={`p-2 rounded-lg ${
                                         step.type === 'trigger' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                         step.type === 'action' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'
                                      }`}>
                                         <step.icon size={18} />
                                      </div>
                                      <div>
                                         <div className="font-bold text-sm text-gray-900 dark:text-white">{step.label}</div>
                                         <div className="text-xs text-gray-500 font-mono">{step.config}</div>
                                      </div>
                                   </div>
                                   <button 
                                     onClick={() => setBuilderSteps(builderSteps.filter(s => s.id !== step.id))}
                                     className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                   >
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                                
                                {index < builderSteps.length - 1 && (
                                   <div className="h-6 w-0.5 bg-gray-300 dark:bg-neutral-700"></div>
                                )}
                             </React.Fragment>
                          ))}
                          
                          <div className={`h-12 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-neutral-700 ${isDragging ? 'border-plasma-400 h-24' : ''} transition-all`}></div>
                          <div className={`text-xs text-gray-400 font-medium ${isDragging ? 'text-plasma-500 animate-bounce' : ''}`}>
                             {isDragging ? 'Drop next step' : 'End of workflow'}
                          </div>
                       </div>
                    )}
                 </div>
              </div>

           </div>
        </div>
      )}

    </div>
  );
};