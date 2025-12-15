
import React, { useState } from 'react';
import { 
  Box, Plus, Server, CheckCircle2, MoreVertical, Globe, Settings, Trash2, ArrowLeft, Upload, FileText, Image, Download, X
} from 'lucide-react';
import { Button } from '../../Button';
import { CreateBucketModal } from './CreateBucketModal';
import { BucketSettingsModal } from './BucketSettingsModal';
import { UploadFileModal } from './UploadFileModal';
import { DeleteFileModal } from './DeleteFileModal';
import { DeleteBucketModal } from './DeleteBucketModal';

const MOCK_BUCKETS = [
  { 
    id: 'b-1', 
    name: 'nebula-user-uploads', 
    region: 'Global', 
    storageUsed: '45 GB', 
    bandwidth: '120 GB', 
    objects: '12.4k', 
    access: 'private',
    status: 'active'
  },
  { 
    id: 'b-2', 
    name: 'static-site-assets', 
    region: 'sg-1', 
    storageUsed: '1.2 GB', 
    bandwidth: '850 GB', 
    objects: '450', 
    access: 'public',
    status: 'active'
  },
];

const MOCK_FILES = [
  { id: 'f-1', name: 'logo.png', size: '2.4 MB', type: 'image/png', lastModified: '2024-05-20 10:00' },
  { id: 'f-2', name: 'index.html', size: '12 KB', type: 'text/html', lastModified: '2024-05-22 14:30' },
  { id: 'f-3', name: 'data_backup.json', size: '45 MB', type: 'application/json', lastModified: '2024-05-25 09:15' },
  { id: 'f-4', name: 'styles.css', size: '4 KB', type: 'text/css', lastModified: '2024-05-22 14:35' },
];

export const ObjectStorageManager: React.FC = () => {
  const [buckets, setBuckets] = useState(MOCK_BUCKETS);
  const [view, setView] = useState<'list' | 'details'>('list');
  const [selectedBucket, setSelectedBucket] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // File Browser State
  const [files, setFiles] = useState(MOCK_FILES);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Delete Modal State
  const [deleteConfig, setDeleteConfig] = useState<{ type: 'single' | 'bulk', file?: {id: string, name: string} } | null>(null);
  const [bucketToDelete, setBucketToDelete] = useState<any>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Bucket Logic
  const handleCreateBucket = (data: any) => {
    const newBucket = {
      id: `b-${Date.now()}`,
      name: data.name,
      region: data.region,
      storageUsed: '0 GB',
      bandwidth: '0 GB',
      objects: '0',
      access: 'private',
      status: 'active'
    };
    setBuckets(prev => [...prev, newBucket]);
    setShowAddModal(false);
  };

  const initiateDeleteBucket = (bucket: any) => {
    setBucketToDelete(bucket);
    setActiveDropdown(null);
  };

  const confirmDeleteBucket = () => {
    if (bucketToDelete) {
      setBuckets(prev => prev.filter(b => b.id !== bucketToDelete.id));
      setBucketToDelete(null);
    }
  };

  const handleUpdateBucket = (updatedBucket: any) => {
    setBuckets(prev => prev.map(b => b.id === updatedBucket.id ? updatedBucket : b));
    setSelectedBucket(updatedBucket); // Update the currently view object
  };

  const handleManageBucket = (bucket: any) => {
    setSelectedBucket(bucket);
    setSelectedFileIds(new Set()); // Reset selections
    setFiles(MOCK_FILES); // In real app, fetch files for this bucket
    setView('details');
    setActiveDropdown(null);
  };

  // File Logic
  const handleToggleFile = (id: string) => {
    const newSet = new Set(selectedFileIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedFileIds(newSet);
  };

  const handleToggleAllFiles = () => {
    if (selectedFileIds.size === files.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(files.map(f => f.id)));
    }
  };

  const handleDeleteFileClick = (file: { id: string, name: string }) => {
    setDeleteConfig({ type: 'single', file });
  };

  const handleBulkDeleteClick = () => {
    setDeleteConfig({ type: 'bulk' });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfig) return;

    if (deleteConfig.type === 'single' && deleteConfig.file) {
      // Single delete
      setFiles(prev => prev.filter(f => f.id !== deleteConfig.file!.id));
      if (selectedFileIds.has(deleteConfig.file!.id)) {
        const newSet = new Set(selectedFileIds);
        newSet.delete(deleteConfig.file!.id);
        setSelectedFileIds(newSet);
      }
    } else if (deleteConfig.type === 'bulk') {
      // Bulk delete
      setFiles(prev => prev.filter(f => !selectedFileIds.has(f.id)));
      setSelectedFileIds(new Set());
    }
    setDeleteConfig(null);
  };

  const handleDownload = (fileName: string) => {
    // Mock download action
    alert(`Downloading ${fileName}...`);
  };

  const handleUpload = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: `f-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'application/octet-stream',
      lastModified: 'Just now'
    }));
    setFiles(prev => [...newFiles, ...prev]);
  };

  // --- DETAILS VIEW (FILE BROWSER) ---
  if (view === 'details' && selectedBucket) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setView('list'); setSelectedBucket(null); }}
              className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            <div>
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 {selectedBucket.name}
               </h1>
               <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Server size={12}/> {selectedBucket.region}</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Active</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${selectedBucket.access === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedBucket.access}
                  </span>
               </div>
            </div>
          </div>
          <div className="flex gap-2">
             <Button 
                variant="secondary" 
                className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                onClick={() => setShowSettingsModal(true)}
             >
               <Settings size={16} className="mr-2"/> Settings
             </Button>
             <Button onClick={() => setShowUploadModal(true)}>
               <Upload size={16} className="mr-2"/> Upload File
             </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedFileIds.size > 0 && (
           <div className="bg-plasma-50 dark:bg-plasma-900/20 border border-plasma-200 dark:border-plasma-800 p-3 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                 <div className="bg-plasma-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {selectedFileIds.size}
                 </div>
                 <span className="text-sm font-medium text-plasma-900 dark:text-white">Selected</span>
              </div>
              <div className="flex gap-2">
                 <button 
                    onClick={() => setSelectedFileIds(new Set())}
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

        {/* Stats Bar (Hidden on small screens if needed, but useful) */}
        <div className="grid grid-cols-3 gap-4">
           <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Storage Used</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{selectedBucket.storageUsed}</div>
           </div>
           <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Bandwidth (Month)</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{selectedBucket.bandwidth}</div>
           </div>
           <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Object Count</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{files.length}</div>
           </div>
        </div>

        {/* File List */}
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm min-h-[400px]">
           <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                    <tr>
                       <th className="px-6 py-4 w-12">
                          <input 
                             type="checkbox" 
                             className="rounded border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer"
                             checked={files.length > 0 && selectedFileIds.size === files.length}
                             onChange={handleToggleAllFiles}
                          />
                       </th>
                       <th className="px-6 py-4">Name</th>
                       <th className="px-6 py-4">Size</th>
                       <th className="px-6 py-4">Type</th>
                       <th className="px-6 py-4">Last Modified</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                    {files.map(file => {
                       const isSelected = selectedFileIds.has(file.id);
                       return (
                       <tr key={file.id} className={`hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors group ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                          <td className="px-6 py-4">
                             <input 
                                type="checkbox" 
                                className="rounded border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 accent-plasma-600 w-4 h-4 cursor-pointer" 
                                checked={isSelected}
                                onChange={() => handleToggleFile(file.id)}
                             />
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3 font-medium text-gray-900 dark:text-white">
                                <div className="text-gray-400">
                                   {file.type.includes('image') ? <Image size={18}/> : <FileText size={18}/>}
                                </div>
                                <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{file.size}</td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{file.type}</td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{file.lastModified}</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                   className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-plasma-600" 
                                   title="Download"
                                   onClick={() => handleDownload(file.name)}
                                >
                                   <Download size={16} />
                                </button>
                                <button 
                                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600"
                                  onClick={() => handleDeleteFileClick(file)}
                                  title="Delete"
                                >
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    )})}
                    {files.length === 0 && (
                       <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-400">
                             <Box size={48} className="mx-auto mb-4 opacity-20" />
                             <p>This bucket is empty.</p>
                             <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowUploadModal(true)}>Upload File</Button>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Modals for Details View */}
        {showSettingsModal && (
           <BucketSettingsModal 
              bucket={selectedBucket} 
              onClose={() => setShowSettingsModal(false)}
              onSave={handleUpdateBucket}
           />
        )}
        
        {showUploadModal && (
           <UploadFileModal 
              onClose={() => setShowUploadModal(false)}
              onUpload={handleUpload}
           />
        )}

        {deleteConfig && (
           <DeleteFileModal 
              onClose={() => setDeleteConfig(null)}
              onConfirm={handleConfirmDelete}
              count={deleteConfig.type === 'bulk' ? selectedFileIds.size : 1}
              fileName={deleteConfig.file?.name}
           />
        )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Object Storage</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">S3-compatible scalable storage buckets.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
             <Plus size={16} className="mr-2"/> Create Bucket
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buckets.map((bucket, index) => (
             <div 
               key={bucket.id} 
               onClick={() => handleManageBucket(bucket)}
               className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all group relative cursor-pointer overflow-visible"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                      <Box size={24} />
                   </div>
                   <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${bucket.access === 'public' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'}`}>
                         {bucket.access}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleDropdown(bucket.id); }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg text-gray-400"
                      >
                         <MoreVertical size={16} className="rotate-90" />
                      </button>
                   </div>
                </div>
                
                {/* Dropdown */}
                {activeDropdown === bucket.id && (
                   <div className={`absolute right-6 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= buckets.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-14 origin-top-right'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleManageBucket(bucket); }}
                        className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                         <Globe size={14} /> Browse
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-neutral-700 my-1"></div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); initiateDeleteBucket(bucket); }}
                        className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                         <Trash2 size={14} /> Delete
                      </button>
                   </div>
                )}
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">{bucket.name}</h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1">
                   <Server size={10} /> {bucket.region.toUpperCase()}
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between text-xs border-b border-gray-50 dark:border-neutral-700 pb-2">
                      <span className="text-gray-500 dark:text-gray-400">Storage Used</span>
                      <span className="font-bold text-gray-900 dark:text-white">{bucket.storageUsed}</span>
                   </div>
                   <div className="flex justify-between text-xs border-b border-gray-50 dark:border-neutral-700 pb-2">
                      <span className="text-gray-500 dark:text-gray-400">Bandwidth (Mo)</span>
                      <span className="font-bold text-gray-900 dark:text-white">{bucket.bandwidth}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Total Objects</span>
                      <span className="font-bold text-gray-900 dark:text-white">{bucket.objects}</span>
                   </div>
                </div>

                <div className="mt-6">
                   <Button size="sm" variant="secondary" className="w-full text-xs dark:bg-neutral-700 dark:text-white dark:border-neutral-600" onClick={(e) => { e.stopPropagation(); handleManageBucket(bucket); }}>
                      Manage Bucket
                   </Button>
                </div>
             </div>
          ))}
          
          {/* Add Bucket Placeholder */}
          <div 
             onClick={() => setShowAddModal(true)}
             className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500 hover:border-plasma-300 dark:hover:border-plasma-500/50 hover:text-plasma-500 dark:hover:text-plasma-400 hover:bg-plasma-50/10 dark:hover:bg-plasma-900/10 transition-all cursor-pointer min-h-[320px]"
          >
             <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={24} />
             </div>
             <span className="font-bold">Create New Bucket</span>
          </div>
       </div>

       {showAddModal && <CreateBucketModal onClose={() => setShowAddModal(false)} onCreate={handleCreateBucket} />}
       
       {bucketToDelete && (
          <DeleteBucketModal 
             bucketName={bucketToDelete.name}
             onClose={() => setBucketToDelete(null)}
             onConfirm={confirmDeleteBucket}
          />
       )}
    </div>
  );
};
