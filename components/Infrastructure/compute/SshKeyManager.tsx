
import React, { useState } from 'react';
import { Key, Plus, Trash2, X, MoreVertical } from 'lucide-react';
import { Button } from '../../Button';

const SSH_KEYS_LIST = [
  { id: 'ssh-1', name: 'MacBook Pro - Personal', fingerprint: 'SHA256:ep9...41a', created: '2023-01-10' },
  { id: 'ssh-2', name: 'Dev Team Key', fingerprint: 'SHA256:a9b...x99', created: '2023-05-20' },
];

export const SshKeyManager: React.FC = () => {
  const [showAddSSHModal, setShowAddSSHModal] = useState(false);
  const [newSSHKey, setNewSSHKey] = useState({ name: '', key: '' });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SSH Keys</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Secure access credentials for your instances.</p>
          </div>
          <Button onClick={() => setShowAddSSHModal(true)}>
             <Plus size={16} className="mr-2"/> Add SSH Key
          </Button>
       </div>

       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex items-center justify-between">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Key size={18} className="text-plasma-600"/> Authorized Keys
             </h3>
             <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-mono">
                {SSH_KEYS_LIST.length} Keys
             </span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
             <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                   <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Fingerprint</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                   {SSH_KEYS_LIST.map(key => (
                      <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group">
                         <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg text-gray-500">
                               <Key size={16} />
                            </div>
                            {key.name}
                         </td>
                         <td className="px-6 py-4">
                            <code className="bg-gray-100 dark:bg-neutral-900 px-2 py-1 rounded text-xs font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-700">
                               {key.fingerprint}
                            </code>
                         </td>
                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{key.created}</td>
                         <td className="px-6 py-4 text-right relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(key.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeDropdown === key.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical size={18} className="rotate-90" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === key.id && (
                                <div className="absolute right-8 top-8 w-32 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                                    <button className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                        <Trash2 size={14} /> Remove
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

       {/* Add SSH Key Modal */}
      {showAddSSHModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Key size={20} className="text-plasma-600"/> Add SSH Key
                 </h3>
                 <button onClick={() => setShowAddSSHModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"><X size={20}/></button>
              </div>
              
              <div className="p-6 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input 
                       type="text" 
                       className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white text-sm"
                       placeholder="e.g. Work Laptop"
                       value={newSSHKey.name}
                       onChange={(e) => setNewSSHKey({...newSSHKey, name: e.target.value})}
                       autoFocus
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">SSH Public Key</label>
                    <textarea 
                       className="w-full h-32 px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white text-xs font-mono resize-none"
                       placeholder="ssh-rsa AAAAB3NzaC1yc2E..."
                       value={newSSHKey.key}
                       onChange={(e) => setNewSSHKey({...newSSHKey, key: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                       Paste your public key (usually from ~/.ssh/id_rsa.pub).
                    </p>
                 </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900">
                 <Button variant="secondary" onClick={() => setShowAddSSHModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button className="gap-2 shadow-lg shadow-plasma-500/20" onClick={() => setShowAddSSHModal(false)} disabled={!newSSHKey.name || !newSSHKey.key}>
                    Add Key
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
