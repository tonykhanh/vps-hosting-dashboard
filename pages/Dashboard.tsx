
import React, { useState } from 'react';
import { useNavigate } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { IntentConsole } from '../components/Workspace/IntentConsole';
import { ActiveCapsuleGrid } from '../components/Workspace/ActiveCapsuleGrid';
import { Box } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [intent, setIntent] = useState('');
  const [isMorphing, setIsMorphing] = useState(false);

  // Filter projects for the "Capsule Workspace" (removing the placeholder 'p-new' if it exists in mock)
  const activeProjects = projects.filter(p => p.id !== 'p-new');

  const triggerMorphTransition = () => {
    setIsMorphing(true);
    // Simulate "Graph Compilation" before navigation
    setTimeout(() => {
      navigate('/console/projects/p-new');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      
      {/* 1. INTENT CONSOLE (Center Stage) */}
      <div className="relative z-30 mb-8">
        <IntentConsole 
          intent={intent} 
          setIntent={setIntent} 
          isMorphing={isMorphing} 
          onTrigger={triggerMorphTransition} 
        />
      </div>

      {/* Morphing Feedback Overlay */}
      {isMorphing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-plasma-500 blur-[120px] opacity-30 animate-pulse"></div>
            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in duration-700">
               <div className="relative">
                 <div className="absolute inset-0 bg-plasma-500 blur-xl opacity-50 animate-pulse"></div>
                 <div className="w-24 h-24 bg-gradient-to-tr from-plasma-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-neon animate-spin relative z-10">
                   <Box size={40} />
                 </div>
               </div>
               <div className="text-center">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Compiling Action Graph...</h3>
                 <p className="text-gray-500 dark:text-gray-400 mt-2 font-mono text-sm">Allocating Resources • Syncing State</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CAPSULE WORKSPACE (Spatial Grid) */}
      {/* Increased mt-20 to ensure visual separation from the banner */}
      <div className="flex-1 mt-20">
        <ActiveCapsuleGrid 
          projects={activeProjects} 
          isVisible={!intent && !isMorphing} 
          onCreateClick={() => navigate('/console/create')} 
        />
      </div>
    </div>
  );
};
