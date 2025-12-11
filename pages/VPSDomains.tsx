
import React, { useState } from 'react';
import { 
  Server, Globe, Cpu, HardDrive, Activity, 
  MoreVertical, RefreshCw, Power, Terminal, 
  ShieldCheck, AlertTriangle, CheckCircle2, 
  Plus, Edit2, Trash2, ExternalLink, Zap,
  X, Save, RotateCcw, Clock, Lock, ArrowRight, Cloud, Check, Sliders,
  Tag, Shield, Disc, DollarSign, Layers
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProjectStatus } from '../types';
import { VPS_LIST } from '../constants';

// Mock Data
const DOMAIN_LIST = [
  { id: 'd-1', name: 'nexus-agency.com', registrar: 'Namecheap', expiry: '2025-10-12', ssl: 'valid', autoRenew: true, dnsStatus: 'healthy', nameservers: 'Cloudflare', target: '104.22.15.192' },
  { id: 'd-2', name: 'client-portal.io', registrar: 'GoDaddy', expiry: '2024-06-01', ssl: 'warning', autoRenew: false, dnsStatus: 'warning', nameservers: 'Default', target: '10.0.0.5' },
  { id: 'd-3', name: 'dev-test.site', registrar: 'Cloudflare', expiry: '2024-12-30', ssl: 'valid', autoRenew: true, dnsStatus: 'healthy', nameservers: 'Cloudflare', target: '192.168.1.50' },
];

const DNS_RECORDS = [
  { id: 'r-1', type: 'A', name: '@', value: '104.22.15.192', ttl: '3600' },
  { id: 'r-2', type: 'CNAME', name: 'www', value: 'nexus-agency.com', ttl: '3600' },
  { id: 'r-3', type: 'MX', name: '@', value: 'mail.protonmail.com', ttl: '14400' },
];

const RECOMMENDATIONS = [
  { id: 'rec-1', type: 'domain', title: 'Renew Domain Soon', desc: 'client-portal.io expires in 7 days. Enable auto-renew?', action: 'Enable Auto-Renew' },
  { id: 'rec-2', type: 'vps', title: 'Resize Staging Worker', desc: 'Instance has been stopped for 14 days. Downsize to Nano?', action: 'Resize VPS' },
];

const ACTIVITY_LOGS = [
  { id: 'l-1', action: 'Updated DNS Record', target: 'nexus-agency.com', user: 'John Doe', time: '10 mins ago' },
  { id: 'l-2', action: 'Renewed SSL Certificate', target: 'dev-test.site', user: 'System (AI)', time: '2 hours ago' },
  { id: 'l-3', action: 'Rebooted VPS', target: 'Web Server - Prod', user: 'Sarah Connor', time: '1 day ago' },
];

export const VPSDomains: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vps' | 'domains' | 'firewall' | 'logs'>('vps');
  const [showDNSModal, setShowDNSModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);
  
  // Add Resource Modal State
  const [resourceType, setResourceType] = useState<'vps' | 'domain' | null>(null);
  const [addStep, setAddStep] = useState(1);
  const [newResourceName, setNewResourceName] = useState('');
  
  // VPS Plan State
  const [selectedPlan, setSelectedPlan] = useState<'nano' | 'standard' | 'pro' | 'custom'>('standard');
  const [customCpu, setCustomCpu] = useState(4);
  const [customRam, setCustomRam] = useState(8);

  const handleEditDNS = (domainName: string) => {
    setSelectedDomain(domainName);
    setShowDNSModal(true);
  };

  const closeAddModal = () => {
    setShowAddResourceModal(false);
    setResourceType(null);
    setAddStep(1);
    setNewResourceName('');
    setSelectedPlan('standard');
  };

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Server className="text-plasma-600" size={32} />
            VPS & Domain Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Centralized control for compute instances and DNS configurations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <div className="bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg flex items-center overflow-x-auto max-w-full no-scrollbar">
              <button 
                onClick={() => setActiveTab('vps')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'vps' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Instances
              </button>
              <button 
                onClick={() => setActiveTab('domains')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'domains' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Domains
              </button>
              <button 
                onClick={() => setActiveTab('firewall')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'firewall' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Firewalls
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'logs' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Logs
              </button>
           </div>
           <Button onClick={() => setShowAddResourceModal(true)} className="justify-center">
              <Plus size={18} className="mr-2" /> <span className="hidden sm:inline">Add Resource</span> <span className="sm:hidden">Add</span>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: AI Recommendations */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-plasma-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-amber-300"/> AI Optimization
                 </h3>
                 <div className="space-y-4">
                    {RECOMMENDATIONS.map(rec => (
                       <div key={rec.id} className="bg-white/10 rounded-xl p-3 border border-white/10 hover:bg-white/20 transition-colors">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                             {rec.type === 'vps' ? <Server size={12}/> : <Globe size={12}/>}
                             {rec.type} Alert
                          </div>
                          <h4 className="font-bold text-sm mb-1">{rec.title}</h4>
                          <p className="text-xs text-indigo-100 mb-3 leading-snug">{rec.desc}</p>
                          <Button size="sm" className="w-full !bg-white !text-indigo-600 hover:!bg-indigo-50 border-none h-7 text-xs shadow-sm">
                             {rec.action}
                          </Button>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           </div>

           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Quick Stats</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total vCPU</span>
                    <span className="font-bold text-gray-900 dark:text-white">12 Cores</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total RAM</span>
                    <span className="font-bold text-gray-900 dark:text-white">24 GB</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Active Domains</span>
                    <span className="font-bold text-gray-900 dark:text-white">3</span>
                 </div>
                 <div className="w-full h-px bg-gray-200 dark:bg-neutral-700 my-2"></div>
                 <div className="flex justify-between items-center text-green-600 dark:text-green-400 font-bold">
                    <span>System Status</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={14}/> Healthy</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-9 space-y-6">
           
           {/* VPS LIST TAB */}
           {activeTab === 'vps' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 {VPS_LIST.map(vps => (
                    <div key={vps.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-plasma-300 dark:hover:border-plasma-500/50 transition-all duration-300 group flex flex-col justify-between">
                       <div>
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-2xl ${vps.status === ProjectStatus.RUNNING ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500'}`}>
                                   <Server size={24} />
                                </div>
                                <div>
                                   <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{vps.name}</h3>
                                      <span className="text-[10px] bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-mono border border-gray-200 dark:border-neutral-600">{vps.os}</span>
                                   </div>
                                   <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                                      {vps.ip} • <span className="uppercase">{vps.region}</span>
                                   </div>
                                </div>
                             </div>
                             <Badge status={vps.status} />
                          </div>

                          {/* Tags & Cost */}
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex gap-2 flex-wrap">
                                {vps.tags.map(tag => (
                                   <span key={tag} className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 px-2 py-1 rounded-full border border-gray-100 dark:border-neutral-700 flex items-center gap-1">
                                      <Tag size={10} /> {tag}
                                   </span>
                                ))}
                             </div>
                             <div className="text-xs font-medium text-gray-900 dark:text-white flex items-center gap-1 bg-gray-50 dark:bg-neutral-900 px-2 py-1 rounded-lg">
                                <DollarSign size={12} className="text-green-600 dark:text-green-400"/>
                                {vps.cost.toFixed(2)}/mo
                             </div>
                          </div>

                          {/* Resources Grid */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                             <div className="text-center p-2 bg-gray-50 dark:bg-neutral-900/50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-colors">
                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">CPU</div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{vps.cpu}%</div>
                                <div className="w-full bg-gray-200 dark:bg-neutral-700 h-1 rounded-full mt-1 overflow-hidden">
                                   <div className="bg-blue-500 h-full" style={{ width: `${vps.cpu}%` }}></div>
                                </div>
                             </div>
                             <div className="text-center p-2 bg-gray-50 dark:bg-neutral-900/50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-colors">
                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">RAM</div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{vps.ram}%</div>
                                <div className="w-full bg-gray-200 dark:bg-neutral-700 h-1 rounded-full mt-1 overflow-hidden">
                                   <div className="bg-purple-500 h-full" style={{ width: `${vps.ram}%` }}></div>
                                </div>
                             </div>
                             <div className="text-center p-2 bg-gray-50 dark:bg-neutral-900/50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-colors">
                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Disk</div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{vps.disk}%</div>
                                <div className="w-full bg-gray-200 dark:bg-neutral-700 h-1 rounded-full mt-1 overflow-hidden">
                                   <div className="bg-amber-500 h-full" style={{ width: `${vps.disk}%` }}></div>
                                </div>
                             </div>
                          </div>

                          {/* Security Info */}
                          <div className="flex gap-4 mb-6 pt-3 border-t border-gray-100 dark:border-neutral-700">
                             <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                   <Shield size={12} />
                                </div>
                                <div>
                                   <div className="text-[10px] text-gray-400 uppercase font-bold">Firewall</div>
                                   <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{vps.firewall}</div>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${vps.backup === 'Disabled' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                   <Disc size={12} />
                                </div>
                                <div>
                                   <div className="text-[10px] text-gray-400 uppercase font-bold">Backup</div>
                                   <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{vps.backup}</div>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="flex gap-2 mt-auto">
                          <Button size="sm" variant="secondary" className="flex-1 text-xs dark:bg-neutral-700 dark:text-white dark:border-neutral-600" onClick={() => setShowConsole(true)}>
                             <Terminal size={14} className="mr-2"/> Console
                          </Button>
                          <Button size="sm" variant="secondary" className="flex-1 text-xs dark:bg-neutral-700 dark:text-white dark:border-neutral-600">
                             <RefreshCw size={14} className="mr-2"/> Reboot
                          </Button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg text-gray-400">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {/* DOMAIN LIST TAB */}
           {activeTab === 'domains' && (
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-hidden shadow-sm">
                 <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Active Domains</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">3 Domains Configured</div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[700px]">
                       <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                          <tr>
                             <th className="px-6 py-3">Domain Name</th>
                             <th className="px-6 py-3">Registrar / Nameservers</th>
                             <th className="px-6 py-3">Target</th>
                             <th className="px-6 py-3">Expiry Date</th>
                             <th className="px-6 py-3">Status</th>
                             <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                          {DOMAIN_LIST.map(domain => (
                             <tr key={domain.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                                <td className="px-6 py-4">
                                   <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                      <Globe size={16} className="text-gray-400" />
                                      {domain.name}
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="text-gray-900 dark:text-white font-medium">{domain.registrar}</div>
                                   <div className="text-xs text-gray-500 dark:text-gray-400">{domain.nameservers} NS</div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2 text-xs font-mono bg-gray-100 dark:bg-neutral-900 px-2 py-1 rounded w-fit text-gray-600 dark:text-gray-300">
                                      <ArrowRight size={10} className="text-plasma-500"/>
                                      {domain.target}
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className={`text-xs font-bold px-2 py-1 rounded w-fit ${
                                      new Date(domain.expiry) < new Date('2024-07-01') ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'
                                   }`}>
                                      {domain.expiry}
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   {domain.ssl === 'valid' ? (
                                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold"><ShieldCheck size={14}/> SSL Active</span>
                                   ) : (
                                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold"><AlertTriangle size={14}/> SSL Expiring</span>
                                   )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <div className="flex justify-end gap-2">
                                      <button 
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded text-gray-400 hover:text-plasma-600 dark:hover:text-plasma-400" 
                                        title="Edit DNS"
                                        onClick={() => handleEditDNS(domain.name)}
                                      >
                                         <Edit2 size={16} />
                                      </button>
                                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded text-gray-400 hover:text-plasma-600 dark:hover:text-plasma-400" title="Visit Site">
                                         <ExternalLink size={16} />
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-700 text-center">
                    <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">Manage All Domains</Button>
                 </div>
              </div>
           )}

           {/* FIREWALL TAB PLACEHOLDER */}
           {activeTab === 'firewall' && (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl shadow-sm text-center">
                 <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                    <Shield size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Network Security Groups</h3>
                 <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Manage inbound/outbound rules applied to your instances. Create reuseable security groups for Web, DB, and Internal traffic.
                 </p>
                 <Button>Create Security Group</Button>
              </div>
           )}

            {/* ACTIVITY LOGS TAB */}
            {activeTab === 'logs' && (
               <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <Activity size={20} className="text-plasma-600" /> Recent Operations
                  </h3>
                  <div className="space-y-4 relative pl-4 border-l border-gray-200 dark:border-neutral-700">
                     {ACTIVITY_LOGS.map(log => (
                        <div key={log.id} className="relative pl-6">
                           <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-plasma-500 border-2 border-white dark:border-neutral-800 shadow-sm"></div>
                           <div className="flex justify-between items-start">
                              <div>
                                 <span className="block font-bold text-gray-900 dark:text-white text-sm">{log.action}</span>
                                 <span className="text-xs text-gray-500 dark:text-gray-400">{log.target}</span>
                              </div>
                              <div className="text-right">
                                 <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">{log.user}</span>
                                 <span className="text-xs text-gray-400">{log.time}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
        </div>

      </div>

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900 sticky top-0 z-10">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-plasma-100 dark:bg-plasma-900/30 text-plasma-600 dark:text-plasma-400 rounded-xl">
                       <Plus size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-gray-900 dark:text-white">Provision Resource</h3>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Step {addStep} of 2</p>
                    </div>
                 </div>
                 <button onClick={closeAddModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-8 overflow-y-auto">
                 {addStep === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div 
                         onClick={() => { setResourceType('vps'); setAddStep(2); }}
                         className={`
                           relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center gap-4 text-center group
                           ${resourceType === 'vps' 
                              ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20' 
                              : 'border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50 hover:shadow-md'}
                         `}
                       >
                          <div className={`
                             w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110
                             ${resourceType === 'vps' ? 'bg-plasma-100 dark:bg-plasma-900/30 text-plasma-600 dark:text-plasma-400' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400'}
                          `}>
                             <Server size={32} />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 dark:text-white text-lg">VPS Instance</h4>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deploy a high-performance virtual server.</p>
                          </div>
                          {resourceType === 'vps' && (
                             <div className="absolute top-4 right-4 text-plasma-600 dark:text-plasma-400">
                                <CheckCircle2 size={20} />
                             </div>
                          )}
                       </div>

                       <div 
                         onClick={() => { setResourceType('domain'); setAddStep(2); }}
                         className={`
                           relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center gap-4 text-center group
                           ${resourceType === 'domain' 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : 'border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md'}
                         `}
                       >
                          <div className={`
                             w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110
                             ${resourceType === 'domain' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400'}
                          `}>
                             <Globe size={32} />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 dark:text-white text-lg">Domain Name</h4>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Register or connect an existing domain.</p>
                          </div>
                          {resourceType === 'domain' && (
                             <div className="absolute top-4 right-4 text-purple-600 dark:text-purple-400">
                                <CheckCircle2 size={20} />
                             </div>
                          )}
                       </div>
                    </div>
                 )}

                 {addStep === 2 && resourceType === 'vps' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Instance Name</label>
                          <input 
                             type="text" 
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 focus:border-plasma-500 outline-none transition-all dark:text-white placeholder-gray-400"
                             placeholder="e.g. Production Web Server"
                             value={newResourceName}
                             onChange={(e) => setNewResourceName(e.target.value)}
                             autoFocus
                          />
                       </div>
                       
                       <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Region</label>
                          <div className="grid grid-cols-2 gap-3">
                             <button className="px-4 py-3 border-2 border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20 text-plasma-700 dark:text-plasma-400 rounded-xl font-bold text-sm flex items-center justify-between">
                                <span>Singapore (SG-1)</span>
                                <Check size={16} />
                             </button>
                             <button className="px-4 py-3 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-600 rounded-xl text-sm font-medium">
                                Vietnam (VN-1)
                             </button>
                          </div>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Size Plan</label>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                             {['nano', 'standard', 'pro', 'custom'].map((plan) => (
                               <button
                                 key={plan}
                                 onClick={() => setSelectedPlan(plan as any)}
                                 className={`
                                   px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all border-2
                                   ${selectedPlan === plan 
                                     ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20 text-plasma-700 dark:text-plasma-400' 
                                     : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-600'}
                                 `}
                               >
                                 {plan}
                               </button>
                             ))}
                          </div>

                          <div className="p-4 border-2 border-plasma-500 rounded-xl bg-plasma-50/30 dark:bg-plasma-900/10 transition-all">
                             {selectedPlan !== 'custom' ? (
                                <div className="flex justify-between items-center">
                                   <div>
                                      <div className="font-bold text-gray-900 dark:text-white capitalize">{selectedPlan} Performance</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                         {selectedPlan === 'nano' ? '1 vCPU • 1GB RAM • 20GB SSD' : 
                                          selectedPlan === 'standard' ? '2 vCPU • 4GB RAM • 80GB SSD' : 
                                          '4 vCPU • 16GB RAM • 320GB SSD'}
                                      </div>
                                   </div>
                                   <div className="font-bold text-plasma-600 dark:text-plasma-400 text-lg">
                                      {selectedPlan === 'nano' ? '$5' : selectedPlan === 'standard' ? '$20' : '$80'}<span className="text-sm font-normal">/mo</span>
                                   </div>
                                </div>
                             ) : (
                                <div className="space-y-4">
                                   <div className="flex justify-between items-center text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-700 pb-2 mb-2">
                                      <span className="flex items-center gap-2"><Sliders size={16}/> Custom Configuration</span>
                                      <span className="text-plasma-600 dark:text-plasma-400">${(customCpu * 10) + (customRam * 4)}/mo</span>
                                   </div>
                                   <div>
                                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                         <span>vCPU Cores</span>
                                         <span className="font-mono font-bold text-gray-900 dark:text-white">{customCpu}</span>
                                      </div>
                                      <input 
                                        type="range" min="1" max="16" step="1" 
                                        value={customCpu}
                                        onChange={(e) => setCustomCpu(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-plasma-600"
                                      />
                                   </div>
                                   <div>
                                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                         <span>RAM (GB)</span>
                                         <span className="font-mono font-bold text-gray-900 dark:text-white">{customRam}</span>
                                      </div>
                                      <input 
                                        type="range" min="1" max="64" step="1" 
                                        value={customRam}
                                        onChange={(e) => setCustomRam(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-plasma-600"
                                      />
                                   </div>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 )}

                 {addStep === 2 && resourceType === 'domain' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Domain Name</label>
                          <div className="flex shadow-sm rounded-xl overflow-hidden">
                             <input 
                                type="text" 
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 border-r-0 rounded-l-xl focus:ring-2 focus:ring-plasma-500 focus:border-plasma-500 outline-none transition-all dark:text-white placeholder-gray-400"
                                placeholder="example.com"
                                value={newResourceName}
                                onChange={(e) => setNewResourceName(e.target.value)}
                                autoFocus
                             />
                             <button className="px-6 bg-gray-100 dark:bg-neutral-800 border border-l-0 border-gray-200 dark:border-neutral-700 font-bold text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                                Check
                             </button>
                          </div>
                          {newResourceName && (
                             <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                                <CheckCircle2 size={12} /> Available for registration
                             </p>
                          )}
                       </div>
                       
                       <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg h-fit">
                             <Zap size={18} />
                          </div>
                          <div>
                             <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">Auto-Configuration Enabled</h4>
                             <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                                We will automatically set up DNS records and issue an SSL certificate upon purchase. No manual setup required.
                             </p>
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-between bg-white dark:bg-neutral-900 sticky bottom-0 z-10">
                 {addStep === 1 ? (
                    <Button variant="secondary" onClick={closeAddModal} className="dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700">Cancel</Button>
                 ) : (
                    <Button variant="secondary" onClick={() => setAddStep(1)} className="dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700">Back</Button>
                 )}
                 
                 <Button 
                    onClick={closeAddModal} 
                    className="gap-2 shadow-lg shadow-plasma-500/20"
                    disabled={addStep === 1 && !resourceType || addStep === 2 && !newResourceName}
                 >
                    {addStep === 1 ? 'Next Step' : resourceType === 'vps' ? 'Deploy VPS' : 'Register Domain'} <ArrowRight size={16} />
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* DNS Modal Overlay */}
      {showDNSModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                     <Globe size={20} className="text-plasma-600"/> DNS Records: {selectedDomain}
                  </h3>
                  <button onClick={() => setShowDNSModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
               </div>
               <div className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                     <span className="text-sm text-gray-500 dark:text-gray-400">Managing records for primary zone.</span>
                     <Button size="sm"><Plus size={16} className="mr-1"/> Add Record</Button>
                  </div>
                  <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[500px]">
                           <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 font-medium">
                              <tr>
                                 <th className="px-4 py-2">Type</th>
                                 <th className="px-4 py-2">Name</th>
                                 <th className="px-4 py-2">Value</th>
                                 <th className="px-4 py-2">TTL</th>
                                 <th className="px-4 py-2 text-right"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                              {DNS_RECORDS.map(record => (
                                 <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                    <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">{record.type}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{record.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{record.value}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{record.ttl}</td>
                                    <td className="px-4 py-3 text-right">
                                       <button className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <div className="p-4 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-800">
                  <Button variant="secondary" onClick={() => setShowDNSModal(false)} className="dark:bg-neutral-700 dark:text-white">Cancel</Button>
                  <Button className="gap-2"><Save size={16}/> Save Changes</Button>
               </div>
            </div>
         </div>
      )}

      {/* Mock Console Overlay */}
      {showConsole && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-black w-full max-w-4xl h-[600px] rounded-xl shadow-2xl border border-gray-800 flex flex-col font-mono text-sm">
               <div className="p-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-gray-400">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span>root@vps-1:~</span>
                  <button onClick={() => setShowConsole(false)}><X size={16}/></button>
               </div>
               <div className="flex-1 p-4 text-green-400 overflow-y-auto">
                  <p>Welcome to Nebula Cloud Terminal</p>
                  <p>System load: 0.45, 0.32, 0.18</p>
                  <p className="mt-2 text-white">$ apt-get update</p>
                  <p>Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease</p>
                  <p>Get:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]</p>
                  <p>Fetched 110 kB in 1s (135 kB/s)</p>
                  <p className="mt-2 text-white">$ <span className="animate-pulse">_</span></p>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
