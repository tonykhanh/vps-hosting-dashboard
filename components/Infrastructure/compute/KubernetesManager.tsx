
import React, { useState, useMemo } from 'react';
import { 
  Layers, Plus, Loader2, CheckCircle2, MoreVertical, ArrowRight,
  ChevronRight, Minus, Check, Info, Trash2, Settings, Scaling, LayoutGrid
} from 'lucide-react';
import { Button } from '../../Button';
import { 
  K8S_VERSIONS, LOCATIONS, REGIONS, PLANS_DATA 
} from '../../../constants';
import { DeleteClusterModal } from './DeleteClusterModal';
import { ScaleClusterModal } from './ScaleClusterModal';
import { ManageClusterModal } from './ManageClusterModal';

// Initial Mock Data for Clusters
const INITIAL_CLUSTERS = [
  { 
    id: 'k8s-1', 
    name: 'VKE Cluster', 
    version: 'v1.34.1+2', 
    location: 'New Jersey',
    flag: '🇺🇸',
    status: 'Installing',
    created: '2025-12-10T03:59:29+00:00',
    nodeCount: 3,
    plan: 'voc-c-2c-4gb-80s'
  },
  { 
    id: 'k8s-2', 
    name: 'Prod-Cluster-SG', 
    version: 'v1.33.5+1', 
    location: 'Singapore',
    flag: '🇸🇬',
    status: 'Running',
    created: '2025-11-15T12:00:00+00:00',
    nodeCount: 5,
    plan: 'voc-c-4c-8gb'
  }
];

export const KubernetesManager: React.FC = () => {
  const [clusters, setClusters] = useState(INITIAL_CLUSTERS);
  const [showK8sCreate, setShowK8sCreate] = useState(false);
  const [activeRegion, setActiveRegion] = useState('Americas');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Modals State
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [scaleTarget, setScaleTarget] = useState<any>(null);
  const [manageTarget, setManageTarget] = useState<any>(null);

  // Create Form State
  const [k8sConfig, setK8sConfig] = useState({
    name: '',
    version: K8S_VERSIONS[0],
    ha: false,
    firewall: false,
    poolType: 'Optimized Cloud',
    poolPlan: 'voc-c-2c-4gb-80s',
    nodeCount: 3,
    location: 'us-e',
    vpc: 'default'
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleCreateCluster = () => {
    const loc = LOCATIONS.find(l => l.id === k8sConfig.location);
    const newCluster = {
      id: `k8s-${Date.now()}`,
      name: k8sConfig.name || 'Untitled Cluster',
      version: k8sConfig.version,
      location: loc?.name || 'Unknown',
      flag: loc?.flag || '🏳️',
      status: 'Provisioning',
      created: new Date().toISOString(),
      nodeCount: k8sConfig.nodeCount,
      plan: k8sConfig.poolPlan
    };
    
    setClusters([newCluster, ...clusters]);
    setShowK8sCreate(false);
    // Reset config (optional)
    setK8sConfig(prev => ({...prev, name: '', nodeCount: 3}));
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setClusters(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleScaleConfirm = (newCount: number) => {
    if (scaleTarget) {
      setClusters(prev => prev.map(c => c.id === scaleTarget.id ? { ...c, nodeCount: newCount } : c));
      setScaleTarget(null);
    }
  };

  const handleClusterUpdate = (clusterId: string, updates: any) => {
    setClusters(prev => prev.map(c => c.id === clusterId ? { ...c, ...updates } : c));
    
    // If status was updated to 'Upgrading', auto-revert to 'Running' after some time for demo
    if (updates.status === 'Upgrading') {
        setTimeout(() => {
            setClusters(prev => prev.map(c => c.id === clusterId ? { ...c, status: 'Running' } : c));
        }, 5000);
    }
  };

  // K8s Cost Calculation
  const k8sCost = useMemo(() => {
    const plan = PLANS_DATA.find(p => p.id === k8sConfig.poolPlan);
    const nodeCost = (plan?.price || 0) * k8sConfig.nodeCount;
    const haCost = k8sConfig.ha ? 40 : 0; 
    return nodeCost + haCost;
  }, [k8sConfig]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onClick={() => setActiveDropdown(null)}>
       {!showK8sCreate ? (
          <>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kubernetes</h1>
                   <p className="text-gray-500 dark:text-gray-400 text-sm">Managed Kubernetes Clusters (VKE).</p>
                </div>
                <Button onClick={() => setShowK8sCreate(true)}>
                   <Plus size={16} className="mr-2"/> Add Cluster
                </Button>
             </div>

             <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
                   <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <LayoutGrid size={20} className="text-plasma-600"/> Clusters
                   </h3>
                   <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-gray-600 dark:text-gray-300">
                      {clusters.length} Active
                   </span>
                </div>
                <div className="overflow-x-auto overflow-y-visible">
                   <table className="w-full text-left text-sm min-w-[800px]">
                      <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                         <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Nodes</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                         {clusters.map((cluster, index) => (
                            <tr key={cluster.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group">
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <Layers size={16} />
                                     </div>
                                     <div>
                                        <div className="font-bold text-gray-900 dark:text-white">{cluster.name}</div>
                                        <div className="text-xs text-gray-500">{cluster.version}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     <span className="text-lg">{cluster.flag}</span>
                                     <span className="text-gray-700 dark:text-gray-300">{cluster.location}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                                  {cluster.nodeCount} Nodes
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     {cluster.status === 'Installing' || cluster.status === 'Provisioning' || cluster.status === 'Upgrading' ? (
                                        <Loader2 size={16} className="text-amber-500 animate-spin" />
                                     ) : (
                                        <CheckCircle2 size={16} className="text-green-500" />
                                     )}
                                     <span className={`text-sm font-medium ${cluster.status === 'Installing' || cluster.status === 'Provisioning' || cluster.status === 'Upgrading' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {cluster.status}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right relative">
                                  <button 
                                     onClick={(e) => { e.stopPropagation(); toggleDropdown(cluster.id); }}
                                     className={`p-2 rounded-lg transition-colors ${activeDropdown === cluster.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                  >
                                     <MoreVertical size={18} className="rotate-90" />
                                  </button>

                                  {/* Dropdown Menu */}
                                  {activeDropdown === cluster.id && (
                                     <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= clusters.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setManageTarget(cluster); setActiveDropdown(null); }}
                                          className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                        >
                                           <Settings size={14} /> Manage
                                        </button>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setScaleTarget(cluster); setActiveDropdown(null); }}
                                          className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                        >
                                           <Scaling size={14} /> Scale Pool
                                        </button>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(cluster); setActiveDropdown(null); }}
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
                   {clusters.length === 0 && (
                      <div className="p-8 text-center text-gray-400 text-sm">
                         No active clusters. Create one to get started.
                      </div>
                   )}
                </div>
             </div>
          </>
       ) : (
          <div className="space-y-8 pb-10">
             {/* Create Wizard Header */}
             <div className="flex items-center gap-4">
                <button onClick={() => setShowK8sCreate(false)} className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                   <ArrowRight className="rotate-180 text-gray-500" size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create a Cluster</h1>
             </div>

             {/* Main Form Area */}
             <div className="space-y-8">
                
                {/* Section 1: Cluster Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">Cluster Name</label>
                      <div className="relative">
                         <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white text-base"
                            placeholder="e.g. production-cluster"
                            value={k8sConfig.name}
                            onChange={(e) => setK8sConfig({...k8sConfig, name: e.target.value})}
                         />
                      </div>
                   </div>
                   <div>
                      <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">Kubernetes Version</label>
                      <div className="relative">
                         <select 
                            className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white appearance-none text-base cursor-pointer"
                            value={k8sConfig.version}
                            onChange={(e) => setK8sConfig({...k8sConfig, version: e.target.value})}
                         >
                            {K8S_VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
                         </select>
                         <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
                      </div>
                   </div>
                </div>

                {/* Section 2: Features (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">High Availability</h3>
                      <label className="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl cursor-pointer hover:border-plasma-400 dark:hover:border-plasma-500 transition-colors group">
                         <div className="flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 group-hover:border-plasma-500 transition-colors">
                               {k8sConfig.ha && <Check size={14} className="text-plasma-600" />}
                            </div>
                            <input 
                               type="checkbox" 
                               checked={k8sConfig.ha} 
                               onChange={(e) => setK8sConfig({...k8sConfig, ha: e.target.checked})} 
                               className="hidden"
                            />
                            <span className="text-gray-700 dark:text-gray-200 font-medium">Enable High Availability</span>
                         </div>
                         <div className="text-gray-400" title="Redundant control plane for 99.99% uptime">
                            <Info size={18} />
                         </div>
                      </label>
                   </div>
                   <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Firewall</h3>
                      <label className="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl cursor-pointer hover:border-plasma-400 dark:hover:border-plasma-500 transition-colors group">
                         <div className="flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 group-hover:border-plasma-500 transition-colors">
                               {k8sConfig.firewall && <Check size={14} className="text-plasma-600" />}
                            </div>
                            <input 
                               type="checkbox" 
                               checked={k8sConfig.firewall} 
                               onChange={(e) => setK8sConfig({...k8sConfig, firewall: e.target.checked})} 
                               className="hidden"
                            />
                            <span className="text-gray-700 dark:text-gray-200 font-medium">Enable Firewall</span>
                         </div>
                         <div className="text-gray-400" title="Restrict access to cluster API">
                            <Info size={18} />
                         </div>
                      </label>
                   </div>
                </div>

                {/* Section 3: Cluster Configuration (Node Pools Card) */}
                <div className="space-y-4">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Cluster Configuration</h3>
                   
                   <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Node Pool Type</label>
                            <div className="relative">
                               <select 
                                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white appearance-none cursor-pointer"
                                  value={k8sConfig.poolType}
                                  onChange={(e) => setK8sConfig({...k8sConfig, poolType: e.target.value})}
                               >
                                  <option>Optimized Cloud</option>
                                  <option>Cloud Compute</option>
                                  <option>High Frequency</option>
                               </select>
                               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Node Pool Plan</label>
                            <div className="relative">
                               <select 
                                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white font-mono text-sm appearance-none cursor-pointer"
                                  value={k8sConfig.poolPlan}
                                  onChange={(e) => setK8sConfig({...k8sConfig, poolPlan: e.target.value})}
                               >
                                  {PLANS_DATA.filter(p => p.category === 'cloud_compute').map(p => (
                                     <option key={p.id} value={p.id}>
                                        ${p.price}/mo &nbsp; | &nbsp; {p.vcpu} vCPU &nbsp; {p.ram} &nbsp; {p.disk}
                                     </option>
                                  ))}
                               </select>
                               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4 border-t border-gray-100 dark:border-neutral-700">
                         <div className="w-full md:flex-1">
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Label (required)</label>
                            <input 
                               type="text" 
                               className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white placeholder-gray-400" 
                               placeholder="nodepool-1"
                            />
                         </div>
                         
                         <div className="w-full md:w-auto">
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Number of Nodes</label>
                            <div className="flex items-center gap-2">
                               <div className="flex items-center bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
                                  <button 
                                     className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-neutral-700"
                                     onClick={() => setK8sConfig(prev => ({...prev, nodeCount: Math.max(1, prev.nodeCount - 1)}))}
                                  >
                                     <Minus size={18} />
                                  </button>
                                  <div className="w-16 h-12 flex items-center justify-center font-bold text-lg dark:text-white">
                                     {k8sConfig.nodeCount}
                                  </div>
                                  <button 
                                     className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-300 border-l border-gray-200 dark:border-neutral-700"
                                     onClick={() => setK8sConfig(prev => ({...prev, nodeCount: prev.nodeCount + 1}))}
                                  >
                                     <Plus size={18} />
                                  </button>
                               </div>
                               <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                  <Trash2 size={20} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <Button variant="secondary" className="dark:bg-neutral-900 dark:text-white dark:border-neutral-700 py-3 px-6 rounded-xl text-sm font-bold hover:shadow-sm">
                      Add Another Node Pool
                   </Button>
                </div>

                {/* Section 4: Location */}
                <div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cluster Location</h3>
                   <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden h-[450px]">
                      {/* Region Sidebar */}
                      <div className="sm:w-1/4 flex sm:flex-col gap-0 overflow-x-auto sm:overflow-visible bg-gray-50 dark:bg-neutral-900 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-neutral-700">
                         {REGIONS.map(region => (
                            <button
                               key={region}
                               onClick={() => setActiveRegion(region)}
                               className={`
                                  px-6 py-4 text-sm font-bold text-left transition-all whitespace-nowrap border-l-4
                                  ${activeRegion === region 
                                     ? 'bg-white dark:bg-neutral-800 text-plasma-600 dark:text-plasma-400 border-plasma-600' 
                                     : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-white'}
                               `}
                            >
                               {region}
                            </button>
                         ))}
                      </div>

                      {/* Cities Grid */}
                      <div className="sm:w-3/4 overflow-y-auto custom-scrollbar p-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {LOCATIONS.filter(loc => loc.region === activeRegion).map(loc => (
                               <div 
                                  key={loc.id}
                                  onClick={() => setK8sConfig({...k8sConfig, location: loc.id})}
                                  className={`
                                     p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 hover:shadow-md
                                     ${k8sConfig.location === loc.id 
                                        ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 shadow-sm' 
                                        : 'border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                                  `}
                               >
                                  <span className="text-3xl">{loc.flag}</span>
                                  <div>
                                     <div className={`font-bold text-sm ${k8sConfig.location === loc.id ? 'text-plasma-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>{loc.name}</div>
                                     <div className={`text-[10px] uppercase font-bold tracking-wide mt-0.5 ${k8sConfig.location === loc.id ? 'text-plasma-600 dark:text-plasma-300' : 'text-gray-400 dark:text-gray-500'}`}>{loc.region}</div>
                                  </div>
                                  {k8sConfig.location === loc.id && <CheckCircle2 size={18} className="ml-auto text-plasma-600 dark:text-plasma-400" />}
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Section 5: VPC */}
                <div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">VPC Network</h3>
                   <div className="relative max-w-2xl">
                      <select 
                         className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white appearance-none cursor-pointer"
                         value={k8sConfig.vpc}
                         onChange={(e) => setK8sConfig({...k8sConfig, vpc: e.target.value})}
                      >
                         <option value="default">Create New VPC</option>
                         <option value="vpc-1">vpc-prod-network</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
                   </div>
                </div>

                {/* Deployment Summary Footer (Inline) */}
                <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
                    <div className="flex items-center gap-6">
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Estimated Cost</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-white">${k8sCost.toFixed(2)}</span>
                                <span className="text-sm font-medium text-gray-400">/mo</span>
                            </div>
                        </div>
                        <div className="hidden md:block h-10 w-px bg-neutral-700"></div>
                        <div className="hidden md:block">
                            <div className="text-xs text-gray-400">Hourly Rate</div>
                            <div className="text-sm font-medium text-gray-300">${(k8sCost / 730).toFixed(2)}/hr</div>
                        </div>
                    </div>
                    <Button size="lg" className="w-full md:w-auto px-10 py-4 text-base font-bold bg-plasma-600 hover:bg-plasma-500 border-none text-white shadow-lg shadow-plasma-500/30" onClick={handleCreateCluster} disabled={!k8sConfig.name}>
                        Deploy Now
                    </Button>
                </div>

             </div>
          </div>
       )}

       {/* Modals */}
       {deleteTarget && (
          <DeleteClusterModal 
             clusterName={deleteTarget.name}
             onClose={() => setDeleteTarget(null)}
             onConfirm={handleDeleteConfirm}
          />
       )}

       {scaleTarget && (
          <ScaleClusterModal 
             cluster={scaleTarget}
             onClose={() => setScaleTarget(null)}
             onScale={handleScaleConfirm}
          />
       )}

       {manageTarget && (
          <ManageClusterModal 
             cluster={manageTarget}
             onClose={() => setManageTarget(null)}
             onUpdate={handleClusterUpdate}
          />
       )}
    </div>
  );
};
