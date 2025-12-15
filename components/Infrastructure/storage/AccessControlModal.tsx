
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Globe, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../Button';

interface AccessControlModalProps {
  fileSystemName: string;
  onClose: () => void;
}

export const AccessControlModal: React.FC<AccessControlModalProps> = ({ fileSystemName, onClose }) => {
  const [rules, setRules] = useState([
    { id: '1', ip: '10.0.0.0/16', type: 'VPC Network', access: 'Read/Write' },
    { id: '2', ip: '192.168.1.50', type: 'Single IP', access: 'Read Only' },
  ]);
  const [newIp, setNewIp] = useState('');

  const handleAdd = () => {
    if(!newIp) return;
    setRules([...rules, { id: Date.now().toString(), ip: newIp, type: 'Manual IP', access: 'Read/Write' }]);
    setNewIp('');
  };

  const handleRemove = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe size={20} className="text-plasma-600"/> Access Control
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Manage authorized IP ranges for <strong className="text-gray-900 dark:text-white">{fileSystemName}</strong>.
        </p>

        <div className="space-y-4">
           {/* Add Rule */}
           <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter IP or CIDR (e.g., 10.0.0.5)"
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-plasma-500 dark:text-white"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
              />
              <Button size="sm" onClick={handleAdd} disabled={!newIp}><Plus size={16}/></Button>
           </div>

           {/* List */}
           <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl overflow-hidden">
              {rules.length > 0 ? (
                 <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {rules.map(rule => (
                       <div key={rule.id} className="p-3 flex items-center justify-between">
                          <div>
                             <div className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200">{rule.ip}</div>
                             <div className="text-xs text-gray-500 flex gap-2">
                                <span>{rule.type}</span> • <span className="text-green-600 dark:text-green-400">{rule.access}</span>
                             </div>
                          </div>
                          <button onClick={() => handleRemove(rule.id)} className="text-gray-400 hover:text-red-500 p-1">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="p-6 text-center text-gray-400 text-sm">No access rules defined.</div>
              )}
           </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onClose} className="shadow-lg shadow-plasma-500/20">
             <CheckCircle2 size={16} className="mr-2"/> Done
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
