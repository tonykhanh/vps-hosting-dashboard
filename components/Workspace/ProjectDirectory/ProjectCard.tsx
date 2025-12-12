
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
  // Updated text colors for better contrast in light mode
  const statusText = isRunning ? 'text-emerald-700 dark:text-emerald-400' : isStopped ? 'text-gray-600 dark:text-gray-400' : 'text-amber-700 dark:text-amber-400';
  const accentColor = isRunning ? 'bg-emerald-500' : isStopped ? 'bg-gray-500 dark:bg-gray-600' : 'bg-amber-500';

  // Metrics (Mocked if empty for visual consistency with design)
  const cpuVal = project.metrics?.cpu?.[project.metrics.cpu.length - 1]?.value || 0;
  const ramVal = project.metrics?.memory?.[project.metrics.memory.length - 1]?.value || 0;

  return (
    <div 
      onClick={() => navigate(`/console/projects/${project.id}`)}
      className="group relative flex flex-col bg-white dark:bg-[#0f0f0f] hover:border-plasma-300 dark:hover:border-white/10 hover:shadow-xl dark:hover:bg-[#141414] rounded-[1.5rem] border border-gray-200 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden min-h-[260px]"
      onMouseLeave={() => setActiveDropdown(false)}
    >
       {/* Top Accent Line */}
       <div className={`h-1.5 w-full ${accentColor} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>

       <div className="p-6 flex flex-col h-full justify-between">
           
           {/* Header */}
           <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                 {/* Icon Box */}
                 <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-200 shadow-inner">
                    {project.blueprint === 'WORDPRESS' ? <Box size={26} strokeWidth={1.5} /> : <Server size={26} strokeWidth={1.5} />}
                 </div>
                 
                 {/* Title & Domain */}
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-1">
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
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                 >
                    <MoreVertical size={18} />
                 </button>
                 
                 {activeDropdown && (
                    <div className="absolute right-0 top-10 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEdit(project, e); }} 
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                           Edit Configuration
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(project.id, e); }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                           Delete Capsule
                        </button>
                    </div>
                 )}
              </div>
           </div>

           {/* Metrics Block (The inner container) */}
           <div className="mt-6 bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-gray-100 dark:border-white/5 grid grid-cols-1 gap-3">
              <div>
                 <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                    <span>CPU Load</span>
                    <span className={isRunning ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}>{isRunning ? Math.round(cpuVal) : 0}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isRunning ? 'bg-plasma-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-gray-400 dark:bg-gray-600'}`} 
                        style={{ width: `${isRunning ? Math.max(5, cpuVal) : 0}%` }}
                    />
                 </div>
              </div>
              
              <div>
                 <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                    <span>RAM Usage</span>
                    <span className={isRunning ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}>{isRunning ? Math.round(ramVal) : 0}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isRunning ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-400 dark:bg-gray-600'}`} 
                        style={{ width: `${isRunning ? Math.max(5, ramVal) : 0}%` }}
                    />
                 </div>
              </div>
           </div>

           {/* Footer */}
           <div className="mt-6 flex items-center justify-between">
              <div className={`px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] flex items-center gap-2 ${statusText}`}>
                 <div className={`w-2 h-2 rounded-full ${statusColor} ${isRunning ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`}></div>
                 <span className="text-xs font-bold capitalize">{project.status.toLowerCase()}</span>
              </div>

              <button className="text-sm font-bold text-plasma-600 dark:text-plasma-500 hover:text-plasma-700 dark:hover:text-plasma-400 flex items-center gap-1 transition-colors group-hover:translate-x-1 duration-300">
                 Manage <ArrowRight size={14} />
              </button>
           </div>
       </div>
    </div>
  );
};
