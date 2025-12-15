
import React from 'react';
import { createPortal } from 'react-dom';
import { X, Terminal, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface FunctionLogsModalProps {
  functionName: string;
  onClose: () => void;
}

export const FunctionLogsModal: React.FC<FunctionLogsModalProps> = ({ functionName, onClose }) => {
  const logs = [
    { id: 1, type: 'START', time: '10:00:01', msg: `RequestId: ${Date.now()}-1 Version: $LATEST` },
    { id: 2, type: 'INFO', time: '10:00:02', msg: 'Processing event data...' },
    { id: 3, type: 'INFO', time: '10:00:02', msg: 'Connection established to DB' },
    { id: 4, type: 'END', time: '10:00:03', msg: 'RequestId: ... completed' },
    { id: 5, type: 'REPORT', time: '10:00:03', msg: 'Duration: 124.5 ms Billed Duration: 125 ms Memory Size: 128 MB Max Memory Used: 64 MB' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg text-gray-600 dark:text-gray-300">
                <Terminal size={20} />
             </div>
             <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Execution Logs</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Function: {functionName}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-950 font-mono text-sm text-gray-300">
           {logs.map(log => (
              <div key={log.id} className="mb-2 border-b border-gray-800/50 pb-2 last:border-0">
                 <div className="flex gap-3 opacity-60 text-xs mb-1">
                    <span className="text-blue-400">{log.time}</span>
                    <span className={`font-bold ${log.type === 'REPORT' ? 'text-green-400' : 'text-gray-400'}`}>{log.type}</span>
                 </div>
                 <div className="pl-14 break-all">{log.msg}</div>
              </div>
           ))}
           <div className="mt-4 text-green-500 animate-pulse">_</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
