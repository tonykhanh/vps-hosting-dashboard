
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FileCode, Plus, Trash2, FileText, X, Copy, Terminal, MoreVertical, Edit2 } from 'lucide-react';
import { Button } from '../../Button';
import { DeleteScriptModal } from './DeleteScriptModal';
import { ViewScriptModal } from './ViewScriptModal';
import { EditScriptModal } from './EditScriptModal';

const STARTUP_SCRIPTS_LIST = [
  { 
    id: 'scr-1', 
    name: 'Docker & Compose Install', 
    type: 'Boot', 
    created: '2023-02-15',
    content: '#!/bin/bash\n\n# Update package index\napt-get update\n\n# Install Docker\napt-get install -y docker.io docker-compose\n\n# Enable Docker service\nsystemctl enable docker\nsystemctl start docker'
  },
  { 
    id: 'scr-2', 
    name: 'Update System & Security', 
    type: 'Boot', 
    created: '2023-03-10',
    content: '#!/bin/bash\n\n# Update system packages\napt-get update && apt-get upgrade -y\n\n# Install Fail2Ban\napt-get install -y fail2ban\ncp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local\nsystemctl enable fail2ban\nsystemctl start fail2ban'
  },
];

export const ScriptManager: React.FC = () => {
  const [scripts, setScripts] = useState(STARTUP_SCRIPTS_LIST);
  const [showAddScriptModal, setShowAddScriptModal] = useState(false);
  const [newScript, setNewScript] = useState({ name: '', type: 'boot', content: '#!/bin/bash\n\n# Your script goes here\n' });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Modals State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [viewTarget, setViewTarget] = useState<typeof STARTUP_SCRIPTS_LIST[0] | null>(null);
  const [editTarget, setEditTarget] = useState<typeof STARTUP_SCRIPTS_LIST[0] | null>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleAddScript = () => {
    if (!newScript.name) return;
    const script = {
        id: `scr-${Date.now()}`,
        name: newScript.name,
        type: newScript.type === 'boot' ? 'Boot' : 'PXE',
        created: new Date().toISOString().split('T')[0],
        content: newScript.content
    };
    setScripts([script, ...scripts]);
    setShowAddScriptModal(false);
    setNewScript({ name: '', type: 'boot', content: '#!/bin/bash\n\n# Your script goes here\n' });
  };

  const handleUpdateScript = (id: string, updates: { name: string; content: string }) => {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setScripts(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Startup Scripts</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Automate instance configuration (Boot, PXE).</p>
          </div>
          <Button onClick={() => setShowAddScriptModal(true)}>
             <Plus size={16} className="mr-2"/> Add Script
          </Button>
       </div>

       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Terminal size={20} className="text-plasma-600"/> My Scripts
             </h3>
             <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-gray-600 dark:text-gray-300">
                {scripts.length} Scripts
             </span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
             <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                   <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                   {scripts.map((script, index) => (
                      <tr key={script.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group">
                         <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                               <FileCode size={16} />
                            </div>
                            {script.name}
                         </td>
                         <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-neutral-700 rounded-md text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                               {script.type}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{script.created}</td>
                         <td className="px-6 py-4 text-right relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(script.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeDropdown === script.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical size={18} className="rotate-90" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === script.id && (
                                <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= scripts.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setViewTarget(script); setActiveDropdown(null); }}
                                      className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                    >
                                        <FileText size={14} /> View
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setEditTarget(script); setActiveDropdown(null); }}
                                      className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(script); setActiveDropdown(null); }}
                                      className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {scripts.length === 0 && (
                <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                   No scripts found. Create one to get started.
                </div>
             )}
          </div>
       </div>

       {/* Add Script Modal */}
      {showAddScriptModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800 sticky top-0 z-10">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <FileCode size={20} className="text-plasma-600"/> Add Startup Script
                 </h3>
                 <button onClick={() => setShowAddScriptModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
              </div>
              
              <div className="p-8 space-y-6 overflow-y-auto">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Script Name</label>
                       <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white text-sm"
                          placeholder="e.g. Docker Install"
                          value={newScript.name}
                          onChange={(e) => setNewScript({...newScript, name: e.target.value})}
                          autoFocus
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Script Type</label>
                       <div className="relative">
                          <select 
                             className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white text-sm appearance-none"
                             value={newScript.type}
                             onChange={(e) => setNewScript({...newScript, type: e.target.value})}
                          >
                             <option value="boot">Boot (Runs on every boot)</option>
                             <option value="pxe">PXE (iPXE Script)</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Script Content</label>
                       <button className="text-xs text-plasma-600 dark:text-plasma-400 flex items-center gap-1 hover:underline font-medium">
                          <Copy size={12}/> Copy from Template
                       </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex-1 min-h-[300px] flex flex-col">
                       <div className="flex items-center gap-2 px-4 py-2 bg-gray-950 border-b border-gray-800">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="ml-2 text-xs text-gray-500 font-mono">bash</span>
                       </div>
                       <textarea 
                          className="w-full h-full p-4 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none"
                          value={newScript.content}
                          onChange={(e) => setNewScript({...newScript, content: e.target.value})}
                          spellCheck={false}
                       />
                    </div>
                 </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900 sticky bottom-0 z-10">
                 <Button variant="secondary" onClick={() => setShowAddScriptModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button className="gap-2 shadow-lg shadow-plasma-500/20" onClick={handleAddScript} disabled={!newScript.name}>
                    Save Script
                 </Button>
              </div>
           </div>
        </div>,
        document.body
      )}

      {/* View Script Modal */}
      {viewTarget && (
         <ViewScriptModal 
            script={viewTarget}
            onClose={() => setViewTarget(null)}
         />
      )}

      {/* Edit Script Modal */}
      {editTarget && (
         <EditScriptModal 
            script={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={handleUpdateScript}
         />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
         <DeleteScriptModal 
            scriptName={deleteTarget.name}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
         />
      )}
    </div>
  );
};
