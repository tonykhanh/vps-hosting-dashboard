
import React, { useState } from 'react';
import { Lock, Plus, MoreVertical, MapPin, Server, ArrowRight, Trash2, RefreshCw, X, Link2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../Button';
import { LOCATIONS, VPS_LIST } from '../../../constants';
import { DeleteReservedIpModal } from './DeleteReservedIpModal';
import { AttachIpModal } from './AttachIpModal';

// Mock Data
const RESERVED_IPS = [
  { id: 'ip-1', address: '104.22.15.192', type: 'IPv4', region: 'New York', attachedTo: 'Web Server - Prod', cost: 3.00 },
  { id: 'ip-2', address: '2001:0db8:85a3::8a2e:0370:7334', type: 'IPv6', region: 'Amsterdam', attachedTo: null, cost: 0.00 },
  { id: 'ip-3', address: '45.33.22.11', type: 'IPv4', region: 'Singapore', attachedTo: 'Database Primary', cost: 3.00 },
];

export const ReservedIpManager: React.FC = () => {
  const [ips, setIps] = useState(RESERVED_IPS);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Modals
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [attachTarget, setAttachTarget] = useState<any>(null);

  // Create Form State
  const [createMode, setCreateMode] = useState<'new' | 'convert'>('new');
  const [newIpForm, setNewIpForm] = useState({
    location: 'us-e',
    type: 'IPv4',
    label: ''
  });
  const [convertForm, setConvertForm] = useState({
    instanceId: '',
    ipAddress: ''
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleCreate = () => {
    const newIp = {
      id: `ip-${Date.now()}`,
      address: createMode === 'new' ? 'Pending Allocation...' : convertForm.ipAddress,
      type: createMode === 'new' ? newIpForm.type : 'IPv4',
      region: createMode === 'new' 
        ? LOCATIONS.find(l => l.id === newIpForm.location)?.name || 'Unknown' 
        : VPS_LIST.find(v => v.id === convertForm.instanceId)?.region || 'Unknown',
      attachedTo: createMode === 'new' ? null : VPS_LIST.find(v => v.id === convertForm.instanceId)?.name || null,
      cost: 3.00
    };
    
    setIps([...ips, newIp]);
    setView('list');
    
    // Reset forms
    setNewIpForm({ location: 'us-e', type: 'IPv4', label: '' });
    setConvertForm({ instanceId: '', ipAddress: '' });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setIps(prev => prev.filter(ip => ip.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleAttachConfirm = (instanceName: string) => {
    if (attachTarget) {
      setIps(prev => prev.map(ip => ip.id === attachTarget.id ? { ...ip, attachedTo: instanceName } : ip));
      setAttachTarget(null);
    }
  };

  const handleDetach = (id: string) => {
    setIps(prev => prev.map(ip => ip.id === id ? { ...ip, attachedTo: null } : ip));
    setActiveDropdown(null);
  };

  if (view === 'create') {
    return (
      <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-right-4 duration-300">
         <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Reserved IP</h1>
         </div>

         <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 shadow-sm space-y-8 max-w-4xl">
            {/* Mode Selection */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Choose Method</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setCreateMode('new')}
                    className={`
                      p-6 rounded-2xl border-2 cursor-pointer transition-all 
                      ${createMode === 'new' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500 dark:ring-blue-500 dark:border-blue-500' 
                        : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'}
                    `}
                  >
                     <div className={`font-bold text-lg mb-1 ${createMode === 'new' ? 'text-blue-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>Add New Reserved IP</div>
                     <p className={`text-sm ${createMode === 'new' ? 'text-blue-700 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>Allocate a fresh static IP address in a specific region.</p>
                  </div>
                  <div 
                    onClick={() => setCreateMode('convert')}
                    className={`
                      p-6 rounded-2xl border-2 cursor-pointer transition-all 
                      ${createMode === 'convert' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500 dark:ring-blue-500 dark:border-blue-500' 
                        : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'}
                    `}
                  >
                     <div className={`font-bold text-lg mb-1 ${createMode === 'convert' ? 'text-blue-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>Convert Existing IP</div>
                     <p className={`text-sm ${createMode === 'convert' ? 'text-blue-700 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>Convert a dynamic IP currently assigned to an instance into a static reserved IP.</p>
                  </div>
               </div>
            </div>

            {createMode === 'new' ? (
               <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                        <select 
                           className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                           value={newIpForm.location}
                           onChange={(e) => setNewIpForm({...newIpForm, location: e.target.value})}
                        >
                           {LOCATIONS.map(loc => (
                              <option key={loc.id} value={loc.id}>{loc.name}, {loc.id.split('-')[0].toUpperCase()}</option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                        <select 
                           className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                           value={newIpForm.type}
                           onChange={(e) => setNewIpForm({...newIpForm, type: e.target.value})}
                        >
                           <option>IPv4</option>
                           <option>IPv6</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Label</label>
                     <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                        placeholder="e.g. Production Load Balancer IP"
                        value={newIpForm.label}
                        onChange={(e) => setNewIpForm({...newIpForm, label: e.target.value})}
                     />
                  </div>
               </div>
            ) : (
               <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Instance</label>
                        <select 
                           className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                           value={convertForm.instanceId}
                           onChange={(e) => {
                              const instance = VPS_LIST.find(v => v.id === e.target.value);
                              setConvertForm({ instanceId: e.target.value, ipAddress: instance?.ip || '' });
                           }}
                        >
                           <option value="">Select an instance...</option>
                           {VPS_LIST.map(vps => (
                              <option key={vps.id} value={vps.id}>{vps.name} ({vps.ip})</option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">IP Address to Reserve</label>
                        <input 
                           type="text" 
                           className="w-full px-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none text-gray-500 cursor-not-allowed"
                           value={convertForm.ipAddress}
                           readOnly
                        />
                     </div>
                  </div>
               </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300">
               <ul className="list-disc pl-5 space-y-1">
                  <li>Reserved IPs cost <strong>$3.00/month</strong> ($0.004/hour).</li>
                  <li>IPs can only be remapped within the same datacenter region.</li>
               </ul>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-neutral-700">
               <Button onClick={handleCreate} className="shadow-lg shadow-blue-500/20 px-8 py-3">Reserve IP Address</Button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="text-plasma-600" size={32} />
                Reserved IPs
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Static IP addresses that persist across instance terminations.</p>
          </div>
          <Button onClick={() => setView('create')}>
             <Plus size={16} className="mr-2"/> Reserve New IP
          </Button>
       </div>

       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock size={20} className="text-plasma-600"/> Address Pool
             </h3>
             <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold">
                {ips.length} IPs
             </span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
             <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                   <tr>
                      <th className="px-6 py-4">IP Address</th>
                      <th className="px-6 py-4">Region</th>
                      <th className="px-6 py-4">Assignment</th>
                      <th className="px-6 py-4">Cost</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                   {ips.map((ip, index) => (
                      <tr key={ip.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative">
                         <td className="px-6 py-4">
                            <div className="font-mono font-bold text-gray-900 dark:text-white flex items-center gap-2">
                               {ip.address}
                               <span className={`text-[10px] px-1.5 py-0.5 rounded border ${ip.type === 'IPv6' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-200' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200'}`}>
                                  {ip.type}
                               </span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                               <MapPin size={14} className="text-gray-400"/> {ip.region}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            {ip.attachedTo ? (
                               <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit">
                                  <Server size={12} /> {ip.attachedTo}
                               </div>
                            ) : (
                               <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded w-fit italic">
                                  Unassigned
                               </div>
                            )}
                         </td>
                         <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            ${ip.cost.toFixed(2)}/mo
                         </td>
                         <td className="px-6 py-4 text-right relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(ip.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeDropdown === ip.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical size={18} className="rotate-90" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === ip.id && (
                                <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= ips.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                    {ip.attachedTo ? (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleDetach(ip.id); }}
                                          className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                        >
                                            <X size={14} /> Detach
                                        </button>
                                    ) : (
                                        <button 
                                          onClick={(e) => { 
                                              e.stopPropagation(); 
                                              setAttachTarget(ip); 
                                              setActiveDropdown(null); 
                                          }}
                                          className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                        >
                                            <Link2 size={14} /> Attach to Instance
                                        </button>
                                    )}
                                    
                                    <div className="h-px bg-gray-100 dark:bg-neutral-700 my-1"></div>
                                    <button 
                                      onClick={(e) => { 
                                          e.stopPropagation(); 
                                          setDeleteTarget(ip); 
                                          setActiveDropdown(null); 
                                      }}
                                      className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Release IP
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

       {/* Delete Modal */}
       {deleteTarget && (
          <DeleteReservedIpModal 
             address={deleteTarget.address}
             onClose={() => setDeleteTarget(null)}
             onConfirm={handleDeleteConfirm}
          />
       )}

       {/* Attach Modal */}
       {attachTarget && (
          <AttachIpModal 
             ipAddress={attachTarget.address}
             onClose={() => setAttachTarget(null)}
             onAttach={handleAttachConfirm}
          />
       )}
    </div>
  );
};
