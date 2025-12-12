
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { ActionFlow, ActionType } from '../components/ActionFlow';
import { Button } from '../components/Button';
import { 
  ArrowLeft, AlertOctagon, Box
} from 'lucide-react';
import { ProjectStatus } from '../types';

import { PrimaryControl } from '../components/Workspace/ProjectHub/PrimaryControl';
import { ComputeSatellite } from '../components/Workspace/ProjectHub/ComputeSatellite';
import { StorageSatellite } from '../components/Workspace/ProjectHub/StorageSatellite';
import { DeploymentSatellite } from '../components/Workspace/ProjectHub/DeploymentSatellite';
import { ObservabilitySatellite } from '../components/Workspace/ProjectHub/ObservabilitySatellite';

// Decorative Component for background lines
const ConnectionLines = () => (
  <div className="absolute inset-0 pointer-events-none hidden lg:block z-0 opacity-20 dark:opacity-20">
    <svg className="w-full h-full">
      <defs>
        <linearGradient id="line-grad-left" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="var(--color-plasma-500, #3b82f6)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-plasma-500, #3b82f6)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="line-grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-plasma-500, #3b82f6)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-plasma-500, #3b82f6)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Curving lines connecting roughly center to satellites */}
      <path d="M 50% 50% C 40% 50%, 30% 25%, 16% 25%" stroke="url(#line-grad-left)" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      <path d="M 50% 50% C 40% 50%, 30% 75%, 16% 75%" stroke="url(#line-grad-left)" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      <path d="M 50% 50% C 60% 50%, 70% 25%, 84% 25%" stroke="url(#line-grad-right)" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      <path d="M 50% 50% C 60% 50%, 70% 75%, 84% 75%" stroke="url(#line-grad-right)" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      
      {/* Center Pulse Circle */}
      <circle cx="50%" cy="50%" r="50" fill="var(--color-plasma-500, #3b82f6)" opacity="0.05" className="animate-pulse" />
    </svg>
  </div>
);

export const ProjectCapsule: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, updateProject } = useProjects();
  
  // Get project from context
  const project = id ? getProject(id) : undefined;
  
  const [activeCapsule, setActiveCapsule] = useState<string | null>(null);
  const [actionFlowType, setActionFlowType] = useState<ActionType>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);

  useEffect(() => {
    if (project?.status === 'PROVISIONING' || project?.status === 'BUILDING') {
      setIsProvisioning(true);
    } else {
      setIsProvisioning(false);
    }
  }, [project?.status]);

  const handleAction = (type: ActionType) => {
    if (!project) return;
    setActionFlowType(type);
  };

  const handleActionStart = () => {
    if (!project) return;
    if (actionFlowType === 'DEPLOY' || actionFlowType === 'REBOOT' || actionFlowType === 'SCALE' || actionFlowType === 'ROLLBACK') {
       updateProject(project.id, { status: ProjectStatus.BUILDING });
    }
  };

  const handleActionComplete = () => {
    if (!project || !actionFlowType) return;

    if (actionFlowType === 'DEPLOY' || actionFlowType === 'START' || actionFlowType === 'REBOOT' || actionFlowType === 'SCALE' || actionFlowType === 'ROLLBACK') {
        updateProject(project.id, { status: ProjectStatus.RUNNING });
    } else if (actionFlowType === 'STOP') {
        updateProject(project.id, { status: ProjectStatus.STOPPED });
    }

    setActionFlowType(null);
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

  // Spatial Layout
  return (
    <div className="relative min-h-[calc(100vh-100px)] w-full flex flex-col justify-center overflow-hidden">
      
      {/* Background & Lines */}
      <ConnectionLines />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-plasma-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Action Flow Overlay */}
      <ActionFlow 
        isOpen={!!actionFlowType} 
        type={actionFlowType} 
        onClose={handleCloseAction}
        onStart={handleActionStart}
        onComplete={handleActionComplete}
        projectName={project.name}
      />

      {/* Navigation Breadcrumb (Minimal) */}
      <div className={`absolute top-0 left-0 z-40 transition-opacity duration-300 ${actionFlowType ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={() => navigate('/console/projects')} 
          className="flex items-center gap-2 text-gray-500 hover:text-plasma-600 dark:text-gray-400 dark:hover:text-plasma-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-md"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Directory</span>
        </button>
      </div>

      {/* The Spatial Grid */}
      <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-16 items-center p-4 lg:p-10 max-w-[1600px] mx-auto w-full transition-all duration-500 ${actionFlowType ? 'scale-95 opacity-50 blur-[2px]' : 'scale-100 opacity-100'}`}>
        
        {/* Left Column Satellites */}
        <div className="space-y-8 flex flex-col justify-center order-2 lg:order-1 h-full lg:py-20">
          <ComputeSatellite 
            isProvisioning={isProvisioning} 
            isActive={activeCapsule === 'vps'} 
            onClick={() => setActiveCapsule(activeCapsule === 'vps' ? null : 'vps')}
            onAction={handleAction}
          />
          <StorageSatellite 
            isProvisioning={isProvisioning} 
            isActive={activeCapsule === 'db'} 
            onClick={() => setActiveCapsule(activeCapsule === 'db' ? null : 'db')}
          />
        </div>

        {/* Center: The Project Hub */}
        <div className="order-1 lg:order-2 flex justify-center">
           <PrimaryControl 
             project={project} 
             isProvisioning={isProvisioning} 
             onAction={handleAction} 
           />
        </div>

        {/* Right Column Satellites */}
        <div className="space-y-8 flex flex-col justify-center order-3 h-full lg:py-20">
           <DeploymentSatellite 
             isProvisioning={isProvisioning} 
             isActive={activeCapsule === 'deploy'} 
             onClick={() => setActiveCapsule(activeCapsule === 'deploy' ? null : 'deploy')}
             onAction={handleAction}
           />
           <ObservabilitySatellite 
             isProvisioning={isProvisioning} 
             isActive={activeCapsule === 'obs'} 
             onClick={() => setActiveCapsule(activeCapsule === 'obs' ? null : 'obs')}
             metrics={project.metrics.network}
           />
        </div>

      </div>
    </div>
  );
};
