
import React, { createContext, useContext, useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { MOCK_PROJECTS } from '../constants';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);

    // Auto-transition from PROVISIONING to RUNNING after 30 seconds
    if (project.status === ProjectStatus.PROVISIONING) {
      setTimeout(() => {
        setProjects(prev => prev.map(p => 
          p.id === project.id ? { ...p, status: ProjectStatus.RUNNING } : p
        ));
      }, 30000);
    }
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
