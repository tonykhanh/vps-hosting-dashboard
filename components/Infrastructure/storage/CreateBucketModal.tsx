import React, { useState, useMemo } from 'react';
import { X, Box, Check, Search, Info, Globe } from 'lucide-react';
import { Button } from '../../Button';
import { LOCATIONS, REGIONS } from '../../../constants';

interface CreateBucketModalProps {
  onClose: () => void;
}

const STORAGE_PLANS = [
  {
    id: 'accelerated',
    name: 'Accelerated',
    desc: 'Fast storage for the most demanding write-heavy uses.',
    badge: 'Performance Optimized',
    price: 100.00,
    icon: '🚀'
  },
  {
    id: 'performance',
    name: 'Performance',
    desc: 'Low-latency storage for datacenter workloads.',
    badge: 'Performance Optimized',
    price: 50.00,
    icon: '⚡'
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Reliable and durable storage for a variety of uses.',
    badge: 'Capacity Optimized',
    price: 36.00,
    icon: '💎'
  },
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Affordable bulk storage with data readily available.',
    badge: 'Capacity Optimized',
    price: 18.00,
    icon: '📦'
  }
];

export const CreateBucketModal: React.FC<CreateBucketModalProps> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('performance');
  const [activeRegion, setActiveRegion] = useState('All Locations');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('us-e');
  const [label, setLabel] = useState('');

  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(loc => {
      const matchRegion = activeRegion === 'All Locations' || loc.region === activeRegion;
      const matchSearch = loc.name.toLowerCase().includes(locationSearch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [activeRegion, locationSearch]);

  const handleCreate = () => {
    // Logic to create bucket would go here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-neutral-700">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
               <span className="sr-only">Back</span>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add Object Storage</h1>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* 1. Plan Selection */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STORAGE_PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`
                    relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md h-full
                    ${selectedPlan === plan.id 
                      ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-500/20 ring-1 ring-plasma-500 dark:border-plasma-400' 
                      : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50'}
                  `}
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-700 h-fit shadow-sm text-2xl">
                       {plan.icon}
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-gray-900 dark:text-white">{plan.name}</h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                          {plan.desc}
                       </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-end justify-between">
                     <span className={`text-xs font-bold px-2 py-1 rounded ${
                        plan.badge.includes('Performance') 
                           ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                           : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                     }`}>
                        {plan.badge}
                     </span>
                     <div className="text-right">
                        <span className="text-xs text-gray-400">Base Price</span>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">${plan.price.toFixed(2)}</div>
                     </div>
                  </div>

                  {selectedPlan === plan.id && (
                    <div className="absolute top-0 right-0 p-2 bg-plasma-500 text-white rounded-bl-xl rounded-tr-lg">
                      <Check size={16}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 2. Location */}
          <section>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Storage Location</h3>
             </div>
             
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
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{loc.id.toUpperCase()}</div>
                         </div>
                         {isSelected && <div className="ml-auto text-plasma-600 dark:text-plasma-400"><Check size={16} /></div>}
                      </div>
                   )})}
                </div>
             </div>
          </section>

          {/* 3. Pricing Details */}
          <section className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-gray-100 dark:border-neutral-700 shadow-sm">
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">Additional pricing details</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-plasma-600 dark:text-plasma-400">1000</span>
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">GB of storage included</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-plasma-600 dark:text-plasma-400">1</span>
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">TB of bandwidth included</span>
                   </div>
                </div>
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-neutral-700 pt-4 md:pt-0 md:pl-8">
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-plasma-600 dark:text-plasma-400">$0.05</span>
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">per additional GB stored</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-plasma-600 dark:text-plasma-400">$10</span>
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">per additional TB transferred</span>
                   </div>
                </div>
             </div>
          </section>

          {/* 4. Label */}
          <section>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Label</label>
             <input 
                type="text" 
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                placeholder="e.g. assets-bucket-production"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
             />
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky bottom-0 z-10">
           <Button className="w-full py-4 text-base shadow-xl shadow-plasma-500/20" onClick={handleCreate} disabled={!label}>
              Add Object Storage
           </Button>
        </div>

      </div>
    </div>
  );
};