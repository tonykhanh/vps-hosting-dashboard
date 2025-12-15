
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Plus, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '../../Button';
import { FIREWALL_LIST } from '../../../constants';
import { DeleteFirewallGroupModal } from './DeleteFirewallGroupModal';
import { ManageFirewallRulesModal } from './ManageFirewallRulesModal';

export const FirewallManager: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [groups, setGroups] = useState(FIREWALL_LIST);
  const [newGroup, setNewGroup] = useState({ name: '', type: 'Cloud Firewall' });

  // Modal State
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [manageTarget, setManageTarget] = useState<any>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleCreate = () => {
    setGroups([...groups, {
        id: `fw-${Date.now()}`,
        name: newGroup.name,
        rulesIn: 0,
        rulesOut: 0,
        instances: 0,
        created: new Date().toISOString().split('T')[0]
    }]);
    setShowAddModal(false);
    setNewGroup({ name: '', type: 'Cloud Firewall' });
  }

  const handleDeleteConfirm = () => {
      if (deleteTarget) {
        setGroups(prev => prev.filter(g => g.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
  }

  const handleUpdateRules = (id: string, updates: any) => {
      setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Firewall Groups</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Control traffic to your instances.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
             <Plus size={16} className="mr-2"/> Create Group
          </Button>
       </div>
       
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Security Groups</h3>
              <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold">{groups.length} Active</span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left text-sm min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                      <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Inbound Rules</th>
                          <th className="px-6 py-4">Outbound Rules</th>
                          <th className="px-6 py-4">Linked Instances</th>
                          <th className="px-6 py-4">Created</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                      {groups.map((fw, index) => (
                          <tr key={fw.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                              <td className="px-6 py-4">
                                  <div className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                      <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                                          <Shield size={16} />
                                      </div>
                                      {fw.name}
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-bold">
                                      {fw.rulesIn} Rules
                                  </span>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-bold">
                                      {fw.rulesOut} Rules
                                  </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">
                                  {fw.instances}
                              </td>
                              <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                  {fw.created}
                              </td>
                              <td className="px-6 py-4 text-right relative">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleDropdown(fw.id); }}
                                    className={`p-2 rounded-lg transition-colors ${activeDropdown === fw.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                  >
                                      <MoreVertical size={18} className="rotate-90" />
                                  </button>
                                  
                                  {activeDropdown === fw.id && (
                                      <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= groups.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                          <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setManageTarget(fw);
                                                setActiveDropdown(null);
                                            }}
                                            className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                          >
                                              <Edit2 size={14} /> Manage Rules
                                          </button>
                                          <button 
                                            onClick={(e) => { 
                                                e.stopPropagation();
                                                setDeleteTarget(fw);
                                                setActiveDropdown(null);
                                            }}
                                            className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                          >
                                              <Trash2 size={14} /> Delete Group
                                          </button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
       </div>

       {/* Create Modal */}
       {showAddModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-neutral-700">
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield size={20} className="text-plasma-600"/> Create Firewall Group
                 </h3>
                 <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <input 
                       type="text" 
                       className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                       placeholder="e.g. Web Server (Public)"
                       value={newGroup.name}
                       onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                       autoFocus
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                    <select className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white">
                        <option>Cloud Firewall</option>
                    </select>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900">
                 <Button variant="secondary" onClick={() => setShowAddModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button className="gap-2 shadow-lg shadow-plasma-500/20" onClick={handleCreate} disabled={!newGroup.name}>
                    <Plus size={16}/> Create
                 </Button>
              </div>
           </div>
        </div>,
        document.body
       )}

       {/* Delete Modal */}
       {deleteTarget && (
          <DeleteFirewallGroupModal 
             groupName={deleteTarget.name}
             onClose={() => setDeleteTarget(null)}
             onConfirm={handleDeleteConfirm}
          />
       )}

       {/* Manage Rules Modal */}
       {manageTarget && (
          <ManageFirewallRulesModal 
             group={manageTarget}
             onClose={() => setManageTarget(null)}
             onUpdate={handleUpdateRules}
          />
       )}
    </div>
  );
};
