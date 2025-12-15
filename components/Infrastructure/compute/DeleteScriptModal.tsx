
import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../Button';

interface DeleteScriptModalProps {
  scriptName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteScriptModal: React.FC<DeleteScriptModalProps> = ({ scriptName, onClose, onConfirm }) => {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
            <AlertTriangle size={32} strokeWidth={2} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Script?</h3>
          
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
            Are you sure you want to permanently delete <span className="font-bold text-gray-900 dark:text-white">{scriptName}</span>? 
            This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full mt-6">
            <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700">
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} className="flex-1 shadow-lg shadow-red-500/20">
              Delete Forever
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
