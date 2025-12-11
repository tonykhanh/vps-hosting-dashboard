import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Loader2, XCircle, 
  ArrowRight, ShieldCheck, AlertTriangle, 
  Cpu, Server, RefreshCw, Undo2, X 
} from 'lucide-react';
import { Button } from './Button';

export type ActionType = 'DEPLOY' | 'REBOOT' | 'SCALE' | 'ROLLBACK' | null;

interface ActionFlowProps {
  isOpen: boolean;
  type: ActionType;
  onClose: () => void;
  projectName: string;
}

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  detail?: string;
}

const ACTION_CONFIGS: Record<string, { title: string, icon: any, steps: Step[] }> = {
  DEPLOY: {
    title: "Rolling Deployment",
    icon: RefreshCw,
    steps: [
      { id: '1', label: 'Context Validation', status: 'pending', detail: 'Verifying environment variables' },
      { id: '2', label: 'Build Artifact', status: 'pending', detail: 'Compiling assets & containers' },
      { id: '3', label: 'Health Check', status: 'pending', detail: 'Probing liveness endpoints' },
      { id: '4', label: 'Traffic Switch', status: 'pending', detail: 'Routing 100% traffic to new nodes' },
    ]
  },
  REBOOT: {
    title: "System Reboot",
    icon: Server,
    steps: [
      { id: '1', label: 'Drain Connections', status: 'pending', detail: 'Waiting for active requests' },
      { id: '2', label: 'Stop Services', status: 'pending', detail: 'Graceful shutdown' },
      { id: '3', label: 'Kernel Restart', status: 'pending', detail: 'Booting kernel 6.5.0' },
      { id: '4', label: 'Verify Upstate', status: 'pending', detail: 'Checking service availability' },
    ]
  },
  SCALE: {
    title: "Vertical Scaling",
    icon: Cpu,
    steps: [
      { id: '1', label: 'Snapshot State', status: 'pending', detail: 'Creating restore point' },
      { id: '2', label: 'Provision Resources', status: 'pending', detail: 'Allocating 4 vCPU / 8GB RAM' },
      { id: '3', label: 'Migration', status: 'pending', detail: 'Moving volume attachment' },
      { id: '4', label: 'Optimization', status: 'pending', detail: 'Tuning kernel parameters' },
    ]
  },
  ROLLBACK: {
    title: "Emergency Rollback",
    icon: Undo2,
    steps: [
      { id: '1', label: 'Identify Last Stable', status: 'pending', detail: 'Commit #af392b' },
      { id: '2', label: 'Revert Database', status: 'pending', detail: 'Restoring schema state' },
      { id: '3', label: 'Switch Pointer', status: 'pending', detail: 'Pointing HEAD to previous' },
      { id: '4', label: 'Purge Cache', status: 'pending', detail: 'Clearing CDN edge cache' },
    ]
  }
};

export const ActionFlow: React.FC<ActionFlowProps> = ({ isOpen, type, onClose, projectName }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [flowState, setFlowState] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [simulationInterval, setSimulationInterval] = useState<number | null>(null);

  useEffect(() => {
    if (type && ACTION_CONFIGS[type]) {
      setSteps(ACTION_CONFIGS[type].steps.map(s => ({ ...s }))); // Deep copy
      setCurrentStepIndex(0);
      setFlowState('idle');
    }
  }, [type, isOpen]);

  // Simulate the flow
  const startFlow = () => {
    setFlowState('running');
    let idx = 0;
    
    // Set first step to running immediately
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[0].status = 'running';
      return newSteps;
    });

    const interval = window.setInterval(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        // Complete current step
        newSteps[idx].status = 'completed';
        
        // Start next step if exists
        if (idx + 1 < newSteps.length) {
          newSteps[idx + 1].status = 'running';
        }
        return newSteps;
      });

      idx++;
      setCurrentStepIndex(idx);

      if (idx >= steps.length) {
        clearInterval(interval);
        setFlowState('completed');
      }
    }, 1500); // 1.5s per step for demo

    setSimulationInterval(interval);
  };

  const cancelFlow = () => {
    if (simulationInterval) clearInterval(simulationInterval);
    onClose();
  };

  if (!isOpen || !type) return null;

  const config = ACTION_CONFIGS[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div className="relative w-full md:max-w-lg h-full bg-white/90 dark:bg-neutral-900/95 backdrop-blur-2xl border-l border-white/50 dark:border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header - Action Card */}
        <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-plasma-100 dark:bg-plasma-900/30 text-plasma-600 dark:text-plasma-400 rounded-xl shadow-inner">
              <Icon size={32} />
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{config.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
            Target: <span className="font-semibold text-gray-700 dark:text-gray-300">{projectName}</span>
          </p>

          {/* Action Status Badge */}
          <div className={`mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            flowState === 'idle' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800' :
            flowState === 'running' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800' :
            flowState === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800' :
            'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300'
          }`}>
             {flowState === 'idle' && <AlertTriangle size={12} />}
             {flowState === 'running' && <Loader2 size={12} className="animate-spin" />}
             {flowState === 'completed' && <ShieldCheck size={12} />}
             <span className="uppercase tracking-wide">
               {flowState === 'idle' ? 'Ready to Start' : flowState}
             </span>
          </div>
        </div>

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute left-11 top-10 bottom-10 w-0.5 bg-gray-100 dark:bg-neutral-800"></div>
          
          <div className="space-y-8 relative">
            {steps.map((step, index) => {
              const isActive = step.status === 'running';
              const isCompleted = step.status === 'completed';
              const isPending = step.status === 'pending';

              return (
                <div key={step.id} className="flex gap-4 group">
                  {/* Step Icon */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                      isActive ? 'bg-white dark:bg-neutral-900 border-plasma-500 text-plasma-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                      'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-300 dark:text-neutral-600'}
                  `}>
                    {isCompleted ? <CheckCircle2 size={16} /> : 
                     isActive ? <Loader2 size={16} className="animate-spin" /> : 
                     <Circle size={12} />}
                  </div>

                  {/* Step Content */}
                  <div className={`flex-1 transition-all duration-300 ${isPending ? 'opacity-50 blur-[0.5px]' : 'opacity-100'}`}>
                    <h4 className={`text-sm font-bold ${isActive ? 'text-plasma-600 dark:text-plasma-400' : isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                      {step.detail}
                    </p>
                    
                    {isActive && (
                      <div className="mt-2 text-xs text-plasma-500 flex items-center gap-1 animate-pulse">
                        Processing <span className="tracking-widest">...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Control Panel Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-neutral-900">
          {flowState === 'idle' && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700">
                Cancel
              </Button>
              <Button onClick={startFlow} className="flex-[2] shadow-lg shadow-plasma-500/20">
                Confirm & Start <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          )}

          {flowState === 'running' && (
             <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-3 text-amber-800 dark:text-amber-200 text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin" /> Action in progress...
                </span>
                <button onClick={cancelFlow} className="text-xs underline hover:text-amber-900 dark:hover:text-white">Force Cancel</button>
             </div>
          )}

          {flowState === 'completed' && (
            <div className="flex flex-col gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm text-center font-medium">
                Action Completed Successfully
              </div>
              <Button variant="secondary" onClick={onClose} className="w-full dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700">
                Close
              </Button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};