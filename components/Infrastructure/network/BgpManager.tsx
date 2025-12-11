import React from 'react';
import { Route, Construction, Bell, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '../../Button';

export const BgpManager: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-plasma-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="relative p-8 bg-white dark:bg-neutral-800 rounded-3xl border border-gray-200 dark:border-neutral-700 shadow-xl">
           <Route size={64} className="text-plasma-600" />
           <div className="absolute -top-3 -right-3 bg-amber-500 text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-neutral-900">
              <Construction size={20} />
           </div>
        </div>
      </div>

      <div className="max-w-xl space-y-4">
         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">BGP Routing is Under Construction</h2>
         <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            We are building a world-class global routing engine. Soon you will be able to bring your own IP ranges (BYOIP) and manage custom ASNs directly from the Nebula dashboard.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
         <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><Globe size={24}/></div>
            <div>
               <div className="font-bold text-gray-900 dark:text-white">Custom ASN</div>
               <div className="text-xs text-gray-500 dark:text-gray-400">Peer directly with our global backbone.</div>
            </div>
         </div>
         <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><ShieldCheck size={24}/></div>
            <div>
               <div className="font-bold text-gray-900 dark:text-white">BYOIP Support</div>
               <div className="text-xs text-gray-500 dark:text-gray-400">Announce and secure your own prefixes.</div>
            </div>
         </div>
      </div>

      <div className="pt-4">
         <Button size="lg" className="shadow-lg shadow-plasma-500/20 gap-2">
            <Bell size={18} /> Notify Me When Ready
         </Button>
         <p className="text-xs text-gray-400 mt-4">Expected Launch: Q4 2025</p>
      </div>
    </div>
  );
};