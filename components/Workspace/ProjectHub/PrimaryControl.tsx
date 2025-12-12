
import React from 'react';
import { Capsule } from '../../Capsule';
import { Badge } from '../../Badge';
import { Button } from '../../Button';
import { RefreshCw, Power, Loader2, Globe, Cloud, HardDrive, Sparkles, Play } from 'lucide-react';
import { Project, ProjectStatus } from '../../../types';
import { ActionType } from '../../ActionFlow';

interface PrimaryControlProps {
  project: Project;
  isProvisioning: boolean;
  onAction: (type: ActionType) => void;
}

export const PrimaryControl: React.FC<PrimaryControlProps> = ({ project, isProvisioning, onAction }) => {
  const isStopped = project.status === ProjectStatus.STOPPED;
  const isBuilding = project.status === ProjectStatus.BUILDING;

  return (
    <div className="relative z-20 transform transition-all duration-500 order-1 lg:order-2">
      <Capsule
        title={project.name}
        type="primary"
        className={`min-h-[420px] flex flex-col justify-between transition-all ${isStopped ? 'grayscale opacity-90' : ''}`}
      >
        {/* Project Hologram Content */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <Badge status={project.status} />
            {/* Always render badge to prevent layout jump, just dim it if building */}
            <span className={`text-xs font-mono text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded transition-opacity ${isProvisioning || isBuilding ? 'opacity-50' : 'opacity-100'}`}>
              v2.4.0
            </span>
          </div>

          <div className="text-center py-4">
            <div className={`inline-block p-4 rounded-full mb-4 ring-1 relative transition-all duration-500 ${isStopped
              ? 'bg-gray-100 dark:bg-white/5 ring-gray-200 dark:ring-white/10'
              : 'bg-plasma-50 dark:bg-transparent ring-plasma-200 dark:ring-plasma-500/30'
              }`}>
              {!isStopped && <div className="absolute inset-0 bg-plasma-400/20 blur-xl rounded-full animate-pulse-slow"></div>}

              {isProvisioning || isBuilding ? (
                <Loader2 size={48} className="text-plasma-600 dark:text-plasma-400 relative z-10 animate-spin" />
              ) : isStopped ? (
                <Power size={48} className="text-gray-400 dark:text-gray-500 relative z-10" />
              ) : (
                <Globe size={48} className="text-plasma-600 dark:text-plasma-400 relative z-10" />
              )}
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{project.domain}</h2>
            <div className="mt-2 flex justify-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1"><Cloud size={12} /> {project.region.toUpperCase()}</span>
              <span className="flex items-center gap-1"><HardDrive size={12} /> {project.ip}</span>
            </div>
          </div>

          {/* Unified Status Container - Fixed Height [130px] to prevent jump */}
          <div className={`
            rounded-xl p-4 relative overflow-hidden shadow-lg transition-all duration-500 h-[130px] flex flex-col justify-center
            ${isStopped
              ? 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10'
              : 'bg-white dark:bg-neutral-900 border border-plasma-100 dark:border-white/10 shadow-sm dark:shadow-none'}
          `}>
            <div className="animate-in fade-in duration-300">
              <div className="absolute top-0 right-0 p-2 opacity-50 dark:opacity-20"><Sparkles className="text-plasma-600 dark:text-white" /></div>
              <h4 className="text-xs text-plasma-600 dark:text-neon-mint font-bold uppercase tracking-wider mb-1">AI Prediction</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Traffic is expected to spike by <span className="text-gray-900 dark:text-white font-bold">~20%</span> in the next 12 hours based on historical trends.
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {isStopped ? (
            <Button
              variant="primary"
              className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20 col-span-2"
              onClick={() => onAction('START')}
            >
              <Play size={16} className="mr-2" /> Resume Capsule
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                className="w-full bg-plasma-600 hover:bg-plasma-700 shadow-lg shadow-plasma-500/20"
                onClick={() => onAction('DEPLOY')}
                disabled={isProvisioning || isBuilding}
              >
                {isBuilding ? <Loader2 size={16} className="mr-2 animate-spin" /> : <RefreshCw size={16} className="mr-2" />}
                {isBuilding ? 'Building...' : 'Redeploy'}
              </Button>
              <Button
                variant="danger"
                className="w-full shadow-lg shadow-red-500/20"
                onClick={() => onAction('STOP')}
                disabled={isProvisioning || isBuilding}
              >
                <Power size={16} className="mr-2" /> Stop
              </Button>
            </>
          )}
        </div>
      </Capsule>
    </div>
  );
};
