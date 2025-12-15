
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sliders, ArrowRight } from 'lucide-react';
import { Button } from '../../Button';

interface ResizeFileSystemModalProps {
  fileSystem: { name: string; size: string; cost: number };
  onClose: () => void;
  onResize: (newSize: string, newCost: number) => void;
}

const SIZE_STEPS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

export const ResizeFileSystemModal: React.FC<ResizeFileSystemModalProps> = ({ fileSystem, onClose, onResize }) => {
  const currentSizeInt = parseInt(fileSystem.size.replace(/\D/g, ''));
  const currentStepIndex = SIZE_STEPS.findIndex(s => s >= currentSizeInt);
  const [sizeIndex, setSizeIndex] = useState(currentStepIndex !== -1 ? currentStepIndex : 0);
  
  const newSize = SIZE_STEPS[sizeIndex];
  const newPrice = newSize * 0.10; // $0.10 per GB

  const handleResize = () => {
    onResize(`${newSize} GB`, newPrice);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sliders size={20} className="text-plasma-600"/> Resize File System
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-200 text-sm mb-6">
           File systems can be resized non-disruptively. Increasing size is instant.
        </div>

        <div className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <div className="text-center">
                 <div className="text-sm text-gray-500 uppercase font-bold mb-1">Current</div>
                 <div className="text-2xl font-bold text-gray-900 dark:text-white">{fileSystem.size}</div>
                 <div className="text-xs text-gray-400">${fileSystem.cost.toFixed(2)}/mo</div>
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
                 min="0" 
                 max={SIZE_STEPS.length - 1} 
                 step="1"
                 value={sizeIndex}
                 onChange={(e) => setSizeIndex(parseInt(e.target.value))}
                 className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-plasma-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                 <span>{SIZE_STEPS[0]} GB</span>
                 <span>{SIZE_STEPS[SIZE_STEPS.length - 1]} GB</span>
              </div>
           </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
          <Button onClick={handleResize} className="flex-1 shadow-lg shadow-plasma-500/20" disabled={newSize === currentSizeInt}>
             Resize
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
