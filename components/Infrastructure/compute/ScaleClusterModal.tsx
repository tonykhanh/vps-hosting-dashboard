
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Scaling, Server, ArrowRight } from 'lucide-react';
import { Button } from '../../Button';

interface ScaleClusterModalProps {
  cluster: { name: string; nodeCount?: number; plan?: string };
  onClose: () => void;
  onScale: (count: number) => void;
}

export const ScaleClusterModal: React.FC<ScaleClusterModalProps> = ({ cluster, onClose, onScale }) => {
  // Default to existing count or 3 if undefined
  const currentNodes = cluster.nodeCount || 3;
  const [nodes, setNodes] = useState(currentNodes);
  
  // Mock price per node based on a standard plan ($20/mo)
  const pricePerNode = 20;
  const currentCost = currentNodes * pricePerNode;
  const newCost = nodes * pricePerNode;

  const handleScale = () => {
    onScale(nodes);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Scaling size={20} className="text-plasma-600"/> Scale Node Pool
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-200 text-sm mb-6 flex gap-3">
           <Server size={20} className="shrink-0 mt-0.5" />
           <div>
              <strong className="block mb-1">Target Cluster: {cluster.name}</strong>
              Scaling operates on the default node pool. New nodes will be provisioned in the same region.
           </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <div className="text-center">
                 <div className="text-sm text-gray-500 uppercase font-bold mb-1">Current</div>
                 <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentNodes} Nodes</div>
                 <div className="text-xs text-gray-400">${currentCost}/mo</div>
              </div>
              <ArrowRight size={24} className="text-gray-300" />
              <div className="text-center">
                 <div className="text-sm text-plasma-600 uppercase font-bold mb-1">New Target</div>
                 <div className="text-2xl font-bold text-plasma-600">{nodes} Nodes</div>
                 <div className="text-xs text-plasma-400">${newCost}/mo</div>
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Node Count</label>
              <div className="flex items-center gap-4">
                 <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    step="1"
                    value={nodes}
                    onChange={(e) => setNodes(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-plasma-600"
                 />
                 <input 
                    type="number"
                    min="1"
                    max="20"
                    value={nodes}
                    onChange={(e) => setNodes(parseInt(e.target.value))}
                    className="w-16 p-2 text-center font-bold bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg dark:text-white"
                 />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                 <span>1 Node</span>
                 <span>20 Nodes</span>
              </div>
           </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
          <Button onClick={handleScale} className="flex-1 shadow-lg shadow-plasma-500/20" disabled={nodes === currentNodes}>
             Resize Pool
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
