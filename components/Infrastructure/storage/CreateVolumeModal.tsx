import React, { useState, useMemo } from 'react';
import { X, HardDrive, CheckCircle2, Server, Search, Check, Disc, Info } from 'lucide-react';
import { Button } from '../../Button';
import { LOCATIONS, REGIONS, IMAGES } from '../../../constants';

interface CreateVolumeModalProps {
  onClose: () => void;
}

export const CreateVolumeModal: React.FC<CreateVolumeModalProps> = ({ onClose }) => {
  const [volumeType, setVolumeType] = useState<'hdd' | 'nvme'>('nvme');
  const [activeRegion, setActiveRegion] = useState('All Locations');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('us-e');
  const [isBootable, setIsBootable] = useState(false);
  const [selectedOS, setSelectedOS] = useState(IMAGES.os[0].id);
  const [size, setSize] = useState(10);
  const [label, setLabel] = useState('');

  // Pricing: $0.025/GB for HDD, $0.10/GB for NVMe
  const pricePerGB = volumeType === 'hdd' ? 0.025 : 0.10;
  const price = size * pricePerGB;

  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(loc => {
      const matchRegion = activeRegion === 'All Locations' || loc.region === activeRegion;
      const matchSearch = loc.name.toLowerCase().includes(locationSearch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [activeRegion, locationSearch]);

  const handleCreate = () => {
    // Logic to create volume would go here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-neutral-700">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
               <span className="sr-only">Back</span>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add Block Storage</h1>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* 1. Volume Type */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setVolumeType('hdd')}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 hover:shadow-md
                  ${volumeType === 'hdd' 
                    ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                    : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                `}
              >
                <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-700 h-fit shadow-sm">
                   <HardDrive size={32} className="text-blue-500" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white">Block Storage (HDD)</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      Affordable, scalable persistent hard disk storage. Ideal for backups and large datasets.
                   </p>
                   <div className="mt-4 flex gap-4 text-xs font-medium">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Globally Available</span>
                      <span className="text-gray-500 dark:text-gray-400 py-1">Starting from $1 / 40GB</span>
                   </div>
                </div>
                {volumeType === 'hdd' && <div className="absolute top-0 right-0 p-2 bg-plasma-500 text-white rounded-bl-xl rounded-tr-lg"><Check size={16}/></div>}
              </div>

              <div 
                onClick={() => setVolumeType('nvme')}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 hover:shadow-md
                  ${volumeType === 'nvme' 
                    ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                    : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                `}
              >
                <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-700 h-fit shadow-sm">
                   <Server size={32} className="text-purple-500" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white">Block Storage (NVMe)</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      High performance storage for workloads requiring rapid I/O.
                   </p>
                   <div className="mt-4 flex gap-4 text-xs font-medium">
                      <span className="bg-plasma-600 text-white px-2 py-1 rounded">High Performance</span>
                      <span className="text-gray-500 dark:text-gray-400 py-1">Starting from $1 / 10GB</span>
                   </div>
                </div>
                {volumeType === 'nvme' && <div className="absolute top-0 right-0 p-2 bg-plasma-500 text-white rounded-bl-xl rounded-tr-lg"><Check size={16}/></div>}
              </div>
            </div>
          </section>

          {/* 2. Location */}
          <section>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Storage Location</h3>
             <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
                {/* Region Tabs */}
                <div className="flex border-b border-gray-100 dark:border-neutral-700 overflow-x-auto">
                   {['All Locations', ...REGIONS].map(region => (
                      <button
                         key={region}
                         onClick={() => setActiveRegion(region)}
                         className={`
                            px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2
                            ${activeRegion === region 
                               ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400 bg-plasma-50/50 dark:bg-plasma-500/10' 
                               : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                         `}
                      >
                         {region}
                      </button>
                   ))}
                </div>
                
                {/* Locations Grid */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                   {filteredLocations.map(loc => (
                      <div 
                         key={loc.id}
                         onClick={() => setSelectedLocation(loc.id)}
                         className={`
                            p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                            ${selectedLocation === loc.id 
                               ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                               : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                         `}
                      >
                         <span className="text-2xl">{loc.flag}</span>
                         <div className="overflow-hidden">
                            <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{loc.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{loc.region}</div>
                         </div>
                         {selectedLocation === loc.id && <CheckCircle2 size={16} className="ml-auto text-plasma-600 dark:text-plasma-400 flex-shrink-0" />}
                      </div>
                   ))}
                </div>
             </div>
          </section>

          {/* 3. Storage Options */}
          <section>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Storage Options</h3>
             <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                <label className="flex items-center gap-3 cursor-pointer">
                   <div 
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isBootable ? 'bg-plasma-600 border-plasma-600 text-white' : 'bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-600'}`}
                      onClick={() => setIsBootable(!isBootable)}
                   >
                      {isBootable && <Check size={14} />}
                   </div>
                   <span className="text-sm font-bold text-gray-900 dark:text-white select-none" onClick={() => setIsBootable(!isBootable)}>Bootable Volume</span>
                   <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto hidden sm:inline">Bootable block volume available.</span>
                </label>
             </div>
          </section>

          {/* 4. OS Selection (Only if Bootable) */}
          {isBootable && (
             <section className="animate-in fade-in slide-in-from-top-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Operating System</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {IMAGES.os.map(os => (
                      <div 
                         key={os.id}
                         onClick={() => setSelectedOS(os.id)}
                         className={`
                            p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2
                            ${selectedOS === os.id 
                               ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                               : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                         `}
                      >
                         <img src={os.icon} alt={os.name} className="w-10 h-10 object-contain" />
                         <div className="font-bold text-sm text-gray-900 dark:text-white">{os.name}</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400">Select Version ▼</div>
                      </div>
                   ))}
                </div>
             </section>
          )}

          {/* 5. Size Slider & Pricing */}
          <section>
             <div className="p-8 bg-gray-50 dark:bg-neutral-800/50 rounded-3xl border border-gray-200 dark:border-neutral-700 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                
                <div className="flex-1 w-full space-y-6">
                   <div className="flex justify-between text-sm font-bold text-gray-500 dark:text-gray-400 px-1">
                      <span>1 GB</span>
                      <span>10,000 GB</span>
                   </div>
                   <input 
                      type="range" 
                      min="10" 
                      max="10000" 
                      step="10"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-plasma-600"
                   />
                   <div className="flex justify-between text-xs text-gray-400 px-1">
                      {[10, 700, 1600, 2500, 3500, 4500, 5500, 7000, 8500, 10000].map(val => (
                         <span key={val} className="hidden sm:inline-block relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gray-300 dark:bg-neutral-600"></span>
                            {val}
                         </span>
                      ))}
                   </div>
                   
                   <div className="flex items-center gap-8 pt-4">
                      <div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Price</div>
                         <div className="text-3xl font-bold text-plasma-600 dark:text-plasma-400">${price.toFixed(2)}<span className="text-lg text-gray-500 font-medium">/month</span></div>
                      </div>
                      <div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Storage</div>
                         <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700" onClick={() => setSize(Math.max(10, size - 10))}>-</button>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[100px] text-center">{size} GB</span>
                            <button className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700" onClick={() => setSize(Math.min(10000, size + 10))}>+</button>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="hidden md:block w-px h-32 bg-gray-200 dark:bg-neutral-700"></div>

                <div className="w-full md:w-auto flex justify-center">
                   <div className="relative w-48 h-48">
                      {/* Isometric Illustration Mockup */}
                      <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-2xl"></div>
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                         <HardDrive size={120} className="text-plasma-500 drop-shadow-2xl" strokeWidth={1} />
                         <div className="absolute bottom-4 right-4 bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-700">
                            <div className="text-[10px] font-bold text-gray-500 uppercase">Type</div>
                            <div className="text-sm font-bold text-plasma-600">{volumeType.toUpperCase()}</div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </section>

          {/* 6. Label */}
          <section>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Label</label>
             <input 
                type="text" 
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                placeholder="e.g. database-backup-vol-1"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
             />
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky bottom-0 z-10">
           <Button className="w-full py-4 text-base shadow-xl shadow-plasma-500/20" onClick={handleCreate} disabled={!label}>
              Add Block Storage
           </Button>
        </div>

      </div>
    </div>
  );
};