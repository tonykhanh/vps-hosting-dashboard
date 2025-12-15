
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../Button';

interface DeleteDomainModalProps {
  domainName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteDomainModal: React.FC<DeleteDomainModalProps> = ({ domainName, onClose, onConfirm }) => {
  const [confirmName, setConfirmName] = useState('');
  const isMatch = confirmName === domainName;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
            <AlertTriangle size={32} strokeWidth={2} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Remove Domain?</h3>
          
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
            Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{domainName}</span>? 
            This will stop all DNS resolution for this domain immediately. This action cannot be undone.
          </p>

          <div className="w-full text-left bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 mt-2">
             <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Type <span className="select-all text-gray-900 dark:text-white">{domainName}</span> to confirm</label>
             <input 
                type="text" 
                className="w-full p-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-600 rounded-lg outline-none focus:border-red-500 dark:text-white transition-colors"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={domainName}
                autoFocus
             />
          </div>

          <div className="flex gap-3 w-full mt-4">
            <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700">
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} className="flex-1 shadow-lg shadow-red-500/20" disabled={!isMatch}>
              Remove Domain
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
