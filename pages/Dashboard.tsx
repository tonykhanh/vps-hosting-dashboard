
import React, { useState, useEffect } from 'react';
import { useNavigate } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { Badge } from '../components/Badge';
import { ArrowRight, Sparkles, Zap, Command, Search, Server, Globe, Activity, Loader2, Plus, Box } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [intent, setIntent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);

  // Filter projects for the "Capsule Workspace" - Exclude the placeholder 'p-new' if it exists in initial mock
  // In a real app, 'p-new' usually serves as a "Create" card in lists, but here we just want actual projects.
  const activeProjects = projects.filter(p => p.id !== 'p-new');

  useEffect(() => {
    if (intent.length > 5) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [intent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && intent) {
      triggerMorphTransition();
    }
  };

  const triggerMorphTransition = () => {
    setIsMorphing(true);
    // Simulate "Graph Compilation" before navigation
    setTimeout(() => {
      // For demo purposes, route to create new project if intent is typed
      navigate('/console/create'); 
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      
      {/* 1. INTENT CONSOLE (Center Stage) */}
      <div className={`flex flex-col items-center transition-all duration-700 ease-elastic z-30 ${intent || isFocused ? 'mt-8 md:mt-16' : 'mt-[12vh] md:mt-[18vh]'} ${isMorphing ? 'scale-110 opacity-0 translate-y-10 blur-sm' : ''}`}>
        
        {/* Greeting / Prompt */}
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-8 text-center tracking-tight transition-all duration-500 ${intent || isFocused ? 'opacity-40 scale-90 translate-y-[-20px]' : 'opacity-100'}`}>
          What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-plasma-500 via-indigo-400 to-plasma-500 bg-[length:200%_auto] animate-shimmer text-glow">manifest</span>?
        </h1>

        {/* The Intent Bar */}
        <div className={`relative w-full max-w-3xl transition-all duration-500 group ${isFocused ? 'scale-105' : 'scale-100'}`}>
          {/* Holographic Glow */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-plasma-500 via-neon-purple to-plasma-500 rounded-2xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-500 ${isFocused ? 'opacity-70' : ''}`}></div>
          
          <div className="relative bg-white/80 dark:bg-black/70 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-spatial rounded-2xl flex items-center p-2 transition-all group-hover:border-plasma-500/30">
            <div className="pl-4 text-plasma-500">
              {intent ? <Sparkles size={24} className="animate-pulse" /> : <Command size={24} className="opacity-50" />}
            </div>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Describe infrastructure intent (e.g. 'Production Cluster in SG with Redis')..."
              className="w-full bg-transparent border-none outline-none focus:outline-none text-xl md:text-2xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600/70 focus:ring-0 px-4 py-4 leading-relaxed font-light font-sans tracking-wide"
              disabled={isMorphing}
              // autoFocus removed per request
            />
            <button 
              onClick={triggerMorphTransition}
              className={`p-4 rounded-xl transition-all duration-300 ${intent ? 'bg-plasma-600 text-white shadow-neon scale-100' : 'bg-transparent text-gray-400 scale-90 opacity-0 pointer-events-none'}`}
            >
              {isMorphing ? <Loader2 size={24} className="animate-spin"/> : <ArrowRight size={24} />}
            </button>
          </div>

          {/* AI Blueprint Preview (The "Graph" Preview) */}
          {showPreview && !isMorphing && (
            <div className="absolute top-full left-0 w-full mt-4 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Box size={12} /> Detected Intent Blueprint
                  </span>
                  <span className="text-xs text-plasma-500 font-mono bg-plasma-500/10 px-2 py-1 rounded">CONFIDENCE: 98%</span>
               </div>
               <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                     <Server size={16} className="text-neon-purple"/>
                     <span>3x High-Freq Nodes</span>
                  </div>
                  <div className="h-px w-8 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                     <Activity size={16} className="text-neon-mint"/>
                     <span>Auto-Scaling</span>
                  </div>
                  <div className="h-px w-8 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                     <Globe size={16} className="text-plasma-500"/>
                     <span>Global CDN</span>
                  </div>
               </div>
               <div className="mt-4 text-center">
                  <span className="text-xs text-gray-400">Press <strong className="text-white">Enter</strong> to materialize this graph.</span>
               </div>
            </div>
          )}
        </div>
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
      <div className={`mt-20 px-4 md:px-0 transition-all duration-1000 delay-200 ${intent || isFocused || isMorphing ? 'opacity-0 translate-y-40 pointer-events-none blur-md' : 'opacity-100'}`}>
        
        <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
             <Box size={16}/> Active Capsules
          </h2>
          <div className="h-px bg-gray-200 dark:bg-white/10 flex-1 ml-6 mr-6"></div>
          <span className="text-xs text-gray-500 font-mono flex items-center gap-2">
            SYSTEM_HEALTH 
            <span className="text-neon-mint">98%</span>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20 px-6">
          {activeProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => navigate(`/console/projects/${project.id}`)}
              className="group relative h-64 bg-white/40 dark:bg-neutral-900/30 backdrop-blur-md border border-white/60 dark:border-white/5 rounded-[2rem] p-8 shadow-glass hover:shadow-spatial-card hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Internal Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-plasma-500/0 via-plasma-500/0 to-plasma-500/5 group-hover:to-plasma-500/20 transition-colors duration-700"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm group-hover:bg-plasma-600 group-hover:text-white transition-colors duration-500 group-hover:shadow-neon">
                       <Server size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight group-hover:text-plasma-600 dark:group-hover:text-plasma-400 transition-colors">{project.name}</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono uppercase tracking-wider flex items-center gap-1">
                        {project.region} <span className="w-1 h-1 rounded-full bg-gray-500"></span> {project.blueprint}
                      </div>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${project.status === 'RUNNING' ? 'bg-neon-mint shadow-neon-mint' : 'bg-gray-500'}`}></div>
                </div>

                {/* Spatial Data Viz (Abstract) */}
                <div className="flex items-end gap-1 h-12 w-full opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                   {project.metrics.cpu.slice(0, 15).map((m, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gray-400 dark:bg-white/20 rounded-t-sm transition-all duration-500 group-hover:bg-plasma-500" 
                        style={{ height: `${Math.max(10, m.value)}%` }}
                      ></div>
                   ))}
                </div>

                <div className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                     <Globe size={14} /> {project.domain}
                  </div>
                  <span className="group-hover:translate-x-2 transition-transform duration-300 text-plasma-600 dark:text-plasma-400">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* "Add New" Spatial Placeholder */}
          <div 
            onClick={() => navigate('/console/create')}
            className="group h-64 rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-plasma-400 dark:hover:border-plasma-500/50 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-plasma-600 dark:hover:text-plasma-400 hover:bg-plasma-50/50 dark:hover:bg-plasma-900/10 transition-all cursor-pointer hover:shadow-inner"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-plasma-100 dark:group-hover:bg-plasma-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-90">
              <Plus size={32} />
            </div>
            <span className="font-bold tracking-wide">Initialize New Capsule</span>
          </div>
        </div>
      </div>
    </div>
  );
};
