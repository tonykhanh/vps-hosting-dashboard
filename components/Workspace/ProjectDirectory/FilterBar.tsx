
import React from 'react';
import { Search } from 'lucide-react';
import { ProjectStatus } from '../../../types';

interface FilterBarProps {
  filter: 'all' | ProjectStatus;
  setFilter: (f: 'all' | ProjectStatus) => void;
  search: string;
  setSearch: (s: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, search, setSearch }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl p-2 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm sticky top-0 z-10">
         <div className="w-full md:w-auto flex items-center gap-2 p-1 bg-gray-100/50 dark:bg-neutral-900/50 rounded-xl overflow-x-auto">
            {['all', ProjectStatus.RUNNING, ProjectStatus.STOPPED, ProjectStatus.PROVISIONING].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {f === 'all' ? 'All Capsules' : f.charAt(0) + f.slice(1).toLowerCase().replace('_', ' ')}
              </button>
            ))}
         </div>

         <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or domain..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/50 dark:bg-neutral-900/50 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-plasma-200 dark:focus:border-plasma-800 rounded-xl text-sm outline-none transition-all dark:text-white dark:placeholder-gray-500"
            />
         </div>
      </div>
  );
};
