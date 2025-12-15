
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sliders, ArrowRight } from 'lucide-react';
import { Button } from '../../Button';

interface ResizeVolumeModalProps {
  volume: { name: string; size: number; cost: number; type: string };
  onClose: () => void;
  onResize: (newSize: number, newCost: number) => void;
}

export const ResizeVolumeModal: React.FC<ResizeVolumeModalProps> = ({ volume, onClose, onResize }) => {
  const [newSize, setNewSize] = useState(volume.size);
  
  // Pricing: $0.025/GB for HDD, $0.10/GB for NVMe (Simplified logic)
  const pricePerGB = volume.type === 'NVMe' ? 0.10 : 0.025;
  const newPrice = newSize * pricePerGB;

  const handleResize = () => {
    onResize(newSize, newPrice);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sliders size={20} className="text-plasma-600"/> Resize Volume
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-sm mb-6">
           <strong>Note:</strong> Volumes can only be increased in size. To decrease size, you must create a new smaller volume and migrate data.
        </div>

        <div className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <div className="text-center">
                 <div className="text-sm text-gray-500 uppercase font-bold mb-1">Current</div>
                 <div className="text-2xl font-bold text-gray-900 dark:text-white">{volume.size} GB</div>
                 <div className="text-xs text-gray-400">${volume.cost.toFixed(2)}/mo</div>
              </div>
              <ArrowRight size={24} className="text-gray-300" />
              <div className="text-center">
                 <div className="text-sm text-plasma-600 uppercase font-bold mb-1">New Size</div>
                 <div className="text-2xl font-bold text-plasma-600">{newSize} GB</div>
                 <div className="text-xs text-plasma-400">${newPrice.toFixed(2)}/mo</div>
              </div>
           </div>

           <div>
              <input 
                 type="range" 
                 min={volume.size} 
                 max={10000} 
                 step={10}
                 value={newSize}
                 onChange={(e) => setNewSize(parseInt(e.target.value))}
                 className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-plasma-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                 <span>{volume.size} GB</span>
                 <span>10,000 GB</span>
              </div>
           </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
          <Button onClick={handleResize} className="flex-1 shadow-lg shadow-plasma-500/20" disabled={newSize <= volume.size}>
             Resize Volume
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
