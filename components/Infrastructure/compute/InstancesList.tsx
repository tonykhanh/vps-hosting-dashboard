
import React, { useState } from 'react';
import { 
  Server, Play, StopCircle, MoreVertical, Terminal, RefreshCw, Power, Trash2, ChevronLeft, ChevronRight, Disc, CheckCircle2, Zap, Layers 
} from 'lucide-react';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import { ProjectStatus } from '../../../types';
import { TerminateInstanceModal } from './TerminateInstanceModal';
import { ConsoleModal } from './ConsoleModal';

interface InstancesListProps {
  activeTab: string;
  instances: any[];
  setInstances: React.Dispatch<React.SetStateAction<any[]>>;
}

export const InstancesList: React.FC<InstancesListProps> = ({ activeTab, instances, setInstances }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals state
  const [terminateConfig, setTerminateConfig] = useState<{ type: 'single' | 'bulk', instance?: any } | null>(null);
  const [consoleInstance, setConsoleInstance] = useState<any>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Selection Logic
  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleToggleAll = () => {
    if (selectedIds.size === instances.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(instances.map(i => i.id)));
  };

  // Actions
  const handleTerminateClick = (instance: any) => {
    setTerminateConfig({ type: 'single', instance });
    setActiveDropdown(null);
  };

  const handleBulkTerminateClick = () => {
    setTerminateConfig({ type: 'bulk' });
  };

  const confirmTerminate = () => {
    if (terminateConfig?.type === 'single' && terminateConfig.instance) {
      setInstances(prev => prev.filter(i => i.id !== terminateConfig.instance.id));
      if (selectedIds.has(terminateConfig.instance.id)) {
         const newSet = new Set(selectedIds);
         newSet.delete(terminateConfig.instance.id);
         setSelectedIds(newSet);
      }
    } else if (terminateConfig?.type === 'bulk') {
      setInstances(prev => prev.filter(i => !selectedIds.has(i.id)));
      setSelectedIds(new Set());
    }
    setTerminateConfig(null);
  };

  const handleReboot = (id: string) => {
    setActiveDropdown(null);
    setInstances(prev => prev.map(i => i.id === id ? { ...i, status: 'REBOOTING' } : i));
    // Simulate reboot
    setTimeout(() => {
        setInstances(prev => prev.map(i => i.id === id ? { ...i, status: ProjectStatus.RUNNING } : i));
    }, 3000);
  };

  const handleStopStart = (id: string) => {
    setActiveDropdown(null);
    setInstances(prev => prev.map(i => {
        if (i.id === id) {
            return { ...i, status: i.status === ProjectStatus.RUNNING ? ProjectStatus.STOPPED : ProjectStatus.RUNNING };
        }
        return i;
    }));
  };

  const handleConsole = (instance: any) => {
    setActiveDropdown(null);
    setConsoleInstance(instance);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setActiveDropdown(null)}>
       {/* Header with Stats */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Server className="text-plasma-600" size={32} />
                Virtual Instances
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your virtual private servers.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm flex flex-col items-center">
                <span className="text-xs text-gray-500 uppercase font-bold">Running</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{instances.filter(i => i.status === ProjectStatus.RUNNING).length}</span>
             </div>
             <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm flex flex-col items-center">
                <span className="text-xs text-gray-500 uppercase font-bold">Stopped</span>
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">{instances.filter(i => i.status === ProjectStatus.STOPPED).length}</span>
             </div>
          </div>
       </div>

       {/* Bulk Actions Bar */}
       {selectedIds.size > 0 && (
          <div className="bg-plasma-50 dark:bg-plasma-900/20 border border-plasma-200 dark:border-plasma-800 p-3 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
             <div className="flex items-center gap-3">
                <div className="bg-plasma-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                   {selectedIds.size}
                </div>
                <span className="text-sm font-medium text-plasma-900 dark:text-white">Selected</span>
             </div>
             <div className="flex gap-2">
                <button 
                   onClick={() => setSelectedIds(new Set())}
                   className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                   Cancel
                </button>
                <Button 
                   size="sm" 
                   variant="danger"
                   onClick={handleBulkTerminateClick}
                >
                   <Trash2 size={14} className="mr-1" /> Terminate Selected
                </Button>
             </div>
          </div>
       )}

       {activeTab === 'overview' && (
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
             <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   <Layers size={20} className="text-plasma-600"/> Active Instances
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-gray-600 dark:text-gray-300">
                   {instances.length} / 10 Limit
                </span>
             </div>
             <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left text-sm min-w-[800px]">
                   <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                      <tr>
                         <th className="px-6 py-4 w-12">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer"
                                checked={instances.length > 0 && selectedIds.size === instances.length}
                                onChange={handleToggleAll}
                            />
                         </th>
                         <th className="px-6 py-4">Server</th>
                         <th className="px-6 py-4">OS</th>
                         <th className="px-6 py-4">Location</th>
                         <th className="px-6 py-4">Charges</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4 text-right"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                      {instances.map((vps, index) => {
                         const isSelected = selectedIds.has(vps.id);
                         return (
                         <tr key={vps.id} className={`hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                            <td className="px-6 py-4">
                               <input 
                                    type="checkbox" 
                                    className="rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelect(vps.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                               <div className="font-bold text-gray-900 dark:text-white">{vps.name}</div>
                               <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                                  {vps.plan} - {vps.ip}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               {vps.osIcon ? (
                                  <img src={vps.osIcon} alt={vps.os} className="w-6 h-6 object-contain" />
                               ) : (
                                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                               )}
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <span className="text-lg">{vps.flag}</span>
                                  <span className="text-gray-700 dark:text-gray-300">{vps.region}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                               ${vps.cost.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  {vps.status === 'REBOOTING' ? (
                                     <RefreshCw size={16} className="text-amber-500 animate-spin" />
                                  ) : vps.status === ProjectStatus.RUNNING ? (
                                     <Play size={16} className="text-green-500 fill-current" />
                                  ) : (
                                     <StopCircle size={16} className="text-gray-400 fill-current" />
                                  )}
                                  <span className={`text-sm font-medium ${
                                      vps.status === 'REBOOTING' ? 'text-amber-600 dark:text-amber-400' :
                                      vps.status === ProjectStatus.RUNNING ? 'text-green-600 dark:text-green-400' : 
                                      'text-gray-500 dark:text-gray-400'
                                  }`}>
                                     {vps.status === 'REBOOTING' ? 'Rebooting...' : vps.status === ProjectStatus.RUNNING ? 'Running' : 'Stopped'}
                                  </span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right relative">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); toggleDropdown(vps.id); }}
                                 className={`p-2 rounded-lg transition-colors ${activeDropdown === vps.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                               >
                                  <MoreVertical size={18} className="rotate-90" />
                               </button>

                               {activeDropdown === vps.id && (
                                  <div className={`absolute right-8 w-48 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= instances.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                     <button 
                                        onClick={() => handleConsole(vps)}
                                        className="px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                     >
                                        <Terminal size={14} /> Console Access
                                     </button>
                                     <button 
                                        onClick={() => handleReboot(vps.id)}
                                        className="px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                     >
                                        <RefreshCw size={14} /> Reboot Server
                                     </button>
                                     <button 
                                        onClick={() => handleStopStart(vps.id)}
                                        className="px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                     >
                                        {vps.status === ProjectStatus.RUNNING ? <><Power size={14} /> Stop Instance</> : <><Play size={14} /> Start Instance</>}
                                     </button>
                                     <div className="h-px bg-gray-100 dark:bg-neutral-700 my-1"></div>
                                     <button 
                                        onClick={() => handleTerminateClick(vps)}
                                        className="px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                     >
                                        <Trash2 size={14} /> Terminate
                                     </button>
                                  </div>
                               )}
                            </td>
                         </tr>
                      )})}
                   </tbody>
                </table>
             </div>
             {instances.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-neutral-700 flex items-center justify-between bg-gray-50 dark:bg-neutral-900/50">
                    <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-gray-500 disabled:opacity-50"><ChevronLeft size={16}/></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 border border-plasma-500 text-plasma-600 dark:text-plasma-400 font-bold rounded">1</button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-gray-500"><ChevronRight size={16}/></button>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                    <span>{instances.length} total</span>
                    </div>
                </div>
             )}
             {instances.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                    No instances found. Deploy one to get started.
                </div>
             )}
          </div>
       )}

       {(activeTab === 'backups' || activeTab === 'snapshots' || activeTab === 'logs') && (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl shadow-sm text-center animate-in zoom-in-95 duration-300">
             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                <Disc size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
             <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Select an instance from the overview to manage {activeTab}.
             </p>
          </div>
       )}

       {terminateConfig && (
          <TerminateInstanceModal 
             instanceName={terminateConfig.instance?.name}
             count={terminateConfig.type === 'bulk' ? selectedIds.size : 1}
             onClose={() => setTerminateConfig(null)}
             onConfirm={confirmTerminate}
          />
       )}

       {consoleInstance && (
          <ConsoleModal 
             instanceName={consoleInstance.name}
             onClose={() => setConsoleInstance(null)}
          />
       )}
    </div>
  );
};
