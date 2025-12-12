
import React from 'react';
import { Capsule } from '../../Capsule';
import { Database, Shield } from 'lucide-react';

interface StorageSatelliteProps {
  isProvisioning: boolean;
  isActive: boolean;
  onClick: () => void;
}

export const StorageSatellite: React.FC<StorageSatelliteProps> = ({ isProvisioning, isActive, onClick }) => {
  return (
    <Capsule 
      title="Data Persistency" 
      type="satellite"
      status="neutral"
      onClick={onClick}
      isExpanded={isActive}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg"><Database size={20} /></div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Storage</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">NVMe SSD • {isProvisioning ? 'Mounting...' : '34% Used'}</div>
        </div>
      </div>
      <div className="text-xs text-gray-400 flex items-center gap-1">
        <Shield size={12} className="text-green-500" /> Auto-backup enabled (Daily)
      </div>
    </Capsule>
  );
};
