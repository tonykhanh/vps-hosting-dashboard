import React, { useState } from 'react';
import { Network, Plus, MoreVertical, Trash2, ArrowLeft, CheckCircle2, Globe, Settings, Route, Save, X } from 'lucide-react';
import { Button } from '../../Button';
import { LOCATIONS, REGIONS } from '../../../constants';
import { ProjectStatus } from '../../../types';

// Mock Data
const VPC_LIST = [
  { id: 'vpc-1', name: 'vpc-production-us', region: 'New York', ipRange: '10.25.96.0/20', instances: 5, status: ProjectStatus.RUNNING },
  { id: 'vpc-2', name: 'vpc-staging-sg', region: 'Singapore', ipRange: '10.8.0.0/16', instances: 2, status: ProjectStatus.RUNNING },
];

export const VpcManager: React.FC = () => {
  const [vpcs, setVpcs] = useState(VPC_LIST);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Create Form State
  const [activeRegion, setActiveRegion] = useState('Americas');
  const [createForm, setCreateForm] = useState({
    location: '',
    ipMode: 'auto' as 'auto' | 'manual',
    manualIp: { address: '', prefix: '24' },
    routeMode: 'none' as 'none' | 'custom',
    routes: [] as { destination: string; prefix: string; target: string }[],
    name: ''
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
    setVpcs([...vpcs, {
      id: `vpc-${Date.now()}`,
      name: createForm.name,
      region: locationName,
      ipRange: createForm.ipMode === 'auto' ? '10.25.96.0/20' : `${createForm.manualIp.address}/${createForm.manualIp.prefix}`,
      instances: 0,
      status: ProjectStatus.PROVISIONING
    }]);
    setView('list');
    setCreateForm({
        location: '',
        ipMode: 'auto',
        manualIp: { address: '', prefix: '24' },
        routeMode: 'none',
        routes: [],
        name: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this VPC Network?')) {
      setVpcs(prev => prev.filter(v => v.id !== id));
    }
    setActiveDropdown(null);
  };

  const addRoute = () => {
      setCreateForm(prev => ({
          ...prev,
          routes: [...prev.routes, { destination: '', prefix: '24', target: '' }]
      }));
  };

  const removeRoute = (index: number) => {
      setCreateForm(prev => ({
          ...prev,
          routes: prev.routes.filter((_, i) => i !== index)
      }));
  };

  if (view === 'create') {
      return (
        <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-right-4 duration-300">
             {/* Header */}
             <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                    <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add VPC Network</h1>
             </div>

             <div className="space-y-8 max-w-4xl">
                 {/* 1. Network Location */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Network Location</h3>
                    
                    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-hidden">
                        {/* Region Tabs */}
                        <div className="flex border-b border-gray-100 dark:border-neutral-700 overflow-x-auto">
                            {['All Locations', ...REGIONS].map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setActiveRegion(region)}
                                    className={`
                                        px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2
                                        ${activeRegion === region 
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                                    `}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>

                        {/* Location Grid */}
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
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500 dark:ring-blue-500 dark:border-blue-500' 
                                            : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'}
                                    `}
                                >
                                    <span className="text-3xl">{loc.flag}</span>
                                    <div className="flex-1">
                                        <div className={`font-bold ${isSelected ? 'text-blue-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>
                                            {loc.name}
                                        </div>
                                        <div className={`text-xs uppercase ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {loc.region}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="bg-blue-600 text-white p-1 rounded-full shadow-sm">
                                            <CheckCircle2 size={14} />
                                        </div>
                                    )}
                                </div>
                            )})}
                        </div>
                    </div>
                 </div>

                 {/* 2. Configure IP Range */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configure IP Range</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose if you would like to generate an IP range automatically or configure this manually.</p>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-xl">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            Be careful if you create VPCs with overlapping IP blocks. Network connectivity may not work correctly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div 
                           onClick={() => setCreateForm({...createForm, ipMode: 'auto'})}
                           className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${createForm.ipMode === 'auto' ? 'border-plasma-500 bg-white dark:bg-neutral-800 shadow-md ring-1 ring-plasma-500' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300'}`}
                        >
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Network size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Auto-Assign IP Range</h4>
                                <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded mt-1">Recommended</span>
                            </div>
                            {createForm.ipMode === 'auto' && <div className="ml-auto bg-plasma-600 text-white p-1 rounded-bl-xl absolute top-0 right-0"><CheckCircle2 size={16}/></div>}
                        </div>

                        <div 
                           onClick={() => setCreateForm({...createForm, ipMode: 'manual'})}
                           className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${createForm.ipMode === 'manual' ? 'border-plasma-500 bg-white dark:bg-neutral-800 shadow-md ring-1 ring-plasma-500' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300'}`}
                        >
                            <div className="p-3 bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 rounded-xl">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Configure IP Range</h4>
                                <span className="inline-block bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded mt-1">Advanced</span>
                            </div>
                            {createForm.ipMode === 'manual' && <div className="ml-auto bg-plasma-600 text-white p-1 rounded-bl-xl absolute top-0 right-0"><CheckCircle2 size={16}/></div>}
                        </div>
                    </div>

                    {createForm.ipMode === 'auto' ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-2">
                           An IP address range will generate automatically: <span className="font-mono font-bold">10.25.96.0/20</span>.
                        </p>
                    ) : (
                        <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Set IP Range</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Network Address</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                                        placeholder="10.0.0.0"
                                        value={createForm.manualIp.address}
                                        onChange={(e) => setCreateForm({...createForm, manualIp: {...createForm.manualIp, address: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Network Prefix</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                                        value={createForm.manualIp.prefix}
                                        onChange={(e) => setCreateForm({...createForm, manualIp: {...createForm.manualIp, prefix: e.target.value}})}
                                    >
                                        {[16, 17, 18, 19, 20, 21, 22, 23, 24].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>

                 {/* 3. Manage Routes */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Routes</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enter custom routes to be added to each instance deployed in the VPC. The routes set on a given instance are determined by which routes are set before the instance is attached to the VPC.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div 
                           onClick={() => setCreateForm({...createForm, routeMode: 'none'})}
                           className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center h-32 ${createForm.routeMode === 'none' ? 'border-plasma-500 bg-white dark:bg-neutral-800 shadow-md ring-1 ring-plasma-500' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300'}`}
                        >
                            <span className="font-bold text-lg text-gray-900 dark:text-white">No Routes</span>
                            {createForm.routeMode === 'none' && <div className="ml-auto bg-plasma-600 text-white p-1 rounded-bl-xl absolute top-0 right-0"><CheckCircle2 size={16}/></div>}
                        </div>

                        <div 
                           onClick={() => setCreateForm({...createForm, routeMode: 'custom'})}
                           className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 h-32 relative overflow-hidden ${createForm.routeMode === 'custom' ? 'border-plasma-500 bg-white dark:bg-neutral-800 shadow-md ring-1 ring-plasma-500' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300'}`}
                        >
                             <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Route size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Custom Routes</h4>
                                <span className="inline-block bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded mt-1">Advanced</span>
                            </div>
                            {createForm.routeMode === 'custom' && <div className="ml-auto bg-plasma-600 text-white p-1 rounded-bl-xl absolute top-0 right-0"><CheckCircle2 size={16}/></div>}
                        </div>
                    </div>

                    {createForm.routeMode === 'custom' && (
                        <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 animate-in fade-in slide-in-from-top-2">
                             <h4 className="font-bold text-gray-900 dark:text-white mb-4">Set Routes</h4>
                             <div className="space-y-4">
                                {createForm.routes.map((route, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Destination Address</label>
                                            <input type="text" className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white" />
                                        </div>
                                        <div className="w-32">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Prefix</label>
                                            <input type="number" className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white" defaultValue="24" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Target Address</label>
                                            <input type="text" className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white" />
                                        </div>
                                        <Button variant="secondary" onClick={() => removeRoute(idx)} className="text-red-500 hover:text-red-700 dark:bg-neutral-800 dark:border-neutral-700">Remove</Button>
                                    </div>
                                ))}
                                <Button onClick={addRoute} variant="secondary" className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                                    <Plus size={16} className="mr-2"/> Add New Route
                                </Button>
                             </div>
                        </div>
                    )}
                 </div>

                 {/* 4. VPC Name */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">VPC Network Name</h3>
                    <div className="max-w-md">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Give the network a name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                            value={createForm.name}
                            onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                        />
                    </div>
                 </div>
                 
                 <div className="pt-8">
                     <Button size="lg" className="shadow-lg shadow-plasma-500/20 px-8" onClick={handleCreate} disabled={!createForm.location || !createForm.name}>
                        Add Network
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
                <Network className="text-plasma-600" size={32} />
                VPC Networks
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Private isolated networks for your resources.</p>
          </div>
          <Button onClick={() => setView('create')}>
             <Plus size={16} className="mr-2"/> Add VPC Network
          </Button>
       </div>
       
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Network size={20} className="text-plasma-600"/> Virtual Private Clouds
              </h3>
              <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold">{vpcs.length} Networks</span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left text-sm min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                      <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Region</th>
                          <th className="px-6 py-4">IP Range</th>
                          <th className="px-6 py-4">Instances</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                      {vpcs.map((vpc) => (
                          <tr key={vpc.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative">
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{vpc.name}</td>
                              <td className="px-6 py-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <Globe size={14} className="text-gray-400"/> {vpc.region}
                              </td>
                              <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{vpc.ipRange}</td>
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{vpc.instances}</td>
                              <td className="px-6 py-4">
                                  <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit">
                                      <CheckCircle2 size={12} /> Active
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right relative">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleDropdown(vpc.id); }}
                                    className={`p-2 rounded-lg transition-colors ${activeDropdown === vpc.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                  >
                                      <MoreVertical size={18} className="rotate-90"/>
                                  </button>
                                  
                                  {activeDropdown === vpc.id && (
                                      <div className="absolute right-8 top-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                                          <button className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                                              <Settings size={14} /> Manage
                                          </button>
                                          <button 
                                            onClick={() => handleDelete(vpc.id)}
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
    </div>
  );
};