
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Server, Disc, Power } from 'lucide-react';
import { Button } from '../../Button';
import { VPS_LIST } from '../../../constants';

interface BootIsoModalProps {
  isoName: string;
  onClose: () => void;
  onBoot: (instanceId: string, instanceName: string) => void;
}

export const BootIsoModal: React.FC<BootIsoModalProps> = ({ isoName, onClose, onBoot }) => {
  const [selectedInstanceId, setSelectedInstanceId] = useState(VPS_LIST[0]?.id || '');

  const handleSubmit = () => {
    const instance = VPS_LIST.find(v => v.id === selectedInstanceId);
    if (instance) {
      onBoot(instance.id, instance.name);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Disc size={20} className="text-plasma-600"/> Boot ISO
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl mb-6">
            <div className="flex gap-3">
                <Power size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                    The selected server will be <strong>rebooted immediately</strong> to boot from <span className="font-semibold">{isoName}</span>.
                </p>
            </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Select Instance</label>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {VPS_LIST.map(vps => (
              <div 
                key={vps.id}
                onClick={() => setSelectedInstanceId(vps.id)}
                className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  selectedInstanceId === vps.id 
                    ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20' 
                    : 'border-gray-100 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedInstanceId === vps.id ? 'bg-plasma-100 text-plasma-600' : 'bg-gray-100 text-gray-500 dark:bg-neutral-800'}`}>
                  <Server size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{vps.name}</div>
                  <div className="text-xs text-gray-500">{vps.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
          <Button onClick={handleSubmit} className="flex-1 shadow-lg shadow-plasma-500/20">Boot Server</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
