
import React, { useState } from 'react';
import { 
  HardDrive, MoreVertical, Server, CheckCircle2, Zap, ArrowRight, Trash2, Sliders, Plus
} from 'lucide-react';
import { CreateVolumeModal } from './CreateVolumeModal';
import { AttachVolumeModal } from './AttachVolumeModal';
import { ResizeVolumeModal } from './ResizeVolumeModal';
import { DeleteVolumeModal } from './DeleteVolumeModal';
import { Button } from '../../Button';

const MOCK_VOLUMES = [
  { 
    id: 'vol-1', 
    name: 'DB-Data-Primary', 
    size: 100, 
    type: 'NVMe', 
    region: 'sg-1', 
    status: 'attached', 
    attachedTo: 'Database Primary',
    cost: 10.00 
  },
  { 
    id: 'vol-2', 
    name: 'Log-Archival', 
    size: 500, 
    type: 'HDD', 
    region: 'sg-1', 
    status: 'detached', 
    attachedTo: '-',
    cost: 15.00 
  },
  { 
    id: 'vol-3', 
    name: 'Web-Assets-Hot', 
    size: 50, 
    type: 'NVMe', 
    region: 'us-west', 
    status: 'attached', 
    attachedTo: 'Web Server - Prod',
    cost: 5.00 
  },
];

export const BlockStorageManager: React.FC = () => {
  const [volumes, setVolumes] = useState(MOCK_VOLUMES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Selection State
  const [selectedVolumeIds, setSelectedVolumeIds] = useState<Set<string>>(new Set());

  // Modals state
  const [targetVolume, setTargetVolume] = useState<any>(null);
  const [deleteConfig, setDeleteConfig] = useState<{ type: 'single' | 'bulk', volume?: any } | null>(null);
  
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showResizeModal, setShowResizeModal] = useState(false);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleCreateVolume = (volumeData: { name: string; size: number; type: string; region: string; cost: number }) => {
    const newVolume = {
      id: `vol-${Date.now()}`,
      ...volumeData,
      status: 'detached',
      attachedTo: '-',
    };
    setVolumes(prev => [newVolume, ...prev]);
    setShowAddModal(false);
  };

  // Selection Logic
  const handleToggleVolume = (id: string) => {
    const newSet = new Set(selectedVolumeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedVolumeIds(newSet);
  };

  const handleToggleAllVolumes = () => {
    if (selectedVolumeIds.size === volumes.length) {
      setSelectedVolumeIds(new Set());
    } else {
      setSelectedVolumeIds(new Set(volumes.map(v => v.id)));
    }
  };

  // Delete Logic
  const handleDeleteClick = (vol: any) => {
    setDeleteConfig({ type: 'single', volume: vol });
    setActiveDropdown(null);
  };

  const handleBulkDeleteClick = () => {
    setDeleteConfig({ type: 'bulk' });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfig?.type === 'single' && deleteConfig.volume) {
      setVolumes(prev => prev.filter(v => v.id !== deleteConfig.volume.id));
      if (selectedVolumeIds.has(deleteConfig.volume.id)) {
         const newSet = new Set(selectedVolumeIds);
         newSet.delete(deleteConfig.volume.id);
         setSelectedVolumeIds(newSet);
      }
    } else if (deleteConfig?.type === 'bulk') {
      setVolumes(prev => prev.filter(v => !selectedVolumeIds.has(v.id)));
      setSelectedVolumeIds(new Set());
    }
    setDeleteConfig(null);
  };

  // Handle Attach/Detach logic
  const handleAttachClick = (vol: any) => {
     if (vol.status === 'attached') {
        // Detach
        if (confirm(`Detach ${vol.name} from ${vol.attachedTo}?`)) {
           setVolumes(prev => prev.map(v => v.id === vol.id ? { ...v, status: 'detached', attachedTo: '-' } : v));
        }
     } else {
        // Attach Modal
        setTargetVolume(vol);
        setShowAttachModal(true);
     }
     setActiveDropdown(null);
  };

  const handleAttachSubmit = (instanceId: string, instanceName: string) => {
     if (targetVolume) {
        setVolumes(prev => prev.map(v => v.id === targetVolume.id ? { ...v, status: 'attached', attachedTo: instanceName } : v));
        setTargetVolume(null);
        setShowAttachModal(false);
     }
  };

  // Handle Resize logic
  const handleResizeClick = (vol: any) => {
     setTargetVolume(vol);
     setShowResizeModal(true);
     setActiveDropdown(null);
  };

  const handleResizeSubmit = (newSize: number, newCost: number) => {
     if (targetVolume) {
        setVolumes(prev => prev.map(v => v.id === targetVolume.id ? { ...v, size: newSize, cost: newCost } : v));
        setTargetVolume(null);
        setShowResizeModal(false);
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setActiveDropdown(null)}>
       {/* Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HardDrive className="text-plasma-600" size={32} />
                Block Storage
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">High-performance volumes for your instances.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
             <Plus size={16} className="mr-2"/> Create Volume
          </Button>
       </div>

       {/* Bulk Actions Bar */}
       {selectedVolumeIds.size > 0 && (
          <div className="bg-plasma-50 dark:bg-plasma-900/20 border border-plasma-200 dark:border-plasma-800 p-3 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
             <div className="flex items-center gap-3">
                <div className="bg-plasma-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                   {selectedVolumeIds.size}
                </div>
                <span className="text-sm font-medium text-plasma-900 dark:text-white">Selected</span>
             </div>
             <div className="flex gap-2">
                <button 
                   onClick={() => setSelectedVolumeIds(new Set())}
                   className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                   Cancel
                </button>
                <Button 
                   size="sm" 
                   variant="danger"
                   onClick={handleBulkDeleteClick}
                >
                   <Trash2 size={14} className="mr-1" /> Delete Selected
                </Button>
             </div>
          </div>
       )}

       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HardDrive size={20} className="text-plasma-600"/> My Volumes
             </h3>
             <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold">
                {volumes.length} Volumes
             </span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
             <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                   <tr>
                      <th className="px-6 py-4 w-12">
                         <input 
                            type="checkbox" 
                            className="rounded border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer"
                            checked={volumes.length > 0 && selectedVolumeIds.size === volumes.length}
                            onChange={handleToggleAllVolumes}
                         />
                      </th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Size & Type</th>
                      <th className="px-6 py-4">Attached To</th>
                      <th className="px-6 py-4">Region</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                   {volumes.map((vol, index) => {
                      const isSelected = selectedVolumeIds.has(vol.id);
                      return (
                      <tr key={vol.id} className={`hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                         <td className="px-6 py-4">
                            <input 
                               type="checkbox" 
                               className="rounded border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer" 
                               checked={isSelected}
                               onChange={() => handleToggleVolume(vol.id)}
                            />
                         </td>
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                               <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg text-gray-500">
                                  <HardDrive size={16} />
                               </div>
                               {vol.name}
                            </div>
                            <div className="text-xs text-gray-400 ml-10">${vol.cost.toFixed(2)}/mo</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="text-gray-900 dark:text-white font-medium">{vol.size} GB</div>
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${vol.type === 'NVMe' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300'}`}>
                               {vol.type}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            {vol.status === 'attached' ? (
                               <div className="flex items-center gap-2 text-xs font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                  <Server size={10}/>
                                  {vol.attachedTo}
                               </div>
                            ) : (
                               <span className="text-xs text-gray-400 italic">Unattached</span>
                            )}
                         </td>
                         <td className="px-6 py-4">
                            <span className="uppercase text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded">
                               {vol.region}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            {vol.status === 'attached' ? (
                               <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold"><CheckCircle2 size={14}/> In Use</span>
                            ) : (
                               <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold"><Zap size={14}/> Available</span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(vol.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeDropdown === vol.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical size={18} className="rotate-90"/>
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === vol.id && (
                                <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= volumes.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                    <button 
                                      onClick={() => handleAttachClick(vol)}
                                      className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                    >
                                        <ArrowRight size={14} /> {vol.status === 'attached' ? 'Detach' : 'Attach'}
                                    </button>
                                    <button 
                                      onClick={() => handleResizeClick(vol)}
                                      className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                    >
                                        <Sliders size={14} /> Resize
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-neutral-700 my-1"></div>
                                    <button 
                                      onClick={() => handleDeleteClick(vol)}
                                      className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                         </td>
                      </tr>
                   )})}
                </tbody>
             </table>
          </div>
          {volumes.length === 0 && (
             <div className="p-10 text-center text-gray-400">
                No block storage volumes found. Create one to get started.
             </div>
          )}
       </div>

       {showAddModal && <CreateVolumeModal onClose={() => setShowAddModal(false)} onCreate={handleCreateVolume} />}
       {showAttachModal && targetVolume && (
          <AttachVolumeModal 
             volumeName={targetVolume.name} 
             onClose={() => setShowAttachModal(false)} 
             onAttach={handleAttachSubmit} 
          />
       )}
       {showResizeModal && targetVolume && (
          <ResizeVolumeModal 
             volume={targetVolume}
             onClose={() => setShowResizeModal(false)}
             onResize={handleResizeSubmit}
          />
       )}
       {deleteConfig && (
          <DeleteVolumeModal 
             volumeName={deleteConfig.volume?.name}
             count={deleteConfig.type === 'bulk' ? selectedVolumeIds.size : 1}
             onClose={() => setDeleteConfig(null)}
             onConfirm={handleDeleteConfirm}
          />
       )}
    </div>
  );
};
