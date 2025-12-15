
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Terminal, Copy, Check, Server } from 'lucide-react';
import { Button } from '../../Button';

interface MountInstructionsModalProps {
  fileSystem: { name: string; mountPoint: string; region: string };
  onClose: () => void;
}

export const MountInstructionsModal: React.FC<MountInstructionsModalProps> = ({ fileSystem, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ubuntu' | 'centos'>('ubuntu');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  // Mock IP based on region for realism (in a real app this would come from the API)
  const mockIp = '10.124.96.5'; 
  const mountPoint = fileSystem.mountPoint;

  const instructions = {
    ubuntu: [
      { label: '1. Update package index', cmd: 'sudo apt-get update' },
      { label: '2. Install NFS Client', cmd: 'sudo apt-get install nfs-common' },
      { label: '3. Create local directory', cmd: `sudo mkdir -p ${mountPoint}` },
      { label: '4. Mount file system', cmd: `sudo mount -t nfs ${mockIp}:${mountPoint} ${mountPoint}` },
    ],
    centos: [
      { label: '1. Install NFS Utils', cmd: 'sudo yum install nfs-utils' },
      { label: '2. Create local directory', cmd: `sudo mkdir -p ${mountPoint}` },
      { label: '3. Mount file system', cmd: `sudo mount -t nfs ${mockIp}:${mountPoint} ${mountPoint}` },
    ]
  };

  const currentInstructions = activeTab === 'ubuntu' ? instructions.ubuntu : instructions.centos;

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl p-0 border border-gray-200 dark:border-neutral-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Terminal size={20} />
             </div>
             <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Mount Instructions</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{fileSystem.name}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto">
           {/* OS Tabs */}
           <div className="flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl mb-6">
              <button 
                 onClick={() => setActiveTab('ubuntu')}
                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ubuntu' ? 'bg-white dark:bg-neutral-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >
                 Ubuntu / Debian
              </button>
              <button 
                 onClick={() => setActiveTab('centos')}
                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'centos' ? 'bg-white dark:bg-neutral-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >
                 CentOS / RHEL
              </button>
           </div>

           {/* Info Box */}
           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6 flex gap-3">
              <Server size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                 <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Network Requirement</h4>
                 <p className="text-xs text-blue-700 dark:text-blue-200 mt-1 leading-relaxed">
                    Ensure your instance is in the same VPC or has access to the storage network. You may need to update your Firewall rules to allow NFS traffic (Port 2049).
                 </p>
              </div>
           </div>

           {/* Steps */}
           <div className="space-y-6">
              {currentInstructions.map((step, idx) => (
                 <div key={idx}>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{step.label}</div>
                    <div className="relative group">
                       <div className="bg-gray-900 dark:bg-black text-gray-300 font-mono text-xs p-4 rounded-xl border border-gray-700 dark:border-neutral-800 overflow-x-auto">
                          {step.cmd}
                       </div>
                       <button 
                          onClick={() => copyToClipboard(step.cmd, idx)}
                          className="absolute top-2 right-2 p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy command"
                       >
                          {copiedStep === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                       </button>
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mount on Boot (fstab)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Add the following line to <code>/etc/fstab</code> to persist the mount after reboot:</p>
              <div className="relative group">
                 <div className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 font-mono text-xs p-3 rounded-lg border border-gray-200 dark:border-neutral-700 break-all">
                    {mockIp}:{mountPoint} {mountPoint} nfs defaults 0 0
                 </div>
                 <button 
                    onClick={() => copyToClipboard(`${mockIp}:${mountPoint} ${mountPoint} nfs defaults 0 0`, 99)}
                    className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                    {copiedStep === 99 ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                 </button>
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 flex justify-end">
           <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
