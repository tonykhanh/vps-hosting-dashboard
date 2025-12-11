
import React, { useState } from 'react';
import { 
  Server, Play, StopCircle, MoreVertical, Terminal, RefreshCw, Power, Trash2, ChevronLeft, ChevronRight, Disc 
} from 'lucide-react';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import { ProjectStatus } from '../../../types';
import { VPS_LIST } from '../../../constants';

interface InstancesListProps {
  activeTab: string;
}

export const InstancesList: React.FC<InstancesListProps> = ({ activeTab }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setActiveDropdown(null)}>
       {/* Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Server className="text-plasma-600" size={32} />
                Virtual Instances
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your virtual private servers.</p>
          </div>
       </div>

       {activeTab === 'overview' && (
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
             <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left text-sm min-w-[800px]">
                   <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                      <tr>
                         <th className="px-6 py-4 w-12">
                            <input type="checkbox" className="rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer" />
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
                      {VPS_LIST.map((vps) => (
                         <tr key={vps.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group">
                            <td className="px-6 py-4">
                               <input type="checkbox" className="rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer" />
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
                                  {vps.status === ProjectStatus.RUNNING ? (
                                     <Play size={16} className="text-green-500 fill-current" />
                                  ) : (
                                     <StopCircle size={16} className="text-gray-400 fill-current" />
                                  )}
                                  <span className={`text-sm font-medium ${vps.status === ProjectStatus.RUNNING ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                     {vps.status === ProjectStatus.RUNNING ? 'Running' : 'Stopped'}
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
                                  <div className="absolute right-8 top-8 w-48 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                                     <button className="px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                                        <Terminal size={14} /> Console Access
                                     </button>
                                     <button className="px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                                        <RefreshCw size={14} /> Reboot Server
                                     </button>
                                     <button className="px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                                        <Power size={14} /> Stop Instance
                                     </button>
                                     <div className="h-px bg-gray-100 dark:bg-neutral-700 my-1"></div>
                                     <button className="px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                        <Trash2 size={14} /> Terminate
                                     </button>
                                  </div>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="px-6 py-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between bg-gray-50 dark:bg-neutral-900/50">
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-gray-500 disabled:opacity-50"><ChevronLeft size={16}/></button>
                   <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 border border-plasma-500 text-plasma-600 dark:text-plasma-400 font-bold rounded">1</button>
                   <button className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-gray-500"><ChevronRight size={16}/></button>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                   <span>24 total</span>
                </div>
             </div>
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
    </div>
  );
};
