
import React, { useState, useMemo } from 'react';
import { 
  Workflow, Plus, MoreVertical, Activity, Settings, Trash2, X, Save, 
  Server, Globe, ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle, 
  Search, ChevronDown, Check, Shield, Lock, ArrowRight, Minus 
} from 'lucide-react';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import { ProjectStatus } from '../../../types';
import { VPS_LIST, LOCATIONS, REGIONS } from '../../../constants';

// Mock Data
const LOAD_BALANCERS = [
  { id: 'lb-1', name: 'Web-Cluster-LB', ip: '10.0.0.50', region: 'New York', status: ProjectStatus.RUNNING, algorithm: 'Round Robin', instances: 3, health: 'Healthy' },
  { id: 'lb-2', name: 'API-Gateway-LB', ip: '10.0.0.51', region: 'Singapore', status: ProjectStatus.RUNNING, algorithm: 'Least Connections', instances: 2, health: 'Degraded' },
  { id: 'lb-3', name: 'Staging-LB', ip: '10.0.0.52', region: 'Frankfurt', status: ProjectStatus.STOPPED, algorithm: 'Round Robin', instances: 0, health: 'Offline' },
];

export const LoadBalancerManager: React.FC = () => {
  const [lbs, setLbs] = useState(LOAD_BALANCERS);
  const [view, setView] = useState<'list' | 'create' | 'manage' | 'nodes'>('list');
  const [selectedLb, setSelectedLb] = useState<typeof LOAD_BALANCERS[0] | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('Americas');
  const [locationSearch, setLocationSearch] = useState('');
  
  // Create Form State
  const [createForm, setCreateForm] = useState({
    label: '',
    algorithm: 'Round Robin',
    timeout: 60,
    nodes: 1,
    options: {
        httpsRedirect: false,
        proxyProtocol: false,
        stickySessions: false,
        http2: false,
        http3: false
    },
    healthCheck: {
        protocol: 'HTTP',
        port: 80,
        path: '/',
        interval: 'Standard'
    },
    locations: [] as string[], // Multi-select locations
    vpcConfig: {} as Record<string, string>, // locationId -> vpcId
    nonPublicVpc: false,
    forwardingRulesEnabled: true,
    forwardingRules: [
        { id: 1, frontendProtocol: 'HTTP', frontendPort: 80, backendProtocol: 'HTTP', backendPort: 80 }
    ],
    firewallEnabled: true,
    firewallRules: [] as { id: number; port: string; ipType: string; source: string }[],
    newFirewallRule: { port: '', ipType: 'IPv4', source: '' },
    sslEnabled: false,
    sslType: 'cert'
  });
  
  // Mock Nodes State
  const [attachedNodes, setAttachedNodes] = useState(VPS_LIST.slice(0, 3)); 

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleCreate = () => {
    // Determine primary region from first selected location
    const firstLocId = createForm.locations[0];
    const regionName = LOCATIONS.find(l => l.id === firstLocId)?.name || 'Unknown';

    setLbs([...lbs, {
      id: `lb-${Date.now()}`,
      name: createForm.label,
      ip: 'Pending...',
      region: regionName + (createForm.locations.length > 1 ? ` (+${createForm.locations.length - 1})` : ''),
      status: ProjectStatus.PROVISIONING,
      algorithm: createForm.algorithm,
      instances: 0,
      health: 'Initializing'
    }]);
    setView('list');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this Load Balancer?')) {
        setLbs(prev => prev.filter(lb => lb.id !== id));
    }
    setActiveDropdown(null);
  };

  const handleManage = (lb: typeof LOAD_BALANCERS[0]) => {
      setSelectedLb(lb);
      setView('manage');
      setActiveDropdown(null);
  };

  const handleNodes = (lb: typeof LOAD_BALANCERS[0]) => {
      setSelectedLb(lb);
      setView('nodes');
      setActiveDropdown(null);
  };
  
  const handleBack = () => {
      setView('list');
      setSelectedLb(null);
  };

  const handleDetachNode = (id: string) => {
      setAttachedNodes(prev => prev.filter(n => n.id !== id));
  };

  // Helper to toggle location selection
  const toggleLocation = (locId: string) => {
      setCreateForm(prev => {
          const exists = prev.locations.includes(locId);
          let newLocations;
          if (exists) {
              newLocations = prev.locations.filter(id => id !== locId);
          } else {
              newLocations = [...prev.locations, locId];
          }
          return { ...prev, locations: newLocations };
      });
  };

  const addForwardingRule = () => {
      setCreateForm(prev => ({
          ...prev,
          forwardingRules: [...prev.forwardingRules, { id: Date.now(), frontendProtocol: 'HTTP', frontendPort: 8080, backendProtocol: 'HTTP', backendPort: 8080 }]
      }));
  };

  const removeForwardingRule = (id: number) => {
      setCreateForm(prev => ({
          ...prev,
          forwardingRules: prev.forwardingRules.filter(r => r.id !== id)
      }));
  };

  const addFirewallRule = () => {
      if (!createForm.newFirewallRule.port) return;
      setCreateForm(prev => ({
          ...prev,
          firewallRules: [...prev.firewallRules, { id: Date.now(), ...prev.newFirewallRule }],
          newFirewallRule: { port: '', ipType: 'IPv4', source: '' }
      }));
  };
  
  const removeFirewallRule = (id: number) => {
      setCreateForm(prev => ({
          ...prev,
          firewallRules: prev.firewallRules.filter(r => r.id !== id)
      }));
  };

  const totalCost = useMemo(() => {
      // $10 per node per location (simplified model)
      return (createForm.nodes * 10 * Math.max(1, createForm.locations.length)) + (createForm.sslEnabled ? 5 : 0);
  }, [createForm.nodes, createForm.sslEnabled, createForm.locations]);

  // VIEW: CREATE WIZARD
  if (view === 'create') {
      return (
        <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-right-4 duration-300">
             {/* Header */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                        <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Load Balancer</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="text-xs dark:bg-neutral-800 dark:text-gray-300">Documentation</Button>
                    <Button variant="secondary" size="sm" className="text-xs dark:bg-neutral-800 dark:text-gray-300">API</Button>
                </div>
             </div>

             <div className="flex flex-col lg:flex-row gap-8">
                 {/* Main Form */}
                 <div className="flex-1 space-y-8">
                     
                     {/* Basics */}
                     <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-neutral-700 pb-4 mb-4">Load Balancer Basics</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Label</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                                    placeholder="Enter label"
                                    value={createForm.label}
                                    onChange={(e) => setCreateForm({...createForm, label: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Algorithm</label>
                                <select 
                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                                    value={createForm.algorithm}
                                    onChange={(e) => setCreateForm({...createForm, algorithm: e.target.value})}
                                >
                                    <option>Round Robin</option>
                                    <option>Least Connections</option>
                                    <option>IP Hash</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Timeout (seconds)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                                    value={createForm.timeout}
                                    onChange={(e) => setCreateForm({...createForm, timeout: parseInt(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Number of Nodes</label>
                                <div className="flex items-center">
                                    <button 
                                        className="p-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-l-xl hover:bg-gray-50 dark:hover:bg-neutral-800"
                                        onClick={() => setCreateForm(prev => ({...prev, nodes: Math.max(1, prev.nodes - 1)}))}
                                    >
                                        <Minus size={16} className="dark:text-white"/>
                                    </button>
                                    <div className="w-full py-3 text-center bg-white dark:bg-neutral-900 border-y border-gray-200 dark:border-neutral-700 font-bold dark:text-white">
                                        {createForm.nodes}
                                    </div>
                                    <button 
                                        className="p-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-r-xl hover:bg-gray-50 dark:hover:bg-neutral-800"
                                        onClick={() => setCreateForm(prev => ({...prev, nodes: prev.nodes + 1}))}
                                    >
                                        <Plus size={16} className="dark:text-white"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Configuration Options</label>
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={createForm.options.httpsRedirect}
                                        onChange={(e) => setCreateForm({...createForm, options: {...createForm.options, httpsRedirect: e.target.checked}})}
                                        className="w-5 h-5 accent-plasma-600 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" 
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Force HTTP to HTTPS</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={createForm.options.proxyProtocol}
                                        onChange={(e) => setCreateForm({...createForm, options: {...createForm.options, proxyProtocol: e.target.checked}})}
                                        className="w-5 h-5 accent-plasma-600 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" 
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Proxy Protocol</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={createForm.options.stickySessions}
                                        onChange={(e) => setCreateForm({...createForm, options: {...createForm.options, stickySessions: e.target.checked}})}
                                        className="w-5 h-5 accent-plasma-600 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" 
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Sticky Sessions</span>
                                </label>
                            </div>
                        </div>
                     </div>

                     {/* Health Checks */}
                     <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-neutral-700 pb-4 mb-4">Health Checks</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Protocol</label>
                                <select 
                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                                    value={createForm.healthCheck.protocol}
                                    onChange={(e) => setCreateForm({...createForm, healthCheck: {...createForm.healthCheck, protocol: e.target.value}})}
                                >
                                    <option>HTTP</option>
                                    <option>TCP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Port</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                                    value={createForm.healthCheck.port}
                                    onChange={(e) => setCreateForm({...createForm, healthCheck: {...createForm.healthCheck, port: parseInt(e.target.value)}})}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Path</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                                value={createForm.healthCheck.path}
                                onChange={(e) => setCreateForm({...createForm, healthCheck: {...createForm.healthCheck, path: e.target.value}})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Health Check Intervals</label>
                            <select 
                                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white"
                                value={createForm.healthCheck.interval}
                                onChange={(e) => setCreateForm({...createForm, healthCheck: {...createForm.healthCheck, interval: e.target.value}})}
                            >
                                <option>Standard</option>
                                <option>Aggressive</option>
                                <option>Relaxed</option>
                            </select>
                        </div>
                     </div>

                     {/* Location */}
                     <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-neutral-700">
                           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Locations ({createForm.locations.length})</h3>
                           <div className="relative">
                               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                               <input 
                                  type="text" 
                                  placeholder="Search or filter..." 
                                  value={locationSearch}
                                  onChange={(e) => setLocationSearch(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white text-sm"
                               />
                           </div>
                        </div>
                        
                        <div className="flex h-[400px]">
                           {/* Region Tabs */}
                           <div className="w-1/4 border-r border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
                              {REGIONS.map(region => (
                                 <button
                                    key={region}
                                    onClick={() => setActiveRegion(region)}
                                    className={`
                                       w-full px-6 py-4 text-sm font-bold text-left transition-all border-l-4
                                       ${activeRegion === region 
                                          ? 'bg-white dark:bg-neutral-800 text-plasma-600 dark:text-plasma-400 border-plasma-600' 
                                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-neutral-800/50'}
                                    `}
                                 >
                                    {region}
                                 </button>
                              ))}
                           </div>
                           
                           {/* Location List */}
                           <div className="w-3/4 overflow-y-auto p-4 space-y-2">
                              {LOCATIONS
                                .filter(l => l.region === activeRegion)
                                .filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase()))
                                .map(loc => {
                                   const isSelected = createForm.locations.includes(loc.id);
                                   return (
                                   <label 
                                     key={loc.id} 
                                     className={`
                                       flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm
                                       ${isSelected 
                                          ? 'bg-plasma-50 dark:bg-plasma-900/20 border-plasma-500 ring-1 ring-plasma-500 dark:ring-plasma-500 dark:border-plasma-500' 
                                          : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'}
                                     `}
                                   >
                                      <input 
                                        type="checkbox" 
                                        name="location" 
                                        checked={isSelected}
                                        onChange={() => toggleLocation(loc.id)}
                                        className="w-5 h-5 accent-plasma-600 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-plasma-600 focus:ring-plasma-500"
                                      />
                                      <span className="text-2xl">{loc.flag}</span>
                                      <div>
                                         <div className={`font-bold text-sm ${isSelected ? 'text-plasma-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>
                                            {loc.name}, {loc.id.split('-')[0].toUpperCase()}
                                         </div>
                                      </div>
                                   </label>
                                )})}
                           </div>
                        </div>
                     </div>

                     {/* VPC */}
                     <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={createForm.nonPublicVpc} 
                                  onChange={(e) => setCreateForm({...createForm, nonPublicVpc: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plasma-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Non-Public VPC Network</span>
                            </label>
                        </div>
                        
                        {/* Only show VPC config if checkbox is ON */}
                        {createForm.nonPublicVpc && (
                           <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                              {createForm.locations.length > 0 ? (
                                 <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                       <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                                          <tr>
                                             <th className="px-6 py-3">Location</th>
                                             <th className="px-6 py-3">Network</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                          {createForm.locations.map(locId => {
                                             const loc = LOCATIONS.find(l => l.id === locId);
                                             return (
                                                <tr key={locId} className="bg-white dark:bg-neutral-800">
                                                   <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                      {loc?.name}, {locId.split('-')[0].toUpperCase()}
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <select 
                                                         className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white"
                                                         value={createForm.vpcConfig[locId] || 'default'}
                                                         onChange={(e) => setCreateForm(prev => ({
                                                            ...prev, 
                                                            vpcConfig: { ...prev.vpcConfig, [locId]: e.target.value }
                                                         }))}
                                                      >
                                                         <option value="default">Select VPC Network</option>
                                                         <option value="create_new">Create New VPC</option>
                                                      </select>
                                                   </td>
                                                </tr>
                                             );
                                          })}
                                       </tbody>
                                    </table>
                                 </div>
                              ) : (
                                 <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl text-center">
                                    Select locations to configure VPC networks.
                                 </div>
                              )}
                           </div>
                        )}
                     </div>

                     {/* Forwarding Rules */}
                     <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-3">
                               <label className="relative inline-flex items-center cursor-pointer">
                                   <input 
                                     type="checkbox" 
                                     checked={createForm.forwardingRulesEnabled} 
                                     onChange={(e) => setCreateForm({...createForm, forwardingRulesEnabled: e.target.checked})}
                                     className="sr-only peer" 
                                   />
                                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plasma-600"></div>
                                   <span className="ml-3 text-lg font-bold text-gray-900 dark:text-white">Forwarding Rules</span>
                               </label>
                           </div>
                        </div>

                        {createForm.forwardingRulesEnabled && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-neutral-700">
                                            <tr>
                                                <th className="px-4 py-3">Frontend Protocol</th>
                                                <th className="px-4 py-3">Frontend Port</th>
                                                <th className="px-4 py-3"></th>
                                                <th className="px-4 py-3">Backend Protocol</th>
                                                <th className="px-4 py-3">Backend Port</th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                            {createForm.forwardingRules.map((rule) => (
                                                <tr key={rule.id} className="bg-white dark:bg-neutral-800">
                                                    <td className="p-3">
                                                        <select className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white font-medium">
                                                            <option>HTTP</option>
                                                            <option>HTTPS</option>
                                                            <option>TCP</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3">
                                                        <input type="number" className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white font-medium" defaultValue={rule.frontendPort} />
                                                    </td>
                                                    <td className="p-3 text-center"><ArrowRight size={16} className="text-gray-400 mx-auto"/></td>
                                                    <td className="p-3">
                                                        <select className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white font-medium">
                                                            <option>HTTP</option>
                                                            <option>HTTPS</option>
                                                            <option>TCP</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3">
                                                        <input type="number" className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white font-medium" defaultValue={rule.backendPort} />
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {createForm.forwardingRules.length > 1 ? (
                                                           <button onClick={() => removeForwardingRule(rule.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                                                        ) : (
                                                           <button onClick={addForwardingRule} className="px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">Add +</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {createForm.forwardingRules.length > 1 && (
                                        <div className="p-3 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 flex justify-end">
                                            <Button size="sm" variant="secondary" onClick={addForwardingRule} className="dark:bg-neutral-800 dark:text-white">
                                                <Plus size={14} className="mr-1"/> Add Rule
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 mt-6">
                                     <p className="text-sm text-gray-500 dark:text-gray-400">Forwarding options</p>
                                     <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-plasma-600 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" checked={createForm.options.http2} onChange={(e) => setCreateForm({...createForm, options: {...createForm.options, http2: e.target.checked}})} />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Enable HTTP/2</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-plasma-600 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" checked={createForm.options.http3} onChange={(e) => setCreateForm({...createForm, options: {...createForm.options, http3: e.target.checked}})} />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Enable HTTP/3</span>
                                        </label>
                                     </div>
                                </div>
                            </div>
                        )}
                     </div>
                     
                     {/* Firewall Rules */}
                     <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 space-y-6">
                         <div className="flex items-center gap-3">
                             <label className="relative inline-flex items-center cursor-pointer">
                                 <input 
                                   type="checkbox" 
                                   checked={createForm.firewallEnabled} 
                                   onChange={(e) => setCreateForm({...createForm, firewallEnabled: e.target.checked})}
                                   className="sr-only peer" 
                                 />
                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plasma-600"></div>
                                 <span className="ml-3 text-lg font-bold text-gray-900 dark:text-white">Firewall Rules</span>
                             </label>
                         </div>
                         
                         {createForm.firewallEnabled && (
                            <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                               <div className="grid grid-cols-12 bg-gray-50 dark:bg-neutral-900 text-sm font-bold text-gray-500 dark:text-gray-400 p-4 border-b border-gray-200 dark:border-neutral-700">
                                  <div className="col-span-3">Port</div>
                                  <div className="col-span-3">IP Type</div>
                                  <div className="col-span-6">Source</div>
                               </div>
                               
                               {/* Existing Rules */}
                               {createForm.firewallRules.map((rule) => (
                                  <div key={rule.id} className="grid grid-cols-12 p-4 border-b border-gray-100 dark:border-neutral-700 items-center gap-4 bg-white dark:bg-neutral-800">
                                     <div className="col-span-3 text-sm font-medium dark:text-white">{rule.port}</div>
                                     <div className="col-span-3 text-sm text-gray-600 dark:text-gray-300">{rule.ipType}</div>
                                     <div className="col-span-5 text-sm text-gray-600 dark:text-gray-300">{rule.source}</div>
                                     <div className="col-span-1 text-right">
                                        <button onClick={() => removeFirewallRule(rule.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"><Trash2 size={16}/></button>
                                     </div>
                                  </div>
                               ))}

                               {/* Add Rule Row */}
                               <div className="grid grid-cols-12 p-4 items-center gap-4 bg-gray-50/50 dark:bg-neutral-900/50">
                                  <div className="col-span-3">
                                     <input 
                                        type="text" 
                                        placeholder="Port" 
                                        className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white text-sm"
                                        value={createForm.newFirewallRule.port}
                                        onChange={(e) => setCreateForm(prev => ({...prev, newFirewallRule: {...prev.newFirewallRule, port: e.target.value}}))}
                                     />
                                  </div>
                                  <div className="col-span-3">
                                     <select 
                                        className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white text-sm"
                                        value={createForm.newFirewallRule.ipType}
                                        onChange={(e) => setCreateForm(prev => ({...prev, newFirewallRule: {...prev.newFirewallRule, ipType: e.target.value}}))}
                                     >
                                        <option>IPv4</option>
                                        <option>IPv6</option>
                                     </select>
                                  </div>
                                  <div className="col-span-4">
                                     <input 
                                        type="text" 
                                        placeholder="Specify source (name or IP)" 
                                        className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none dark:text-white text-sm"
                                        value={createForm.newFirewallRule.source}
                                        onChange={(e) => setCreateForm(prev => ({...prev, newFirewallRule: {...prev.newFirewallRule, source: e.target.value}}))}
                                     />
                                  </div>
                                  <div className="col-span-2 text-right">
                                     <button 
                                       onClick={addFirewallRule}
                                       className="px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors w-full"
                                     >
                                        Add +
                                     </button>
                                  </div>
                               </div>
                            </div>
                         )}
                         <p className="text-xs text-gray-500 dark:text-gray-400">Note: Port range 65300 to 65310 is used internally. Specify "cloudflare" as your source to utilize Cloudflare IPs.</p>
                     </div>

                     {/* SSL */}
                     <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3">
                             <label className="relative inline-flex items-center cursor-pointer">
                                 <input 
                                   type="checkbox" 
                                   checked={createForm.sslEnabled} 
                                   onChange={(e) => setCreateForm({...createForm, sslEnabled: e.target.checked})}
                                   className="sr-only peer" 
                                 />
                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plasma-600"></div>
                                 <span className="ml-3 text-lg font-bold text-gray-900 dark:text-white">SSL</span>
                             </label>
                         </div>

                         {createForm.sslEnabled && (
                             <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                 <div>
                                     <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">SSL Type</label>
                                     <div className="space-y-3">
                                         <label className="flex items-center gap-3 cursor-pointer group">
                                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${createForm.sslType === 'cert' ? 'border-plasma-600' : 'border-gray-300 dark:border-neutral-600'}`}>
                                                 {createForm.sslType === 'cert' && <div className="w-2.5 h-2.5 bg-plasma-600 rounded-full"></div>}
                                             </div>
                                             <input type="radio" name="sslType" checked={createForm.sslType === 'cert'} onChange={() => setCreateForm({...createForm, sslType: 'cert'})} className="hidden" />
                                             <span className="text-sm font-bold text-gray-900 dark:text-white">SSL Certificate</span>
                                         </label>
                                         <label className="flex items-center gap-3 cursor-pointer group">
                                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${createForm.sslType === 'auto' ? 'border-plasma-600' : 'border-gray-300 dark:border-neutral-600'}`}>
                                                 {createForm.sslType === 'auto' && <div className="w-2.5 h-2.5 bg-plasma-600 rounded-full"></div>}
                                             </div>
                                             <input type="radio" name="sslType" checked={createForm.sslType === 'auto'} onChange={() => setCreateForm({...createForm, sslType: 'auto'})} className="hidden" />
                                             <span className="text-sm font-bold text-gray-900 dark:text-white">Auto SSL</span>
                                         </label>
                                     </div>
                                 </div>
                                 
                                 {createForm.sslType === 'cert' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Private Key</label>
                                            <textarea className="w-full h-32 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white font-mono text-xs resize-none focus:border-plasma-500 focus:ring-1 focus:ring-plasma-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Certificate</label>
                                            <textarea className="w-full h-32 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white font-mono text-xs resize-none focus:border-plasma-500 focus:ring-1 focus:ring-plasma-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Certificate Chain</label>
                                            <textarea className="w-full h-32 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white font-mono text-xs resize-none focus:border-plasma-500 focus:ring-1 focus:ring-plasma-500 transition-all" />
                                        </div>
                                    </div>
                                 )}
                             </div>
                         )}
                     </div>

                 </div>

                 {/* Sticky Summary Sidebar */}
                 <div className="w-full lg:w-80 shrink-0">
                     <div className="sticky top-6 space-y-6">
                        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-lg">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Summary</h3>
                            
                            <div className="space-y-1 text-sm pb-4 border-b border-gray-100 dark:border-neutral-700 mb-4">
                               <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Solution</div>
                               <div className="font-bold text-gray-900 dark:text-white">Load Balancer</div>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Label</span>
                                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[100px]">{createForm.label || '...'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Algorithm</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{createForm.algorithm}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Timeout</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{createForm.timeout} seconds</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Health Checks</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{createForm.healthCheck.interval}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Nodes</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{createForm.nodes}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Node Cost</span>
                                    <span className="font-medium text-gray-900 dark:text-white">$10.00</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-700">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">Locations</div>
                                <div className="space-y-1">
                                   {createForm.locations.length > 0 ? createForm.locations.map(locId => {
                                      const loc = LOCATIONS.find(l => l.id === locId);
                                      return (
                                         <div key={locId} className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                            <span className="text-lg">{loc?.flag}</span>
                                            {loc?.name}, {locId.split('-')[0].toUpperCase()}
                                         </div>
                                      );
                                   }) : (
                                      <span className="text-sm text-gray-500 italic">Select Locations</span>
                                   )}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Cost</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalCost.toFixed(2)}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                            </div>

                            <Button className="w-full mt-6 shadow-lg shadow-plasma-500/20 py-3" onClick={handleCreate} disabled={!createForm.label || createForm.locations.length === 0}>
                                Create Load Balancer +
                            </Button>
                        </div>
                     </div>
                 </div>
             </div>
        </div>
      );
  }

  // MANAGED VIEW
  if (view === 'manage' && selectedLb) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Same Manage Code as before... */}
             <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                    <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {selectedLb.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Settings</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* General Configuration */}
                    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Settings size={20} className="text-plasma-600"/> General Configuration
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Algorithm</label>
                                    <select className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white">
                                        <option>Round Robin</option>
                                        <option>Least Connections</option>
                                        <option>IP Hash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Protocol</label>
                                    <select className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white">
                                        <option>HTTP</option>
                                        <option>HTTPS</option>
                                        <option>TCP</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900/50">
                                    <div>
                                        <span className="font-bold text-gray-900 dark:text-white block">Sticky Sessions</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Route requests from same client to same instance.</span>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5 accent-plasma-600 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" />
                                </label>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="gap-2"><Save size={16}/> Save Changes</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-plasma-600 rounded-3xl p-6 text-white shadow-lg">
                        <h3 className="font-bold mb-4">Status Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-white/20 pb-2">
                                <span className="opacity-80">Health Status</span>
                                <span className="font-bold flex items-center gap-1"><CheckCircle2 size={16}/> {selectedLb.health}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/20 pb-2">
                                <span className="opacity-80">Public IP</span>
                                <span className="font-mono">{selectedLb.ip}</span>
                            </div>
                             <div className="flex justify-between border-b border-white/20 pb-2">
                                <span className="opacity-80">Region</span>
                                <span>{selectedLb.region}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )
  }

  if (view === 'nodes' && selectedLb) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                        <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {selectedLb.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Attached Nodes</span>
                        </h1>
                    </div>
                </div>
                <Button>
                    <Plus size={16} className="mr-2"/> Attach Node
                </Button>
            </div>

            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[700px]">
                        <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Instance Name</th>
                                <th className="px-6 py-4">Private IP</th>
                                <th className="px-6 py-4">Health Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                            {attachedNodes.map((node) => (
                                <tr key={node.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg text-gray-500">
                                                <Server size={16} />
                                            </div>
                                            {node.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{node.ip}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full w-fit text-xs">
                                            <CheckCircle2 size={14} /> Healthy
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                          onClick={() => handleDetachNode(node.id)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                                        >
                                            <X size={16}/> Detach
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )
  }

  // LIST VIEW
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Load Balancers</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">High availability traffic distribution.</p>
          </div>
          <Button onClick={() => setView('create')}>
             <Plus size={16} className="mr-2"/> Add Load Balancer
          </Button>
       </div>
       
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Workflow size={20} className="text-plasma-600"/> Active Balancers
              </h3>
              <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold">{lbs.length} Resources</span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left text-sm min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                      <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">IP Address</th>
                          <th className="px-6 py-4">Region</th>
                          <th className="px-6 py-4">Configuration</th>
                          <th className="px-6 py-4">Health</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                      {lbs.map((lb) => (
                          <tr key={lb.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative">
                              <td className="px-6 py-4">
                                  <div className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                          <Workflow size={16} />
                                      </div>
                                      {lb.name}
                                  </div>
                                  <div className="text-xs text-gray-500 ml-11 mt-1">{lb.status}</div>
                              </td>
                              <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400 text-xs">
                                  {lb.ip}
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                     <Globe size={14} className="text-gray-400"/> {lb.region}
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="text-xs">
                                      <span className="block text-gray-500 dark:text-gray-400">Algorithm: {lb.algorithm}</span>
                                      <span className="block text-gray-500 dark:text-gray-400">Instances: {lb.instances}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 w-fit ${
                                      lb.health === 'Healthy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
                                      lb.health === 'Degraded' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  }`}>
                                      {lb.health === 'Healthy' && <CheckCircle2 size={12}/>}
                                      {lb.health === 'Degraded' && <AlertTriangle size={12}/>}
                                      {lb.health}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right relative">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleDropdown(lb.id); }}
                                    className={`p-2 rounded-lg transition-colors ${activeDropdown === lb.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                  >
                                      <MoreVertical size={18} className="rotate-90"/>
                                  </button>
                                  
                                  {activeDropdown === lb.id && (
                                      <div className="absolute right-8 top-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                                          <button 
                                            onClick={() => handleManage(lb)}
                                            className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                          >
                                              <Settings size={14} /> Manage
                                          </button>
                                          <button 
                                            onClick={() => handleNodes(lb)}
                                            className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                          >
                                              <Server size={14} /> Nodes
                                          </button>
                                          <button 
                                            onClick={() => handleDelete(lb.id)}
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
