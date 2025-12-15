
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Plus, CheckCircle2, ChevronRight, ChevronLeft, Minus, Search, 
  Check, Key, FileCode, Shield, Info, Server, Cpu 
} from 'lucide-react';
import { Button } from '../../Button';
import { 
  COMPUTE_TYPES, LOCATIONS, REGIONS, PLANS_DATA, PLAN_CATEGORIES, 
  IMAGES, SSH_KEYS, STARTUP_SCRIPTS, FIREWALL_GROUPS 
} from '../../../constants';

interface DeployServerModalProps {
  onClose: () => void;
  onDeploy?: (instance: any) => void;
}

export const DeployServerModal: React.FC<DeployServerModalProps> = ({ onClose, onDeploy }) => {
  const [deployStep, setDeployStep] = useState(1);
  const [activeRegion, setActiveRegion] = useState('Americas');
  const [planCategory, setPlanCategory] = useState('all');
  const [planSearch, setPlanSearch] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  
  const [deployConfig, setDeployConfig] = useState({
    type: 'dedicated',
    location: 'us-a', // Atlanta
    imageType: 'os' as 'os' | 'apps' | 'iso_ipxe' | 'iso_library' | 'backup' | 'snapshot',
    imageId: 'alma',
    isoOption: 'my_iso', // for ISO/IPXE tab
    planId: 'voc-c-1c-2gb-50s',
    quantity: 1,
    features: {
      ipv4: true,
      ipv6: false,
      vpc: false,
      backups: true,
      ddos: false,
      limitedUser: false,
      cloudInit: false
    },
    sshKey: '',
    startupScript: '',
    firewallGroup: '',
    hostname: '',
    label: ''
  });

  // Filter Plans Logic
  const filteredPlans = useMemo(() => {
    return PLANS_DATA.filter(plan => {
      const matchesCategory = planCategory === 'all' || plan.category === planCategory;
      const matchesSearch = plan.name.toLowerCase().includes(planSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [planCategory, planSearch]);

  // Calculate Total Cost
  const totalCost = useMemo(() => {
    const planPrice = PLANS_DATA.find(p => p.id === deployConfig.planId)?.price || 0;
    
    // Check for extra cost in OS/App
    const osImage = IMAGES.os.find(i => i.id === deployConfig.imageId);
    const appImage = IMAGES.apps.find(i => i.id === deployConfig.imageId);
    const imageCost = (deployConfig.imageType === 'os' ? osImage?.extraCost : deployConfig.imageType === 'apps' ? appImage?.extraCost : 0) || 0;

    let addonCost = 0;
    if (deployConfig.features.backups) addonCost += planPrice * 0.2; // 20% for backups
    if (deployConfig.features.ddos) addonCost += 10; // Flat $10

    return (planPrice + imageCost + addonCost) * deployConfig.quantity;
  }, [deployConfig]);

  const updateFeature = (key: keyof typeof deployConfig.features) => {
    setDeployConfig(prev => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] }
    }));
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    
    // Simulate API delay
    setTimeout(() => {
        if (onDeploy) {
            const plan = PLANS_DATA.find(p => p.id === deployConfig.planId);
            const location = LOCATIONS.find(l => l.id === deployConfig.location);
            const image = IMAGES.os.find(i => i.id === deployConfig.imageId) || IMAGES.apps.find(i => i.id === deployConfig.imageId);

            // Create new instance object
            const newInstance = {
                id: `vps-${Date.now()}`,
                name: deployConfig.hostname || deployConfig.planId,
                plan: plan?.name || deployConfig.planId,
                os: image?.name || 'Custom OS',
                osIcon: image?.icon,
                ip: 'Allocating...',
                region: deployConfig.location,
                flag: location?.flag || '🏳️',
                cpu: 0,
                ram: 0,
                disk: 0,
                status: 'PROVISIONING',
                uptime: '-',
                tags: ['new'],
                cost: totalCost / deployConfig.quantity,
                backup: deployConfig.features.backups ? 'Enabled' : 'Disabled',
                firewall: deployConfig.firewallGroup ? 'Custom' : 'Default'
            };
            onDeploy(newInstance);
        }
        setIsDeploying(false);
        onClose();
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center backdrop-blur-md md:p-4 animate-in fade-in duration-200">
       <div className="bg-white dark:bg-neutral-900 w-full md:max-w-7xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border-t md:border border-gray-200 dark:border-neutral-700">
          {/* ... [Rest of the modal UI remains identical to previous version, just ensuring handleDeploy is connected] ... */}
          
          {/* Modal Header */}
          <div className="p-4 md:p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900 sticky top-0 z-20 shrink-0">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-plasma-100 dark:bg-plasma-900/30 text-plasma-600 dark:text-plasma-400 rounded-xl">
                   <Plus size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white">Deploy New Instance</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Configure your high-performance server</p>
                </div>
             </div>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X size={20}/></button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
             
             {/* Left Column: Content (Scrollable) */}
             <div className="flex-1 flex flex-col min-w-0 relative">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-10 custom-scrollbar bg-white dark:bg-neutral-900 pb-24 md:pb-8">
                    {/* ... [Content Sections 1-7 remain exactly the same as provided previously] ... */}
                    {/* Re-including Section 1 for context, assume all other sections are present */}
                    
                    {deployStep === 1 && (
                      <div className="space-y-8 md:space-y-10 animate-in slide-in-from-right-4 duration-300">
                        {/* 1. Choose Type */}
                        <section>
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">1. Choose Type</h4>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {COMPUTE_TYPES.map(type => (
                                 <div 
                                    key={type.id}
                                    onClick={() => setDeployConfig({...deployConfig, type: type.id})}
                                    className={`
                                       p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 hover:shadow-md
                                       ${deployConfig.type === type.id 
                                          ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                                          : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                                    `}
                                 >
                                    <div className={`p-2 md:p-3 rounded-full ${deployConfig.type === type.id ? 'bg-plasma-200 dark:bg-plasma-900/50 text-plasma-700 dark:text-plasma-300' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400'}`}>
                                       <type.icon size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                       <div className={`font-bold text-xs md:text-sm ${deployConfig.type === type.id ? 'text-plasma-800 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>{type.name}</div>
                                       <div className={`text-[10px] md:text-xs mt-1 leading-snug hidden sm:block ${deployConfig.type === type.id ? 'text-plasma-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{type.desc}</div>
                                    </div>
                                    {deployConfig.type === type.id && <CheckCircle2 size={16} className="text-plasma-600 dark:text-plasma-400 absolute top-2 right-2 md:top-3 md:right-3" />}
                                 </div>
                              ))}
                           </div>
                        </section>

                        {/* 2. Choose Location */}
                        <section>
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">2. Choose Location</h4>
                           <div className="flex flex-col sm:flex-row gap-4 md:gap-6 h-[350px] md:h-[400px]">
                              {/* Region Sidebar */}
                              <div className="sm:w-1/4 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-neutral-800 pr-2">
                                 {REGIONS.map(region => (
                                    <button
                                       key={region}
                                       onClick={() => setActiveRegion(region)}
                                       className={`
                                          px-4 py-2 md:py-3 rounded-xl text-sm font-bold text-left transition-all whitespace-nowrap
                                          ${activeRegion === region 
                                             ? 'bg-plasma-600 text-white shadow-lg shadow-plasma-500/20 border-transparent dark:bg-plasma-600 dark:text-white' 
                                             : 'bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-transparent'}
                                       `}
                                    >
                                       {region}
                                    </button>
                                 ))}
                              </div>

                              {/* Cities Grid */}
                              <div className="sm:w-3/4 overflow-y-auto custom-scrollbar">
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {LOCATIONS.filter(loc => loc.region === activeRegion).map(loc => (
                                       <div 
                                          key={loc.id}
                                          onClick={() => setDeployConfig({...deployConfig, location: loc.id})}
                                          className={`
                                             p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 hover:shadow-sm
                                             ${deployConfig.location === loc.id 
                                                ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                                                : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                                          `}
                                       >
                                          <span className="text-2xl">{loc.flag}</span>
                                          <div className="min-w-0">
                                             <div className={`font-bold text-sm truncate ${deployConfig.location === loc.id ? 'text-plasma-800 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>{loc.name}</div>
                                             <div className={`text-[10px] uppercase ${deployConfig.location === loc.id ? 'text-plasma-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{loc.id}</div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </section>

                        {/* 3. Choose Plan */}
                        <section>
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">3. Choose Plan</h4>
                           
                           {/* Filter Bar */}
                           <div className="mb-4">
                              <div className="relative w-full">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                 <input 
                                    type="text" 
                                    placeholder="Filter Plans..." 
                                    value={planSearch}
                                    onChange={(e) => setPlanSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                 />
                              </div>
                           </div>

                           <div className="flex flex-col md:flex-row gap-6">
                              {/* Categories Sidebar */}
                              <div className="md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-gray-100 dark:border-neutral-800 pr-2">
                                 {PLAN_CATEGORIES.map(cat => (
                                    <button
                                       key={cat.id}
                                       onClick={() => setPlanCategory(cat.id)}
                                       className={`
                                          px-4 py-2 md:py-3 rounded-xl text-sm font-bold text-left transition-all whitespace-nowrap
                                          ${planCategory === cat.id 
                                             ? 'bg-plasma-50 dark:bg-plasma-900/30 text-plasma-700 dark:text-plasma-400 border-l-0 md:border-l-4 border-b-4 md:border-b-0 border-plasma-500' 
                                             : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 border-l-0 md:border-l-4 border-b-4 md:border-b-0 border-transparent'}
                                       `}
                                    >
                                       {cat.label}
                                    </button>
                                 ))}
                              </div>

                              {/* Plans Table */}
                              <div className="flex-1 overflow-x-auto custom-scrollbar">
                                 <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                                    <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 font-medium">
                                       <tr>
                                          <th className="p-3 rounded-tl-xl">Name</th>
                                          <th className="p-3">vCPU</th>
                                          <th className="p-3">Memory</th>
                                          <th className="p-3">Storage</th>
                                          <th className="p-3">Bandwidth</th>
                                          <th className="p-3 rounded-tr-xl">Price</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                       {filteredPlans.map(plan => (
                                          <tr 
                                             key={plan.id}
                                             onClick={() => setDeployConfig({...deployConfig, planId: plan.id})}
                                             className={`
                                                cursor-pointer transition-all duration-200
                                                ${deployConfig.planId === plan.id 
                                                   ? 'bg-plasma-50 dark:bg-plasma-500/20 shadow-inner' 
                                                   : 'hover:bg-gray-50 dark:hover:bg-neutral-800'}
                                             `}
                                          >
                                             <td className={`p-3 font-bold flex items-center gap-2 ${deployConfig.planId === plan.id ? 'text-plasma-800 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${deployConfig.planId === plan.id ? 'border-plasma-500' : 'border-gray-300 dark:border-neutral-600'}`}>
                                                   {deployConfig.planId === plan.id && <div className="w-2 h-2 rounded-full bg-plasma-500"></div>}
                                                </div>
                                                {plan.name}
                                             </td>
                                             <td className={`p-3 ${deployConfig.planId === plan.id ? 'text-plasma-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>{plan.vcpu} vCPUs</td>
                                             <td className={`p-3 ${deployConfig.planId === plan.id ? 'text-plasma-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>{plan.ram}</td>
                                             <td className={`p-3 ${deployConfig.planId === plan.id ? 'text-plasma-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>{plan.disk}</td>
                                             <td className={`p-3 ${deployConfig.planId === plan.id ? 'text-plasma-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>{plan.bandwidth}</td>
                                             <td className="p-3">
                                                <div className="font-bold text-plasma-600 dark:text-plasma-400">${plan.price}/mo</div>
                                                <div className="text-xs text-gray-400">${(plan.price / 730).toFixed(3)}/hr</div>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                                 {filteredPlans.length === 0 && (
                                    <div className="text-center py-10 text-gray-400 text-sm">
                                       No plans found matching your filter.
                                    </div>
                                 )}
                              </div>
                           </div>
                        </section>
                      </div>
                    )}

                    {deployStep === 2 && (
                        // ... [Existing Section 4, 5, 6, 7 Logic] ...
                        <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                            {/* 4. Choose Image */}
                            <section>
                               <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">4. Choose Image</h4>
                               <div className="border-b border-gray-200 dark:border-neutral-700 mb-6 overflow-x-auto no-scrollbar">
                                  <div className="flex gap-6 min-w-max">
                                     {['os', 'apps', 'iso_ipxe', 'iso_library', 'backup', 'snapshot'].map((tab) => (
                                        <button 
                                           key={tab}
                                           onClick={() => setDeployConfig({...deployConfig, imageType: tab as any})}
                                           className={`pb-3 text-sm font-bold border-b-2 transition-colors uppercase tracking-wide ${
                                              deployConfig.imageType === tab 
                                                 ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400' 
                                                 : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                           }`}
                                        >
                                           {tab.replace('_', ' ').toUpperCase()}
                                        </button>
                                     ))}
                                  </div>
                               </div>
                               
                               {/* Operating System Tab */}
                               {deployConfig.imageType === 'os' && (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
                                     {IMAGES.os.map(img => (
                                        <div 
                                           key={img.id}
                                           onClick={() => setDeployConfig({...deployConfig, imageId: img.id})}
                                           className={`
                                              relative p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 hover:shadow-sm group
                                              ${deployConfig.imageId === img.id 
                                                 ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                                                 : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                                           `}
                                        >
                                           <img src={img.icon} alt={img.name} className="w-12 h-12 object-contain mb-1" />
                                           <div className={`font-bold text-sm ${deployConfig.imageId === img.id ? 'text-plasma-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>{img.name}</div>
                                           
                                           <div className="w-full relative group/dropdown">
                                              <select className={`w-full text-xs font-medium bg-transparent border-b outline-none cursor-pointer py-1 ${deployConfig.imageId === img.id ? 'text-plasma-700 dark:text-plasma-300 border-plasma-300 dark:border-plasma-700' : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'}`}>
                                                 {img.versions.map(v => <option key={v}>{v}</option>)}
                                              </select>
                                           </div>
                                           
                                           {deployConfig.imageId === img.id && (
                                              <div className="absolute -top-2 -right-2 bg-plasma-500 text-white rounded-full p-0.5 shadow-sm border-2 border-white dark:border-neutral-900">
                                                 <Check size={12} strokeWidth={3} />
                                              </div>
                                           )}
                                        </div>
                                     ))}
                                  </div>
                               )}
                            </section>

                            {/* 5. Quantity */}
                            <section>
                               <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">5. Quantity</h4>
                               <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center justify-between">
                                  <div>
                                     <div className="font-bold text-gray-900 dark:text-white">Instance Quantity</div>
                                     <div className="text-xs text-gray-500 dark:text-gray-400">Deploy multiple instances with this config</div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-1">
                                     <button 
                                        onClick={() => setDeployConfig(p => ({...p, quantity: Math.max(1, p.quantity - 1)}))}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded text-gray-500"
                                     >
                                        <Minus size={16} />
                                     </button>
                                     <span className="font-bold w-8 text-center text-gray-900 dark:text-white">{deployConfig.quantity}</span>
                                     <button 
                                        onClick={() => setDeployConfig(p => ({...p, quantity: Math.min(10, p.quantity + 1)}))}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded text-gray-500"
                                     >
                                        <Plus size={16} />
                                     </button>
                                  </div>
                               </div>
                            </section>

                            {/* 6. Features */}
                            <section>
                               {/* ... Features UI (Same as before) ... */}
                               <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl divide-y divide-gray-100 dark:divide-neutral-700">
                                     <div className="p-4 flex items-center justify-between">
                                        <div className="flex gap-4">
                                           <div onClick={() => updateFeature('ipv4')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${deployConfig.features.ipv4 ? 'bg-plasma-600' : 'bg-gray-300 dark:bg-neutral-600'}`}>
                                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${deployConfig.features.ipv4 ? 'left-7' : 'left-1'}`}></div>
                                           </div>
                                           <div>
                                              <div className="text-sm font-bold text-gray-900 dark:text-white">Public IPv4</div>
                                              <div className="text-xs text-gray-500 dark:text-gray-400">If checked, an IPv4 address will be assigned to the instance.</div>
                                           </div>
                                        </div>
                                     </div>
                                     <div className="p-4 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10">
                                        <div className="flex gap-4">
                                           <div onClick={() => updateFeature('backups')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${deployConfig.features.backups ? 'bg-plasma-600' : 'bg-gray-300 dark:bg-neutral-600'}`}>
                                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${deployConfig.features.backups ? 'left-7' : 'left-1'}`}></div>
                                           </div>
                                           <div>
                                              <div className="text-sm font-bold text-gray-900 dark:text-white">Automatic Backups</div>
                                              <div className="text-xs text-gray-500 dark:text-gray-400">Enable easy recovery from disaster.</div>
                                           </div>
                                        </div>
                                     </div>
                               </div>
                            </section>

                            {/* 7. Settings */}
                            <section>
                               <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">7. Server Settings</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
                                  <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">SSH Key</label>
                                     <select 
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white appearance-none cursor-pointer"
                                        value={deployConfig.sshKey}
                                        onChange={(e) => setDeployConfig({...deployConfig, sshKey: e.target.value})}
                                     >
                                        <option value="">Select SSH Key...</option>
                                        {SSH_KEYS.map(key => <option key={key.id} value={key.id}>{key.name}</option>)}
                                     </select>
                                  </div>
                                  <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Server Hostname</label>
                                     <input 
                                        type="text" 
                                        placeholder="e.g. web-01"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        value={deployConfig.hostname}
                                        onChange={(e) => setDeployConfig({...deployConfig, hostname: e.target.value})}
                                     />
                                  </div>
                               </div>
                            </section>
                        </div>
                    )}

                </div>

                {/* Mobile Sticky Footer */}
                {/* ... */}
             </div>

             {/* Right: Sticky Summary - Desktop Only */}
             <div className="hidden md:flex w-80 lg:w-96 bg-gray-50 dark:bg-neutral-950 border-l border-gray-200 dark:border-neutral-800 flex-col shrink-0">
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">Deploy Summary</h3>
                   
                   {/* Summary Details */}
                   <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-2">Location</div>
                      <div className="flex items-center gap-2">
                         <span className="text-2xl">{LOCATIONS.find(l => l.id === deployConfig.location)?.flag}</span>
                         <div>
                            <div className="font-bold text-gray-900 dark:text-white">{LOCATIONS.find(l => l.id === deployConfig.location)?.name}</div>
                            <div className="text-xs text-gray-500 uppercase">{deployConfig.location}</div>
                         </div>
                      </div>
                   </div>

                   {/* Plan Details */}
                   <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-neutral-800 pb-2">
                         <span className="font-bold text-gray-900 dark:text-white">
                            {COMPUTE_TYPES.find(t => t.id === deployConfig.type)?.name}
                         </span>
                         <span className="text-xs font-mono text-gray-500">{PLANS_DATA.find(p => p.id === deployConfig.planId)?.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                         <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Cores</div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">{PLANS_DATA.find(p => p.id === deployConfig.planId)?.vcpu} vCPU</div>
                         </div>
                         <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Memory</div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">{PLANS_DATA.find(p => p.id === deployConfig.planId)?.ram}</div>
                         </div>
                         <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Storage</div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">{PLANS_DATA.find(p => p.id === deployConfig.planId)?.disk}</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Desktop Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 mt-auto">
                   <div className="flex justify-between items-end mb-4">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Total</span>
                      <div className="text-right">
                         <div className="text-3xl font-bold text-plasma-600 dark:text-plasma-400">${totalCost.toFixed(2)}<span className="text-sm text-gray-400 font-medium">/mo</span></div>
                         <div className="text-xs text-gray-400">(${(totalCost / 730).toFixed(4)}/hr)</div>
                      </div>
                   </div>

                   {deployStep === 1 ? (
                       <Button className="w-full py-4 text-base shadow-xl shadow-plasma-500/20" onClick={() => setDeployStep(2)}>
                          Next: Software & Settings <ChevronRight size={18} className="ml-1"/>
                       </Button>
                    ) : (
                       <div className="space-y-3">
                          <Button className="w-full py-4 text-base shadow-xl shadow-plasma-500/20" onClick={handleDeploy} isLoading={isDeploying}>
                             {isDeploying ? 'Deploying...' : 'Deploy Now'}
                          </Button>
                          <Button variant="ghost" className="w-full" onClick={() => setDeployStep(1)}>
                             <ChevronLeft size={18} className="mr-1"/> Back to Hardware
                          </Button>
                       </div>
                    )}
                </div>
             </div>

          </div>
       </div>
    </div>,
    document.body
  );
};
