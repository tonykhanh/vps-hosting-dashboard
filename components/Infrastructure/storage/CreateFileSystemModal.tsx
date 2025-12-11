import React, { useState, useMemo } from 'react';
import { X, FolderOpen, CheckCircle2, Search, Check, Info } from 'lucide-react';
import { Button } from '../../Button';
import { LOCATIONS, REGIONS } from '../../../constants';

interface CreateFileSystemModalProps {
  onClose: () => void;
}

// Custom steps matching the screenshot
const SIZE_STEPS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

export const CreateFileSystemModal: React.FC<CreateFileSystemModalProps> = ({ onClose }) => {
  const [activeRegion, setActiveRegion] = useState('All Locations');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('us-e');
  const [label, setLabel] = useState('');
  
  // Slider state is index of SIZE_STEPS
  const [sizeIndex, setSizeIndex] = useState(0);
  const size = SIZE_STEPS[sizeIndex];

  // Pricing: $0.10/GB
  const price = size * 0.10;

  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(loc => {
      const matchRegion = activeRegion === 'All Locations' || loc.region === activeRegion;
      const matchSearch = loc.name.toLowerCase().includes(locationSearch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [activeRegion, locationSearch]);

  const handleCreate = () => {
    // Logic to create file system would go here
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add File System</h1>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* 1. Location */}
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
                   {filteredLocations.map(loc => {
                      const isSelected = selectedLocation === loc.id;
                      return (
                      <div 
                         key={loc.id}
                         onClick={() => setSelectedLocation(loc.id)}
                         className={`
                            p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                            ${isSelected 
                               ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                               : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                         `}
                      >
                         <span className="text-2xl">{loc.flag}</span>
                         <div className="overflow-hidden">
                            <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{loc.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{loc.region}</div>
                         </div>
                         {isSelected && <div className="ml-auto text-plasma-600 dark:text-plasma-400"><Check size={16} /></div>}
                      </div>
                   )})}
                </div>
             </div>
          </section>

          {/* 2. Size Slider & Pricing */}
          <section>
             <div className="p-8 bg-gray-50 dark:bg-neutral-800/50 rounded-3xl border border-gray-200 dark:border-neutral-700 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                
                <div className="flex-1 w-full space-y-8">
                   <div className="relative">
                      {/* Slider Track */}
                      <input 
                         type="range" 
                         min="0" 
                         max={SIZE_STEPS.length - 1} 
                         step="1"
                         value={sizeIndex}
                         onChange={(e) => setSizeIndex(parseInt(e.target.value))}
                         className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-plasma-600 relative z-20"
                      />
                      
                      {/* Custom Ticks */}
                      <div className="flex justify-between text-xs text-gray-400 mt-3 absolute w-full px-1 top-2 z-10 pointer-events-none">
                         {SIZE_STEPS.map((val, idx) => (
                            <div key={val} className="flex flex-col items-center">
                               <div className="h-1.5 w-0.5 bg-gray-300 dark:bg-neutral-600 mb-1"></div>
                               <span className={`transition-colors ${idx === sizeIndex ? 'text-plasma-600 font-bold' : ''}`}>{val}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-12 pt-6">
                      <div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Price:</div>
                         <div className="text-3xl font-bold text-plasma-600 dark:text-plasma-400">${price.toFixed(2)}<span className="text-lg text-gray-500 font-medium">/month</span></div>
                      </div>
                      <div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Storage:</div>
                         <div className="flex items-center gap-3">
                            <button 
                               className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors" 
                               onClick={() => setSizeIndex(Math.max(0, sizeIndex - 1))}
                               disabled={sizeIndex === 0}
                            >
                               -
                            </button>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[120px] text-center">{size} GB</span>
                            <button 
                               className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors" 
                               onClick={() => setSizeIndex(Math.min(SIZE_STEPS.length - 1, sizeIndex + 1))}
                               disabled={sizeIndex === SIZE_STEPS.length - 1}
                            >
                               +
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="hidden md:block w-px h-40 bg-gray-200 dark:bg-neutral-700"></div>

                {/* Illustration */}
                <div className="w-full md:w-auto flex justify-center">
                   <div className="relative w-56 h-40">
                      <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl transform rotate-12"></div>
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                         <div className="relative">
                            <FolderOpen size={120} className="text-plasma-500 drop-shadow-2xl" strokeWidth={1} />
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-700 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                               <div className="text-xs font-bold text-gray-700 dark:text-gray-200">NFS Ready</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </section>

          {/* 3. Label */}
          <section>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Label</label>
             <input 
                type="text" 
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                placeholder="e.g. shared-media-assets"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
             />
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky bottom-0 z-10">
           <Button className="w-full py-4 text-base shadow-xl shadow-plasma-500/20" onClick={handleCreate} disabled={!label}>
              Add File System
           </Button>
        </div>

      </div>
    </div>
  );
};