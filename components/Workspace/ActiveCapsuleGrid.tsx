
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from '../../context/ThemeContext';
import { useProjects } from '../../context/ProjectContext';
import { Project, ProjectStatus } from '../../types';
import { Box, Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import { ProjectCard } from './ProjectDirectory/ProjectCard';
import { Button } from '../Button';

interface ActiveCapsuleGridProps {
  projects: Project[];
  isVisible: boolean;
  onCreateClick: () => void;
}

export const ActiveCapsuleGrid: React.FC<ActiveCapsuleGridProps> = ({ projects, isVisible, onCreateClick }) => {
  const navigate = useNavigate();
  const { updateProject, deleteProject } = useProjects();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    navigate(`/console/projects/${project.id}`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
        deleteProject(deletingId);
        setDeletingId(null);
    }
  };

  const handleUpdateStatus = (id: string, status: ProjectStatus) => {
    updateProject(id, { status });
  };

  return (
    <>
      <div className={`relative z-10 w-full transition-all duration-1000 delay-100 ease-out ${!isVisible ? 'opacity-0 translate-y-20 pointer-events-none blur-sm' : 'opacity-100'}`}>
          
        <div className="flex items-center justify-between mb-8 max-w-[1800px] mx-auto px-4 md:px-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <Box size={14}/> Active Capsules
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent flex-1 mx-4 md:mx-8 opacity-50 dark:opacity-30"></div>
          <span className="text-xs text-gray-500 font-mono tracking-widest hidden sm:inline">
              SYSTEM_HEALTH <span className="text-emerald-500">98%</span>
          </span>
        </div>
        
        {/* Expanded Grid Layout - Responsive breakpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-[1800px] mx-auto pb-32 px-4 md:px-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
          
          {/* "Add New" Spatial Placeholder */}
          <div 
            onClick={onCreateClick}
            className="group relative min-h-[260px] rounded-[1.5rem] border-2 border-dashed bg-gray-50 border-gray-300 hover:bg-plasma-50 hover:border-plasma-500 hover:shadow-xl hover:shadow-plasma-500/10 dark:bg-[#0f0f0f] dark:border-white/10 dark:hover:border-plasma-500/50 dark:hover:bg-[#141414] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 group-hover:border-plasma-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-plasma-500/20 dark:bg-white/5 dark:border-white/10 dark:group-hover:border-plasma-500/30 flex items-center justify-center transition-all duration-300">
              <Plus size={24} className="text-gray-400 group-hover:text-plasma-600 transition-colors" />
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-500 group-hover:text-plasma-700 dark:text-gray-400 dark:group-hover:text-white text-lg transition-colors">Initialize New Capsule</h3>
              <p className="text-xs text-gray-400 group-hover:text-plasma-600/70 dark:text-gray-600 dark:group-hover:text-gray-500 mt-2 font-mono">
                Deploy from Blueprint
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (Portal) */}
      {deletingId && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
           {/* Backdrop - High z-index, handles clicks to dismiss */}
           <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity cursor-pointer" onClick={() => setDeletingId(null)} />
           
           {/* Modal Content - Higher z-index, no pointer events on backdrop */}
           <div className="relative bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 flex flex-col z-10" onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl shadow-inner">
                       <Trash2 size={32} />
                    </div>
                    <button
                       onClick={() => setDeletingId(null)}
                       className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                       <X size={20} />
                    </button>
                 </div>

                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Delete Capsule</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Target: <span className="font-semibold text-gray-700 dark:text-gray-300">{projects.find(p => p.id === deletingId)?.name}</span>
                 </p>
              </div>

              {/* Content */}
              <div className="p-8">
                 <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex gap-4 items-start">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg shrink-0">
                       <AlertTriangle size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-red-900 dark:text-red-400 text-sm mb-1">Irreversible Action</h4>
                       <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                          This action will permanently destroy the capsule, including all attached volumes, backups, and network configurations. Data cannot be recovered.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-neutral-900/50 flex justify-end gap-3">
                 <Button variant="secondary" onClick={() => setDeletingId(null)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button variant="danger" onClick={confirmDelete} className="shadow-lg shadow-red-500/20">Delete Permanently</Button>
              </div>
           </div>
        </div>,
        document.body
      )}
    </>
  );
};
