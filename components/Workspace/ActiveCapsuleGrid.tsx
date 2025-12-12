
import React from 'react';
import { useNavigate } from '../../context/ThemeContext';
import { useProjects } from '../../context/ProjectContext';
import { Project, ProjectStatus } from '../../types';
import { Box, Plus } from 'lucide-react';
import { ProjectCard } from './ProjectDirectory/ProjectCard';

interface ActiveCapsuleGridProps {
  projects: Project[];
  isVisible: boolean;
  onCreateClick: () => void;
}

export const ActiveCapsuleGrid: React.FC<ActiveCapsuleGridProps> = ({ projects, isVisible, onCreateClick }) => {
  const navigate = useNavigate();
  const { updateProject, deleteProject } = useProjects();

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    navigate(`/console/projects/${project.id}`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    if (window.confirm('Are you sure you want to delete this capsule?')) {
        deleteProject(id);
    }
  };

  const handleUpdateStatus = (id: string, status: ProjectStatus) => {
    updateProject(id, { status });
  };

  return (
    <div className={`relative z-10 w-full transition-all duration-1000 delay-100 ease-out ${!isVisible ? 'opacity-0 translate-y-20 pointer-events-none blur-sm' : 'opacity-100'}`}>
        
      <div className="flex items-center justify-between mb-8 max-w-[1800px] mx-auto px-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <Box size={14}/> Active Capsules
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-1 mx-8 opacity-30"></div>
        <span className="text-xs text-gray-500 font-mono tracking-widest">
             SYSTEM_HEALTH <span className="text-emerald-500">98%</span>
        </span>
      </div>
      
      {/* Expanded Grid Layout - Up to 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1800px] mx-auto pb-32 px-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
        
        {/* "Add New" Spatial Placeholder - Matches the screenshot style */}
        <div 
          onClick={onCreateClick}
          className="group relative min-h-[260px] rounded-[1.5rem] border-2 border-dashed border-[#333] dark:border-white/10 hover:border-plasma-500/50 hover:bg-[#111] dark:hover:bg-white/[0.02] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-[#1c1c1c] dark:bg-white/5 border border-[#333] dark:border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-plasma-500/30 transition-all duration-300">
            <Plus size={24} className="text-gray-500 group-hover:text-plasma-500 transition-colors" />
          </div>
          
          <div className="text-center">
             <h3 className="font-bold text-gray-400 group-hover:text-white text-lg transition-colors">Initialize New Capsule</h3>
             <p className="text-xs text-gray-600 mt-2 font-mono">
               Deploy from Blueprint
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
