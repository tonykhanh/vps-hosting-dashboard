
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileCode, Save, Terminal } from 'lucide-react';
import { Button } from '../../Button';

interface EditScriptModalProps {
  script: { id: string; name: string; type: string; content?: string };
  onClose: () => void;
  onSave: (id: string, updates: { name: string; content: string }) => void;
}

export const EditScriptModal: React.FC<EditScriptModalProps> = ({ script, onClose, onSave }) => {
  const [name, setName] = useState(script.name);
  const [content, setContent] = useState(script.content || '');

  const handleSave = () => {
    onSave(script.id, { name, content });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-200 dark:border-neutral-700">
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800 sticky top-0 z-10">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                 <FileCode size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Script</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{script.type} Script</p>
              </div>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"><X size={20}/></button>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto">
           <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Script Name</label>
              <input 
                 type="text" 
                 className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
              />
           </div>

           <div className="flex flex-col h-[400px]">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Script Content</label>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex-1 flex flex-col">
                 <div className="flex items-center gap-2 px-4 py-2 bg-gray-950 border-b border-gray-800">
                    <Terminal size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-500 font-mono">Editor</span>
                 </div>
                 <textarea 
                    className="w-full h-full p-4 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none custom-scrollbar"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    spellCheck={false}
                 />
              </div>
           </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900 sticky bottom-0 z-10">
           <Button variant="secondary" onClick={onClose} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
           <Button className="gap-2 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 border-none" onClick={handleSave} disabled={!name}>
              <Save size={16} /> Save Changes
           </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
