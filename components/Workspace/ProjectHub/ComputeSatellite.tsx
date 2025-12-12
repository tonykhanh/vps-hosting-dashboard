
import React from 'react';
import { Capsule } from '../../Capsule';
import { Button } from '../../Button';
import { Server, Loader2 } from 'lucide-react';
import { ActionType } from '../../ActionFlow';

interface ComputeSatelliteProps {
  isProvisioning: boolean;
  isActive: boolean;
  onClick: () => void;
  onAction: (type: ActionType) => void;
}

export const ComputeSatellite: React.FC<ComputeSatelliteProps> = ({ isProvisioning, isActive, onClick, onAction }) => {
  return (
    <Capsule 
      title="Compute Core (VPS)" 
      type="satellite" 
      status={isProvisioning ? "warning" : "active"}
      aiInsight={isProvisioning ? "Initializing kernel..." : "Running efficiently"}
      onClick={onClick}
      isExpanded={isActive}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isProvisioning ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 animate-pulse' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
              {isProvisioning ? <Loader2 size={20} className="animate-spin"/> : <Server size={20} />}
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Instance Type</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">High-Freq • 2 vCPU • 4GB</div>
            </div>
          </div>
          
          {!isProvisioning && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-500/20 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              Running
            </div>
          )}
        </div>
        
        {!isProvisioning && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>CPU Load</span>
              <span>24%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
              <div className="bg-plasma-500 h-1.5 rounded-full w-[24%]" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>RAM Usage</span>
              <span>42%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-1.5 rounded-full w-[42%]" />
            </div>
          </div>
        )}
        
        {isProvisioning && (
          <div className="text-xs text-amber-600 dark:text-amber-400 font-mono">
              Allocating IP address...<br/>
              Mounting volumes...
          </div>
        )}

        {isActive && !isProvisioning && (
          <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2 animate-in slide-in-from-top-2 fade-in">
            <Button 
              size="sm" 
              variant="secondary" 
              className="flex-1 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
              onClick={(e) => { e.stopPropagation(); onAction('REBOOT'); }}
            >
              Reboot
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="flex-1 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
              onClick={(e) => { e.stopPropagation(); onAction('SCALE'); }}
            >
              Resize
            </Button>
          </div>
        )}
      </div>
    </Capsule>
  );
};
