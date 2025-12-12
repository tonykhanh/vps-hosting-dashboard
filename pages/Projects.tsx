
import React, { useState } from 'react';
import { useNavigate } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Project, ProjectStatus } from '../types';
import { 
  Box, Filter, Plus, Search, Server, Globe, 
  MoreVertical, Cloud, Zap, HardDrive, Edit2, Trash2, X, Save
} from 'lucide-react';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects, deleteProject, updateProject } = useProjects();
  const [filter, setFilter] = useState<'all' | ProjectStatus>('all');
  const [search, setSearch] = useState('');
  
  // Edit State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null); // ID of project to delete
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Form State for Edit
  const [editForm, setEditForm] = useState({ name: '', domain: '', status: ProjectStatus.RUNNING });

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.domain.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch && p.id !== 'p-new';
  });

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleEditClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditForm({ name: project.name, domain: project.domain, status: project.status });
    setActiveDropdown(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(id);
    setActiveDropdown(null);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      deleteProject(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const saveEdit = () => {
    if (editingProject) {
      updateProject(editingProject.id, editForm);
      setEditingProject(null);
    }
  };

  return (
    <div className="space-y-8 pb-20 relative h-full" onClick={() => setActiveDropdown(null)}>
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
        <Button onClick={() => navigate('/console/create')}>
           <Plus size={18} className="mr-2" /> New Capsule
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl p-2 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
         <div className="w-full md:w-auto flex items-center gap-2 p-1 bg-gray-100/50 dark:bg-neutral-900/50 rounded-xl overflow-x-auto">
            {['all', ProjectStatus.RUNNING, ProjectStatus.STOPPED].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {f === 'all' ? 'All Capsules' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
         </div>

         <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/50 dark:bg-neutral-900/50 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-plasma-200 dark:focus:border-plasma-800 rounded-xl text-sm outline-none transition-all dark:text-white dark:placeholder-gray-500"
            />
         </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => navigate(`/console/projects/${project.id}`)}
              className="group relative bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-plasma-200 dark:hover:border-plasma-500/30 transition-all duration-300 cursor-pointer overflow-visible"
            >
               {/* Status Line */}
               <div className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl ${
                  project.status === 'RUNNING' ? 'bg-green-500' :
                  project.status === 'STOPPED' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-plasma-500'
               }`}></div>

               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-neutral-700 dark:to-neutral-600 border border-gray-100 dark:border-neutral-600 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm group-hover:scale-110 transition-transform">
                        <Server size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-plasma-600 dark:group-hover:text-plasma-400 transition-colors">{project.name}</h3>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                           <Globe size={10} /> {project.domain}
                        </div>
                     </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => toggleDropdown(project.id, e)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                       <MoreVertical size={16} />
                    </button>
                    
                    {activeDropdown === project.id && (
                      <div className="absolute right-0 top-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            onClick={(e) => handleEditClick(project, e)}
                            className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                              <Edit2 size={14} /> Edit
                          </button>
                          <div className="h-px bg-gray-100 dark:bg-neutral-700 my-1"></div>
                          <button 
                            onClick={(e) => handleDeleteClick(project.id, e)}
                            className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                              <Trash2 size={14} /> Delete
                          </button>
                      </div>
                    )}
                  </div>
               </div>

               {/* Resource Snapshot */}
               <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50 dark:border-neutral-700 mb-4">
                  <div className="text-center">
                     <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">CPU</div>
                     <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1">
                        <Zap size={12} className={project.status === 'RUNNING' ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'} />
                        {Math.round(project.metrics.cpu[project.metrics.cpu.length -1]?.value || 0)}%
                     </div>
                  </div>
                  <div className="text-center border-l border-gray-50 dark:border-neutral-700">
                     <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">RAM</div>
                     <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1">
                        <HardDrive size={12} className="text-indigo-400" />
                        {Math.round(project.metrics.memory[project.metrics.memory.length -1]?.value || 0)}%
                     </div>
                  </div>
                  <div className="text-center border-l border-gray-50 dark:border-neutral-700">
                     <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Region</div>
                     <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1">
                        <Cloud size={12} className="text-blue-400" />
                        {project.region.toUpperCase()}
                     </div>
                  </div>
               </div>

               <div className="flex justify-between items-center">
                  <Badge status={project.status} />
                  <span className="text-xs text-gray-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                     Open Capsule <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">→</div>
                  </span>
               </div>
            </div>
         ))}

         {/* Add New Placeholder */}
         <div 
            onClick={() => navigate('/console/create')}
            className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500 hover:border-plasma-300 dark:hover:border-plasma-500/50 hover:text-plasma-500 dark:hover:text-plasma-400 hover:bg-plasma-50/10 dark:hover:bg-plasma-900/10 transition-all cursor-pointer min-h-[220px]"
         >
            <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
               <Plus size={24} />
            </div>
            <div className="text-center">
               <h3 className="font-bold">Deploy New Capsule</h3>
               <p className="text-xs mt-1">From Blueprint or Custom Image</p>
            </div>
         </div>
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setEditingProject(null)}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Edit2 size={20} className="text-plasma-600"/> Edit Project
                 </h3>
                 <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                    <input 
                       type="text" 
                       className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                       value={editForm.name}
                       onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Domain</label>
                    <input 
                       type="text" 
                       className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                       value={editForm.domain}
                       onChange={(e) => setEditForm({...editForm, domain: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select 
                       className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                       value={editForm.status}
                       onChange={(e) => setEditForm({...editForm, status: e.target.value as ProjectStatus})}
                    >
                       {Object.values(ProjectStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                       ))}
                    </select>
                 </div>
              </div>

              <div className="mt-8 flex justify-end gap-2">
                 <Button variant="secondary" onClick={() => setEditingProject(null)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button onClick={saveEdit} className="gap-2"><Save size={16}/> Save Changes</Button>
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowDeleteModal(null)}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Trash2 size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Delete Capsule?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                 This action cannot be undone. All resources and data associated with this project will be permanently destroyed.
              </p>
              <div className="flex gap-2 justify-center">
                 <Button variant="secondary" onClick={() => setShowDeleteModal(null)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button variant="danger" onClick={confirmDelete}>Confirm Delete</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
