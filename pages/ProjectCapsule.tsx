
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { Capsule } from '../components/Capsule';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ActionFlow, ActionType } from '../components/ActionFlow';
import { 
  Server, Globe, Activity, GitBranch, Shield, 
  Database, RefreshCw, Power, ArrowLeft, Cloud,
  HardDrive, Sparkles, Loader2, AlertOctagon, Box
} from 'lucide-react';

// Lightweight SVG Chart Component to replace Recharts and avoid hooks errors
const SimpleMetricChart = ({ data, color = "#34d399" }: { data: any[], color?: string }) => {
  if (!data || data.length < 2) return null;

  // Calculate scales
  const values = data.map(d => d.value);
  const min = 0;
  const max = Math.max(...values, 100) * 1.2; // Add some headroom
  
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
        {/* Gradient Area */}
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${color})`} className="opacity-50" />
        
        {/* Line */}
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
      
      {/* Simple Tooltip on Hover (CSS based positioning could be added, simpler here) */}
      <div className="absolute top-0 right-0 bg-neutral-900/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Live Metrics
      </div>
    </div>
  );
};

export const ProjectCapsule: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject } = useProjects();
  
  // Get project from context instead of MOCK constants
  const project = id ? getProject(id) : undefined;
  
  const [activeCapsule, setActiveCapsule] = useState<string | null>(null);
  const [actionFlowType, setActionFlowType] = useState<ActionType>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);

  useEffect(() => {
    if (project?.status === 'PROVISIONING') {
      setIsProvisioning(true);
    }
  }, [project]);

  const handleAction = (type: ActionType) => {
    setActionFlowType(type);
  };

  const handleCloseAction = () => {
    setActionFlowType(null);
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
         <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center relative">
            <Box size={48} className="text-gray-400 dark:text-neutral-600" />
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-neutral-900 p-2 rounded-full shadow-lg">
               <AlertOctagon size={24} className="text-red-500" />
            </div>
         </div>
         <div className="max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Capsule Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
               The infrastructure unit <span className="font-mono bg-gray-100 dark:bg-neutral-800 px-1 rounded">{id}</span> could not be located in the current matrix.
            </p>
            <div className="flex justify-center gap-4">
               <Button onClick={() => navigate('/console/projects')} variant="primary" className="shadow-lg shadow-plasma-500/20">
                  <ArrowLeft size={18} className="mr-2" /> Return to Directory
               </Button>
               <Button onClick={() => navigate('/console/create')} variant="secondary" className="dark:bg-neutral-800 dark:text-white">
                  Create New Capsule
               </Button>
            </div>
         </div>
      </div>
    );
  }

  // Spatial Layout:
  // We use a CSS Grid that creates a "Hub" feel.
  // Center: Project Main Capsule
  // Surrounding: Functional Capsules
  
  return (
    <div className="relative min-h-[85vh] w-full flex flex-col">
      {/* Action Flow Overlay */}
      <ActionFlow 
        isOpen={!!actionFlowType} 
        type={actionFlowType} 
        onClose={handleCloseAction}
        projectName={project.name}
      />

      {/* Navigation Breadcrumb (Minimal) */}
      <div className={`relative md:absolute top-0 left-0 z-40 transition-opacity duration-300 mb-4 md:mb-0 ${actionFlowType ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={() => navigate('/console/projects')} 
          className="flex items-center gap-2 text-gray-500 hover:text-plasma-600 dark:text-gray-400 dark:hover:text-plasma-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-md"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Directory</span>
        </button>
      </div>

      {/* The Spatial Grid */}
      <div className={`flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center p-4 lg:p-10 max-w-7xl mx-auto transition-all duration-500 ${actionFlowType ? 'scale-95 opacity-50 blur-[2px]' : 'scale-100 opacity-100'}`}>
        
        {/* Left Column Satellites */}
        <div className="space-y-6 flex flex-col justify-center order-2 lg:order-1">
          {/* VPS Capsule */}
          <Capsule 
            title="Compute Core (VPS)" 
            type="satellite" 
            status={isProvisioning ? "warning" : "active"}
            aiInsight={isProvisioning ? "Initializing kernel..." : "Running efficiently"}
            onClick={() => setActiveCapsule(activeCapsule === 'vps' ? null : 'vps')}
            isExpanded={activeCapsule === 'vps'}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isProvisioning ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 animate-pulse' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                    {isProvisioning ? <Loader2 size={20} className="animate-spin"/> : <Server size={20} />}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Instance Type</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">High-Freq • 2 vCPU • 4GB</div>
                  </div>
                </div>
                
                {/* Status Indicator */}
                {!isProvisioning && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-500/20 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Running
                  </div>
                )}
              </div>
              
              {/* Mini Metrics */}
              {!isProvisioning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>CPU Load</span>
                    <span>24%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-plasma-500 h-1.5 rounded-full w-[24%]" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>RAM Usage</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-green-500 h-1.5 rounded-full w-[42%]" />
                  </div>
                </div>
              )}
              
              {isProvisioning && (
                <div className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                   Allocating IP address...<br/>
                   Mounting volumes...
                </div>
              )}

              {activeCapsule === 'vps' && !isProvisioning && (
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2 animate-in slide-in-from-top-2 fade-in">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex-1 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
                    onClick={(e) => { e.stopPropagation(); handleAction('REBOOT'); }}
                  >
                    Reboot
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex-1 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
                    onClick={(e) => { e.stopPropagation(); handleAction('SCALE'); }}
                  >
                    Resize
                  </Button>
                </div>
              )}
            </div>
          </Capsule>

          {/* Database Capsule */}
          <Capsule 
            title="Data Persistency" 
            type="satellite"
            status="neutral"
            onClick={() => setActiveCapsule(activeCapsule === 'db' ? null : 'db')}
            isExpanded={activeCapsule === 'db'}
          >
             <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg"><Database size={20} /></div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Storage</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">NVMe SSD • {isProvisioning ? 'Mounting...' : '34% Used'}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Shield size={12} className="text-green-500" /> Auto-backup enabled (Daily)
              </div>
          </Capsule>
        </div>

        {/* Center: The Project Sun */}
        <div className="relative z-20 transform transition-all duration-500 order-1 lg:order-2">
          <Capsule 
            title={project.name} 
            type="primary" 
            className="min-h-[400px] flex flex-col justify-between"
          >
            {/* Project Hologram Content */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                 <Badge status={project.status} />
                 {!isProvisioning && <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">v2.4.0</span>}
              </div>

              <div className="text-center py-6">
                <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-plasma-500/10 to-neon-mint/10 mb-4 ring-1 ring-plasma-200 dark:ring-plasma-500/30 relative">
                   <div className="absolute inset-0 bg-plasma-400/20 blur-xl rounded-full animate-pulse-slow"></div>
                   {isProvisioning ? (
                     <Loader2 size={48} className="text-plasma-600 dark:text-plasma-400 relative z-10 animate-spin" />
                   ) : (
                     <Globe size={48} className="text-plasma-600 dark:text-plasma-400 relative z-10" />
                   )}
                </div>
                <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">{project.domain}</h2>
                <div className="mt-2 flex justify-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-500">
                   <span className="flex items-center gap-1"><Cloud size={12}/> {project.region.toUpperCase()}</span>
                   <span className="flex items-center gap-1"><HardDrive size={12}/> {project.ip}</span>
                </div>
              </div>

              {/* AI Prediction */}
              {!isProvisioning && (
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-black dark:to-neutral-900 rounded-xl p-4 text-white relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 p-2 opacity-20"><Sparkles /></div>
                  <h4 className="text-xs text-neon-mint font-bold uppercase tracking-wider mb-1">AI Prediction</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Traffic is expected to spike by <span className="text-white font-bold">~20%</span> in the next 12 hours based on historical trends.
                  </p>
                </div>
              )}
              {isProvisioning && (
                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-blue-800 dark:text-blue-300 text-sm text-center">
                    AI is configuring your blueprint...
                 </div>
              )}
            </div>

            {/* Global Actions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button 
                variant="primary" 
                className="w-full bg-plasma-600 hover:bg-plasma-700 shadow-lg shadow-plasma-500/20"
                onClick={() => handleAction('DEPLOY')}
                disabled={isProvisioning}
              >
                <RefreshCw size={16} className="mr-2" /> Redeploy
              </Button>
              <Button 
                variant="secondary" 
                className="w-full border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:bg-transparent"
                onClick={() => handleAction('REBOOT')} // Or STOP context
                disabled={isProvisioning}
              >
                <Power size={16} className="mr-2" /> Stop
              </Button>
            </div>
          </Capsule>
        </div>

        {/* Right Column Satellites */}
        <div className="space-y-6 flex flex-col justify-center order-3">
           {/* Deployment Capsule */}
           <Capsule 
            title="Deployment Flow" 
            type="satellite" 
            status={isProvisioning ? "warning" : "active"}
            onClick={() => setActiveCapsule(activeCapsule === 'deploy' ? null : 'deploy')}
            isExpanded={activeCapsule === 'deploy'}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><GitBranch size={20} /></div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Current Build</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">{isProvisioning ? 'Building...' : 'commit #af392b'}</div>
              </div>
            </div>
            
            <div className="space-y-3">
               <div className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-white/5 rounded border border-gray-100 dark:border-white/5">
                 <span className="text-gray-500 dark:text-gray-400">Last deployed</span>
                 <span className="font-medium text-gray-700 dark:text-gray-300">{isProvisioning ? 'Never' : '2h ago'}</span>
               </div>
               {activeCapsule === 'deploy' && !isProvisioning && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                    <div className="text-xs text-gray-400 pl-1">Recent Commits</div>
                    <div className="text-xs font-mono text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer rounded">#8821a - Fix header CSS</div>
                    <div className="text-xs font-mono text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer rounded">#9912b - Update deps</div>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="w-full mt-2 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
                      onClick={(e) => { e.stopPropagation(); handleAction('ROLLBACK'); }}
                    >
                      Rollback
                    </Button>
                  </div>
               )}
            </div>
          </Capsule>

          {/* Monitoring Capsule */}
          <Capsule 
            title="Observability" 
            type="satellite"
            status={isProvisioning ? "neutral" : "active"} 
            onClick={() => setActiveCapsule(activeCapsule === 'obs' ? null : 'obs')}
            isExpanded={activeCapsule === 'obs'}
          >
             {isProvisioning ? (
               <div className="h-20 w-full flex items-center justify-center text-gray-400 text-xs italic">
                 Waiting for signals...
               </div>
             ) : (
               <div className="h-20 w-full mb-2">
                   {/* Replaced Recharts with SimpleMetricChart */}
                   <SimpleMetricChart data={project.metrics.network} color="#34d399" />
               </div>
             )}
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Activity size={16} className="text-neon-mint" />
                  {isProvisioning ? 'Initializing' : '99.9% Uptime'}
                </div>
                {activeCapsule !== 'obs' && <span className="text-xs text-gray-400">View Logs</span>}
             </div>
             {activeCapsule === 'obs' && !isProvisioning && (
               <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 animate-in slide-in-from-top-2 fade-in">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Live Alerts</span>
                    <span className="text-xs text-green-600 dark:text-green-400">All Systems Normal</span>
                 </div>
                 <Button size="sm" variant="ghost" className="w-full">Open Grafana View</Button>
               </div>
             )}
          </Capsule>
        </div>

      </div>

      {/* Ambient Background Elements specific to Capsule View */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-plasma-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
};
