
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Terminal, RefreshCw, Power } from 'lucide-react';

interface ConsoleModalProps {
  instanceName: string;
  onClose: () => void;
}

export const ConsoleModal: React.FC<ConsoleModalProps> = ({ instanceName, onClose }) => {
  const [lines, setLines] = useState<string[]>([
    `Connecting to ${instanceName}...`,
    'Authenticated.',
    'Welcome to Autonix Cloud Terminal v3.0',
    'System load: 0.02, 0.05, 0.01',
    '',
  ]);
  const [command, setCommand] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newLines = [...lines, `root@${instanceName}:~# ${command}`];
      
      if (command === 'clear') {
        setLines([]);
      } else if (command === 'help') {
        setLines([...newLines, 'Available commands: status, reboot, clear, exit']);
      } else if (command === 'status') {
        setLines([...newLines, 'Status: Running', 'Uptime: 14 days', 'CPU: 12%']);
      } else if (command === 'exit') {
        onClose();
      } else if (command.trim() !== '') {
        setLines([...newLines, `bash: ${command}: command not found`]);
      } else {
        setLines(newLines);
      }
      setCommand('');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-black w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl border border-gray-800 flex flex-col font-mono text-sm overflow-hidden">
         {/* Toolbar */}
         <div className="p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-gray-400">
            <div className="flex items-center gap-3">
               <Terminal size={16} className="text-green-500" />
               <span className="font-bold text-gray-200">root@{instanceName}:~</span>
               <div className="h-4 w-px bg-gray-700 mx-2"></div>
               <div className="flex gap-2">
                  <button className="flex items-center gap-1 hover:text-white transition-colors px-2 py-1 hover:bg-gray-800 rounded">
                     <RefreshCw size={12} /> Send Ctrl+Alt+Del
                  </button>
                  <button className="flex items-center gap-1 hover:text-white transition-colors px-2 py-1 hover:bg-gray-800 rounded">
                     <Power size={12} /> Power Cycle
                  </button>
               </div>
            </div>
            <button onClick={onClose} className="hover:text-white hover:bg-gray-800 p-1.5 rounded transition-colors"><X size={18}/></button>
         </div>
         
         {/* Terminal Output */}
         <div className="flex-1 p-4 text-gray-300 overflow-y-auto font-mono" onClick={() => document.getElementById('console-input')?.focus()}>
            {lines.map((line, i) => (
               <div key={i} className="min-h-[20px]">{line}</div>
            ))}
            <div className="flex items-center mt-1">
               <span className="text-green-500 mr-2">root@{instanceName}:~#</span>
               <input 
                  id="console-input"
                  type="text" 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-white flex-1 caret-white"
                  autoFocus
                  autoComplete="off"
               />
            </div>
            <div ref={bottomRef} />
         </div>
      </div>
    </div>,
    document.body
  );
};
