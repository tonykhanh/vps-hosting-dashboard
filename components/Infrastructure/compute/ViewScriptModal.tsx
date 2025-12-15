
import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileCode, Calendar, Tag, Copy, Check } from 'lucide-react';
import { Button } from '../../Button';

interface ViewScriptModalProps {
  script: { name: string; type: string; created: string; content?: string };
  onClose: () => void;
}

export const ViewScriptModal: React.FC<ViewScriptModalProps> = ({ script, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-200 dark:border-neutral-700">
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <FileCode size={20} />
             </div>
             <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{script.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Startup Script Details</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
           {/* Metadata */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 flex items-center gap-3">
                 <Tag size={18} className="text-gray-400" />
                 <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Type</div>
                    <div className="font-medium text-gray-900 dark:text-white">{script.type}</div>
                 </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 flex items-center gap-3">
                 <Calendar size={18} className="text-gray-400" />
                 <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Created</div>
                    <div className="font-medium text-gray-900 dark:text-white">{script.created}</div>
                 </div>
              </div>
           </div>

           {/* Content */}
           <div className="flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Script Content</label>
                 <button 
                    onClick={handleCopy}
                    className="text-xs text-plasma-600 dark:text-plasma-400 flex items-center gap-1 hover:underline font-medium"
                 >
                    {copied ? <Check size={12} /> : <Copy size={12}/>} {copied ? 'Copied' : 'Copy'}
                 </button>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex-1 flex flex-col">
                 <div className="flex items-center gap-2 px-4 py-2 bg-gray-950 border-b border-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-500 font-mono">bash</span>
                 </div>
                 <pre className="w-full h-full p-4 bg-transparent text-green-400 font-mono text-sm overflow-auto custom-scrollbar">
                    {script.content || '# No content available'}
                 </pre>
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end bg-gray-50 dark:bg-neutral-900">
           <Button onClick={onClose} className="shadow-lg shadow-plasma-500/20">Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
