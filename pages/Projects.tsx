
import React, { useState, useMemo } from 'react';
import { useNavigate } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { Button } from '../components/Button';
import { Project, ProjectStatus } from '../types';
import { Box, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { ProjectCard } from '../components/Workspace/ProjectDirectory/ProjectCard';
import { FilterBar } from '../components/Workspace/ProjectDirectory/FilterBar';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects, deleteProject, updateProject } = useProjects();
  
  // Local State
  const [filter, setFilter] = useState<'all' | ProjectStatus>('all');
  const [search, setSearch] = useState('');
  
  // Edit State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({ name: '', domain: '', status: ProjectStatus.RUNNING, region: '' });
  
  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (p.id === 'p-new') return false; // Exclude placeholder if present in context
      const matchesFilter = filter === 'all' || p.status === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.domain.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  // Handlers
  const handleEditClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditForm({ 
      name: project.name, 
      domain: project.domain, 
      status: project.status,
      region: project.region
    });
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteProject(deletingId);
      setDeletingId(null);
    }
  };

  const saveEdit = () => {
    if (editingProject) {
      updateProject(editingProject.id, editForm);
      setEditingProject(null);
    }
  };

  const handleUpdateStatus = (id: string, status: ProjectStatus) => {
    updateProject(id, { status });
  };

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Box className="text-plasma-600" size={32} />
            Project Directory
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your infrastructure capsules and blueprints.
          </p>
        </div>
        <Button onClick={() => navigate('/console/create')} className="shadow-lg shadow-plasma-500/20">
           <Plus size={18} className="mr-2" /> New Capsule
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        filter={filter} 
        setFilter={setFilter} 
        search={search} 
        setSearch={setSearch} 
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick}
              onUpdateStatus={handleUpdateStatus}
            />
         ))}

         {/* Add New Placeholder */}
         <div 
            onClick={() => navigate('/console/create')}
            className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-b-3xl rounded-t-none p-6 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500 hover:border-plasma-300 dark:hover:border-plasma-500/50 hover:text-plasma-500 dark:hover:text-plasma-400 hover:bg-plasma-50/10 dark:hover:bg-plasma-900/10 transition-all cursor-pointer min-h-[220px] group"
         >
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform group-hover:bg-white dark:group-hover:bg-neutral-700">
               <Plus size={28} />
            </div>
            <div className="text-center">
               <h3 className="font-bold text-lg">Deploy New Capsule</h3>
               <p className="text-xs mt-1 max-w-[200px]">From Blueprint (WordPress, Node) or Custom Docker Image</p>
            </div>
         </div>
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setEditingProject(null)}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
                 <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <Edit2 size={20} className="text-plasma-600"/> Edit Capsule
                 </h3>
                 <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                    <input 
                       type="text" 
                       className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500 focus:bg-white dark:focus:bg-neutral-900 transition-all"
                       value={editForm.name}
                       onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Primary Domain</label>
                    <div className="flex items-center">
                       <span className="pl-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-r-0 border-gray-200 dark:border-neutral-700 rounded-l-xl text-gray-500 text-sm">https://</span>
                       <input 
                          type="text" 
                          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-r-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500 focus:bg-white dark:focus:bg-neutral-900 transition-all"
                          value={editForm.domain}
                          onChange={(e) => setEditForm({...editForm, domain: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">State</label>
                        <select 
                           className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500 cursor-pointer"
                           value={editForm.status}
                           onChange={(e) => setEditForm({...editForm, status: e.target.value as ProjectStatus})}
                        >
                           {Object.values(ProjectStatus).map(status => (
                              <option key={status} value={status}>{status}</option>
                           ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Region</label>
                        <input 
                           type="text" 
                           className="w-full px-4 py-3 bg-gray-100 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none text-gray-500 cursor-not-allowed"
                           value={editForm.region.toUpperCase()}
                           disabled
                        />
                    </div>
                 </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
                 <Button variant="secondary" onClick={() => setEditingProject(null)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button onClick={saveEdit} className="gap-2 shadow-lg shadow-plasma-500/20"><Save size={16}/> Save Changes</Button>
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setDeletingId(null)}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center border border-gray-200 dark:border-neutral-700" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <Trash2 size={32} />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Delete Capsule?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                 This action is <strong>irreversible</strong>. All resources, data, and backups associated with this project will be permanently destroyed.
              </p>
              <div className="flex gap-3 justify-center">
                 <Button variant="secondary" onClick={() => setDeletingId(null)} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button variant="danger" onClick={confirmDelete} className="flex-1 shadow-lg shadow-red-500/20">Confirm Delete</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
