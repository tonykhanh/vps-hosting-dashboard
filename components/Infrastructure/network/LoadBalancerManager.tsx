
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Workflow, Plus, MoreVertical, Trash2, ArrowLeft, 
  CheckCircle2, Globe, Settings, Server, X, Activity, AlertTriangle, Route
} from 'lucide-react';
import { Button } from '../../Button';
import { LOCATIONS, REGIONS } from '../../../constants';
import { ProjectStatus } from '../../../types';

// Mock Data
const LB_LIST = [
  { 
    id: 'lb-1', 
    name: 'web-prod-lb', 
    region: 'New York', 
    ip: '104.22.15.200', 
    algorithm: 'Round Robin', 
    targets: 3, 
    status: ProjectStatus.RUNNING 
  },
  { 
    id: 'lb-2', 
    name: 'api-internal-lb', 
    region: 'Singapore', 
    ip: '10.0.0.50', 
    algorithm: 'Least Connections',
    targets: 2, 
    status: ProjectStatus.RUNNING 
  },
];

// --- Internal Modals ---

const DeleteLoadBalancerModal = ({ lbName, onClose, onConfirm }: { lbName: string, onClose: () => void, onConfirm: () => void }) => {
  const [confirmName, setConfirmName] = useState('');
  const isMatch = confirmName === lbName;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
            <AlertTriangle size={32} strokeWidth={2} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Load Balancer?</h3>
          
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
            This will permanently destroy <span className="font-bold text-gray-900 dark:text-white">{lbName}</span>. 
            Traffic distribution will stop immediately.
          </p>

          <div className="w-full text-left bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 mt-2">
             <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Type <span className="select-all text-gray-900 dark:text-white">{lbName}</span> to confirm</label>
             <input 
                type="text" 
                className="w-full p-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-600 rounded-lg outline-none focus:border-red-500 dark:text-white transition-colors"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={lbName}
                autoFocus
             />
          </div>

          <div className="flex gap-3 w-full mt-4">
            <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700">
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} className="flex-1 shadow-lg shadow-red-500/20" disabled={!isMatch}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const LoadBalancerManager: React.FC = () => {
  const [lbs, setLbs] = useState(LB_LIST);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Modals
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Create Form State
  const [activeRegion, setActiveRegion] = useState('Americas');
  const [createForm, setCreateForm] = useState({
    name: '',
    location: '',
    algorithm: 'Round Robin',
    protocol: 'HTTP',
    port: 80
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleCreate = () => {
    const locationName = LOCATIONS.find(l => l.id === createForm.location)?.name || 'Unknown';
    setLbs([...lbs, {
      id: `lb-${Date.now()}`,
      name: createForm.name,
      region: locationName,
      ip: 'Provisioning...',
      algorithm: createForm.algorithm,
      targets: 0,
      status: ProjectStatus.PROVISIONING
    }]);
    setView('list');
    setCreateForm({
        name: '',
        location: '',
        algorithm: 'Round Robin',
        protocol: 'HTTP',
        port: 80
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setLbs(prev => prev.filter(lb => lb.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  if (view === 'create') {
      return (
        <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-right-4 duration-300">
             {/* Header */}
             <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                    <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Load Balancer</h1>
             </div>

             <div className="space-y-8 max-w-4xl">
                 {/* 1. Location */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Region</h3>
                    
                    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-hidden">
                        <div className="flex border-b border-gray-100 dark:border-neutral-700 overflow-x-auto">
                            {['All Locations', ...REGIONS].map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setActiveRegion(region)}
                                    className={`
                                        px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2
                                        ${activeRegion === region 
                                            ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400 bg-plasma-50/50 dark:bg-plasma-900/10' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                                    `}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {LOCATIONS
                                .filter(l => activeRegion === 'All Locations' || l.region === activeRegion)
                                .map(loc => {
                                const isSelected = createForm.location === loc.id;
                                return (
                                <div 
                                    key={loc.id}
                                    onClick={() => setCreateForm({...createForm, location: loc.id})}
                                    className={`
                                        p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 group
                                        ${isSelected 
                                            ? 'bg-plasma-50 dark:bg-plasma-900/20 border-plasma-500 ring-1 ring-plasma-500' 
                                            : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'}
                                    `}
                                >
                                    <span className="text-3xl">{loc.flag}</span>
                                    <div className="flex-1">
                                        <div className={`font-bold ${isSelected ? 'text-plasma-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>
                                            {loc.name}
                                        </div>
                                        <div className={`text-xs uppercase ${isSelected ? 'text-plasma-700 dark:text-plasma-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {loc.region}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="bg-plasma-600 text-white p-1 rounded-full shadow-sm">
                                            <CheckCircle2 size={14} />
                                        </div>
                                    )}
                                </div>
                            )})}
                        </div>
                    </div>
                 </div>

                 {/* 2. Configuration */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                                placeholder="my-load-balancer"
                                value={createForm.name}
                                onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Algorithm</label>
                            <select 
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                                value={createForm.algorithm}
                                onChange={(e) => setCreateForm({...createForm, algorithm: e.target.value})}
                            >
                                <option>Round Robin</option>
                                <option>Least Connections</option>
                                <option>Source IP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Forwarding Rules</label>
                            <div className="flex gap-2 items-center">
                                <span className="text-sm font-bold text-gray-500">Inbound</span>
                                <input 
                                    type="number" 
                                    className="w-20 px-3 py-2 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white"
                                    value={createForm.port}
                                    onChange={(e) => setCreateForm({...createForm, port: parseInt(e.target.value)})}
                                />
                                <span className="text-sm font-bold text-gray-500">→ Target</span>
                                <input 
                                    type="number" 
                                    className="w-20 px-3 py-2 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white"
                                    defaultValue={createForm.port}
                                    disabled
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Protocol</label>
                            <select 
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                                value={createForm.protocol}
                                onChange={(e) => setCreateForm({...createForm, protocol: e.target.value})}
                            >
                                <option>HTTP</option>
                                <option>HTTPS</option>
                                <option>TCP</option>
                            </select>
                        </div>
                    </div>
                 </div>
                 
                 <div className="pt-8">
                     <Button size="lg" className="shadow-lg shadow-plasma-500/20 px-8" onClick={handleCreate} disabled={!createForm.location || !createForm.name}>
                        Create Load Balancer
                     </Button>
                 </div>
             </div>
        </div>
      )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Workflow className="text-plasma-600" size={32} />
                Load Balancers
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Distribute traffic across multiple instances.</p>
          </div>
          <Button onClick={() => setView('create')}>
             <Plus size={16} className="mr-2"/> Create Load Balancer
          </Button>
       </div>
       
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Workflow size={20} className="text-plasma-600"/> Active Balancers
              </h3>
              <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold">{lbs.length} Active</span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left text-sm min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                      <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Region</th>
                          <th className="px-6 py-4">IP Address</th>
                          <th className="px-6 py-4">Targets</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                      {lbs.map((lb, index) => (
                          <tr key={lb.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative">
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{lb.name}</td>
                              <td className="px-6 py-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <Globe size={14} className="text-gray-400"/> {lb.region}
                              </td>
                              <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{lb.ip}</td>
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                  <div className="flex items-center gap-1">
                                      <Server size={14} /> {lb.targets} Instances
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  {lb.status === ProjectStatus.RUNNING ? (
                                      <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit">
                                          <CheckCircle2 size={12} /> Healthy
                                      </span>
                                  ) : (
                                      <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded w-fit">
                                          <Activity size={12} className="animate-pulse" /> Provisioning
                                      </span>
                                  )}
                              </td>
                              <td className="px-6 py-4 text-right relative">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleDropdown(lb.id); }}
                                    className={`p-2 rounded-lg transition-colors ${activeDropdown === lb.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                  >
                                      <MoreVertical size={18} className="rotate-90"/>
                                  </button>
                                  
                                  {activeDropdown === lb.id && (
                                      <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= lbs.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                          <button 
                                            className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                          >
                                              <Settings size={14} /> Manage
                                          </button>
                                          <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setDeleteTarget(lb); 
                                                setActiveDropdown(null); 
                                            }}
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
          </div>
       </div>

       {/* Delete Confirmation Modal */}
       {deleteTarget && (
          <DeleteLoadBalancerModal 
             lbName={deleteTarget.name}
             onClose={() => setDeleteTarget(null)}
             onConfirm={handleDeleteConfirm}
          />
       )}
    </div>
  );
};
