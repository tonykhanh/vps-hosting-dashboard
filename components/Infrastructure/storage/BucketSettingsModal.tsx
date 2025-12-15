
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Globe, Lock, Shield, Save } from 'lucide-react';
import { Button } from '../../Button';

interface BucketSettingsModalProps {
  bucket: any;
  onClose: () => void;
  onSave: (updatedBucket: any) => void;
}

export const BucketSettingsModal: React.FC<BucketSettingsModalProps> = ({ bucket, onClose, onSave }) => {
  const [access, setAccess] = useState<'public' | 'private'>(bucket.access);
  const [versioning, setVersioning] = useState(false);

  const handleSave = () => {
    onSave({
      ...bucket,
      access,
      versioning
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Settings: {bucket.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="space-y-6">
           {/* Access Control */}
           <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Access Control</label>
              <div className="grid grid-cols-2 gap-4">
                 <div 
                    onClick={() => setAccess('private')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                       access === 'private' 
                       ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20 text-plasma-900 dark:text-white' 
                       : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 text-gray-500 dark:text-gray-400'
                    }`}
                 >
                    <Lock size={24} />
                    <span className="font-bold text-sm">Private</span>
                 </div>
                 <div 
                    onClick={() => setAccess('public')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                       access === 'public' 
                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-white' 
                       : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 text-gray-500 dark:text-gray-400'
                    }`}
                 >
                    <Globe size={24} />
                    <span className="font-bold text-sm">Public Read</span>
                 </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                 {access === 'public' ? 'Objects can be accessed via public URL.' : 'Objects require signed URLs or API keys.'}
              </p>
           </div>

           {/* Versioning */}
           <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 flex justify-between items-center">
              <div className="flex gap-3">
                 <div className="p-2 bg-white dark:bg-neutral-700 rounded-lg text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-neutral-600">
                    <Shield size={20} />
                 </div>
                 <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">Object Versioning</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Keep history of overwritten files.</div>
                 </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" checked={versioning} onChange={(e) => setVersioning(e.target.checked)} />
                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plasma-600"></div>
              </label>
           </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
          <Button onClick={handleSave} className="flex-1 shadow-lg shadow-plasma-500/20">
             <Save size={16} className="mr-2"/> Save Changes
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
