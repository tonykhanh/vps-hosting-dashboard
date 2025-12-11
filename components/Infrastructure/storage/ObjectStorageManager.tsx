import React, { useState } from 'react';
import { Box, Plus, Server, CheckCircle2, MoreVertical, Globe, Settings, Trash2 } from 'lucide-react';
import { Button } from '../../Button';
import { CreateBucketModal } from './CreateBucketModal';

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

export const ObjectStorageManager: React.FC = () => {
  const [buckets, setBuckets] = useState(MOCK_BUCKETS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

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
          {buckets.map(bucket => (
             <div key={bucket.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all group relative">
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
                         <MoreVertical size={16} />
                      </button>
                   </div>
                </div>
                
                {/* Dropdown */}
                {activeDropdown === bucket.id && (
                   <div className="absolute right-6 top-14 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                      <button className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                         <Globe size={14} /> Browse
                      </button>
                      <button className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                         <Settings size={14} /> Settings
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-neutral-700 my-1"></div>
                      <button className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
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
                   <Button size="sm" variant="secondary" className="w-full text-xs dark:bg-neutral-700 dark:text-white dark:border-neutral-600">
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

       {showAddModal && <CreateBucketModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};