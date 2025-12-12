
import React from 'react';
import { Capsule } from '../../Capsule';
import { Button } from '../../Button';
import { GitBranch } from 'lucide-react';
import { ActionType } from '../../ActionFlow';

interface DeploymentSatelliteProps {
  isProvisioning: boolean;
  isActive: boolean;
  onClick: () => void;
  onAction: (type: ActionType) => void;
}

export const DeploymentSatellite: React.FC<DeploymentSatelliteProps> = ({ isProvisioning, isActive, onClick, onAction }) => {
  return (
    <Capsule 
      title="Deployment Flow" 
      type="satellite" 
      status={isProvisioning ? "warning" : "active"}
      onClick={onClick}
      isExpanded={isActive}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><GitBranch size={20} /></div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Current Build</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">{isProvisioning ? 'Building...' : 'commit #af392b'}</div>
        </div>
      </div>
      
      <div className="space-y-3">
          <div className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-white/5 rounded border border-gray-100 dark:border-white/5">
            <span className="text-gray-500 dark:text-gray-400">Last deployed</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{isProvisioning ? 'Never' : '2h ago'}</span>
          </div>
          {isActive && !isProvisioning && (
            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
              <div className="text-xs text-gray-400 pl-1">Recent Commits</div>
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer rounded">#8821a - Fix header CSS</div>
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer rounded">#9912b - Update deps</div>
              <Button 
                size="sm" 
                variant="secondary" 
                className="w-full mt-2 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
                onClick={(e) => { e.stopPropagation(); onAction('ROLLBACK'); }}
              >
                Rollback
              </Button>
            </div>
          )}
      </div>
    </Capsule>
  );
};
