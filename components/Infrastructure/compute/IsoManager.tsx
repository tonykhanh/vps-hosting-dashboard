
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Disc, Plus, CheckCircle2, Trash2, X, Upload, Globe, Download, MoreVertical } from 'lucide-react';
import { Button } from '../../Button';
import { IMAGES } from '../../../constants';

// Local Mock Data
const CUSTOM_ISOS = [
  { id: 'iso-1', name: 'Windows_Server_2022_Custom.iso', size: '4.5 GB', status: 'Available', uploaded: '2023-10-15' },
  { id: 'iso-2', name: 'Arch_Linux_Hardened.iso', size: '800 MB', status: 'Available', uploaded: '2023-11-02' }
];

export const IsoManager: React.FC = () => {
  const [showAddISOModal, setShowAddISOModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [newISOUrl, setNewISOUrl] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-10" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ISO Management</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Manage custom images and browse the public library.</p>
          </div>
          <Button onClick={() => setShowAddISOModal(true)}>
             <Plus size={16} className="mr-2"/> Add Custom ISO
          </Button>
       </div>

       {/* Custom ISOs Table */}
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Disc size={20} className="text-plasma-600"/> My Custom ISOs
             </h3>
             <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-gray-600 dark:text-gray-300">
                {CUSTOM_ISOS.length} / 5 Free Slots
             </span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                   <tr>
                      <th className="px-6 py-4">Filename</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Uploaded</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                   {CUSTOM_ISOS.map(iso => (
                      <tr key={iso.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group">
                         <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg text-gray-500">
                               <Disc size={18} />
                            </div>
                            {iso.name}
                         </td>
                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{iso.size}</td>
                         <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                               <CheckCircle2 size={12} /> {iso.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{iso.uploaded}</td>
                         <td className="px-6 py-4 text-right relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(iso.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeDropdown === iso.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical size={18} className="rotate-90" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === iso.id && (
                                <div className="absolute right-8 top-8 w-32 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                                    <button className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                        <Trash2 size={14} /> Remove
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

       {/* Public ISO Library */}
       <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <Globe size={18} className="text-gray-400"/> Public ISO Library
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {IMAGES.isoLibrary.map(iso => (
                <div key={iso.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-5 hover:shadow-md hover:border-plasma-300 dark:hover:border-plasma-500/50 transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-3">
                      <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-xl text-gray-600 dark:text-gray-300 group-hover:bg-plasma-50 dark:group-hover:bg-plasma-900/20 group-hover:text-plasma-600 transition-colors">
                         <iso.icon size={24} />
                      </div>
                      <div className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-600 text-gray-400 transition-colors">
                         <Download size={16} />
                      </div>
                   </div>
                   <div className="font-bold text-gray-900 dark:text-white text-lg">{iso.name}</div>
                   <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 bg-gray-100 dark:bg-neutral-700/50 px-2 py-1 rounded w-fit">
                      {iso.version}
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Add ISO Modal */}
      {showAddISOModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Disc size={20} className="text-plasma-600"/> Add Custom ISO
                 </h3>
                 <button onClick={() => setShowAddISOModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"><X size={20}/></button>
              </div>

              <div className="p-6 space-y-6">
                 {/* Tabs */}
                 <div className="flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                    <button 
                       onClick={() => setActiveTab('url')}
                       className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'url' ? 'bg-white dark:bg-neutral-700 shadow text-plasma-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                       Remote URL
                    </button>
                    <button 
                       onClick={() => setActiveTab('upload')}
                       className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-neutral-700 shadow text-plasma-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                       Upload File
                    </button>
                 </div>

                 {activeTab === 'url' ? (
                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Remote URL</label>
                       <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white text-sm"
                          placeholder="https://example.com/image.iso"
                          value={newISOUrl}
                          onChange={(e) => setNewISOUrl(e.target.value)}
                          autoFocus
                       />
                       <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-xl flex gap-2">
                          <CheckCircle2 size={16} className="shrink-0" />
                          <p>Supports HTTP/HTTPS direct links. We will fetch and store this ISO in your library.</p>
                       </div>
                    </div>
                 ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-plasma-400 transition-colors bg-gray-50 dark:bg-neutral-800/50 cursor-pointer">
                        <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm mb-3">
                           <Upload size={20} className="text-plasma-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ISO files up to 10GB allowed</p>
                    </div>
                 )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900">
                 <Button variant="secondary" onClick={() => setShowAddISOModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button className="gap-2 shadow-lg shadow-plasma-500/20" onClick={() => setShowAddISOModal(false)}>
                    {activeTab === 'url' ? <><Globe size={16}/> Fetch URL</> : <><Upload size={16}/> Upload ISO</>}
                 </Button>
              </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};
