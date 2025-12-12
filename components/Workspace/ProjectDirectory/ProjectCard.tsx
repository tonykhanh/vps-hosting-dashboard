
import React, { useState } from 'react';
import { useNavigate } from '../../../context/ThemeContext';
import { Project, ProjectStatus } from '../../../types';
import { 
  Server, Globe, MoreVertical, Zap, HardDrive, Cloud, 
  Power, Play, RefreshCw, Trash2, ArrowRight, Box
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onUpdateStatus }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(!activeDropdown);
  };

  // Status Configuration
  const isRunning = project.status === ProjectStatus.RUNNING;
  const isStopped = project.status === ProjectStatus.STOPPED;
  
  const statusColor = isRunning ? 'bg-emerald-500' : isStopped ? 'bg-gray-500' : 'bg-amber-500';
  const statusText = isRunning ? 'text-emerald-400' : isStopped ? 'text-gray-400' : 'text-amber-400';
  const accentColor = isRunning ? 'bg-emerald-500' : isStopped ? 'bg-gray-600' : 'bg-amber-500';

  // Metrics (Mocked if empty for visual consistency with design)
  const cpuVal = project.metrics?.cpu?.[project.metrics.cpu.length - 1]?.value || 0;
  const ramVal = project.metrics?.memory?.[project.metrics.memory.length - 1]?.value || 0;

  return (
    <div 
      onClick={() => navigate(`/console/projects/${project.id}`)}
      className="group relative flex flex-col bg-[#111] dark:bg-[#0f0f0f] hover:bg-[#161616] dark:hover:bg-[#141414] rounded-[1.5rem] border border-[#222] dark:border-white/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden min-h-[260px]"
      onMouseLeave={() => setActiveDropdown(false)}
    >
       {/* Top Accent Line */}
       <div className={`h-1.5 w-full ${accentColor} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>

       <div className="p-6 flex flex-col h-full justify-between">
           
           {/* Header */}
           <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                 {/* Icon Box */}
                 <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] dark:bg-white/5 border border-[#333] dark:border-white/10 flex items-center justify-center text-gray-200 shadow-inner">
                    {project.blueprint === 'WORDPRESS' ? <Box size={26} strokeWidth={1.5} /> : <Server size={26} strokeWidth={1.5} />}
                 </div>
                 
                 {/* Title & Domain */}
                 <div>
                    <h3 className="text-lg font-bold text-gray-100 tracking-tight leading-tight mb-1">
                       {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                       <Globe size={10} />
                       <span className="truncate max-w-[140px]">{project.domain}</span>
                    </div>
                 </div>
              </div>

              {/* Menu */}
              <div className="relative">
                 <button 
                    onClick={toggleDropdown}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                 >
                    <MoreVertical size={18} />
                 </button>
                 
                 {activeDropdown && (
                    <div className="absolute right-0 top-10 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEdit(project, e); }} 
                          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                        >
                           Edit Configuration
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(project.id, e); }}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                        >
                           Delete Capsule
                        </button>
                    </div>
                 )}
              </div>
           </div>

           {/* Metrics Block (The inner dark container) */}
           <div className="mt-6 bg-[#1a1a1a] dark:bg-white/[0.03] rounded-2xl p-4 border border-[#2a2a2a] dark:border-white/5 grid grid-cols-3 divide-x divide-[#333] dark:divide-white/10">
              <div className="flex flex-col items-center justify-center px-2">
                 <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">CPU</span>
                 <div className="flex items-center gap-1.5 text-gray-200 font-bold">
                    <Zap size={14} className={isRunning ? "text-amber-400" : "text-gray-600"} fill={isRunning ? "currentColor" : "none"} />
                    {isRunning ? Math.round(cpuVal) : 0}%
                 </div>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                 <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">RAM</span>
                 <div className="flex items-center gap-1.5 text-gray-200 font-bold">
                    <HardDrive size={14} className={isRunning ? "text-indigo-400" : "text-gray-600"} />
                    {isRunning ? Math.round(ramVal) : 0}%
                 </div>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                 <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">REGION</span>
                 <div className="flex items-center gap-1.5 text-gray-200 font-bold">
                    <Cloud size={14} className="text-blue-400" />
                    {project.region.toUpperCase()}
                 </div>
              </div>
           </div>

           {/* Footer */}
           <div className="mt-6 flex items-center justify-between">
              <div className={`px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center gap-2 ${statusText}`}>
                 <div className={`w-2 h-2 rounded-full ${statusColor} ${isRunning ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`}></div>
                 <span className="text-xs font-bold capitalize">{project.status.toLowerCase()}</span>
              </div>

              <button className="text-sm font-bold text-plasma-500 hover:text-plasma-400 flex items-center gap-1 transition-colors group-hover:translate-x-1 duration-300">
                 Manage <ArrowRight size={14} />
              </button>
           </div>
       </div>
    </div>
  );
};
