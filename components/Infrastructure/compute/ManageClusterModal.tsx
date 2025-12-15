
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Download, ExternalLink, Copy, Check, Terminal, Server, Globe, RefreshCw, AlertTriangle, Shield, Play } from 'lucide-react';
import { Button } from '../../Button';

interface ManageClusterModalProps {
  cluster: { id: string; name: string; endpoint?: string; version: string };
  onClose: () => void;
  onUpdate?: (clusterId: string, updates: any) => void;
}

export const ManageClusterModal: React.FC<ManageClusterModalProps> = ({ cluster, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'kubeconfig'>('overview');
  const [copied, setCopied] = useState(false);
  
  // Upgrade State
  const [upgradeStatus, setUpgradeStatus] = useState<'idle' | 'checking' | 'available' | 'upgrading' | 'up_to_date'>('idle');
  const [nextVersion, setNextVersion] = useState<string | null>(null);

  // Dashboard State
  const [dashboardStatus, setDashboardStatus] = useState<'not_installed' | 'installing' | 'installed'>('not_installed');

  // Kubeconfig State
  const [token, setToken] = useState('eyJhbGciOiJSUzI1NiIsImtpZCI6Ik...');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const mockEndpoint = cluster.endpoint || `https://${cluster.name.toLowerCase().replace(/\s+/g, '-')}.k8s.autonix.io`;
  
  const generateKubeconfig = (t: string) => `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1...
    server: ${mockEndpoint}
  name: ${cluster.name}
contexts:
- context:
    cluster: ${cluster.name}
    user: admin
  name: ${cluster.name}-admin
current-context: ${cluster.name}-admin
kind: Config
preferences: {}
users:
- name: admin
  user:
    token: ${t}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generateKubeconfig(token));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckUpgrade = () => {
    setUpgradeStatus('checking');
    setTimeout(() => {
        // Simulate finding a newer version
        const currentMajor = parseInt(cluster.version.split('.')[1]);
        const newVer = `v1.${currentMajor + 1}.0`;
        setNextVersion(newVer);
        setUpgradeStatus('available');
    }, 1500);
  };

  const handleUpgrade = () => {
    if (!nextVersion) return;
    setUpgradeStatus('upgrading');
    setTimeout(() => {
        if (onUpdate) {
            onUpdate(cluster.id, { version: nextVersion, status: 'Upgrading' });
        }
        // In a real app, this would close or show progress. For now we simulate completion locally for UI
        onClose();
    }, 2000);
  };

  const handleInstallDashboard = () => {
    setDashboardStatus('installing');
    setTimeout(() => {
        setDashboardStatus('installed');
    }, 2000);
  };

  const handleRegenerateToken = () => {
    if (confirm('This will invalidate the existing kubeconfig. Continue?')) {
        setIsRegenerating(true);
        setTimeout(() => {
            setToken(`new-token-${Date.now()}`);
            setIsRegenerating(false);
        }, 1500);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Server size={20} />
             </div>
             <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Manage Cluster</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{cluster.name}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"><X size={20}/></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-neutral-800 px-6 bg-white dark:bg-neutral-900">
           <button 
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
           >
              Overview
           </button>
           <button 
              onClick={() => setActiveTab('kubeconfig')}
              className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'kubeconfig' ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
           >
              Kubeconfig
           </button>
        </div>

        <div className="p-8 overflow-y-auto bg-gray-50 dark:bg-neutral-900/50 flex-1">
           {activeTab === 'overview' && (
              <div className="space-y-6">
                 {/* API Endpoint */}
                 <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">API Endpoint</h4>
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                       <Globe size={16} className="text-gray-400" />
                       <code className="text-sm font-mono text-gray-800 dark:text-gray-200 flex-1 overflow-hidden text-ellipsis">{mockEndpoint}</code>
                       <a href={mockEndpoint} target="_blank" rel="noreferrer" className="text-plasma-600 dark:text-plasma-400 hover:underline text-xs flex items-center gap-1 font-bold">
                          <ExternalLink size={12} /> Open
                       </a>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Version Management */}
                    <div className="p-5 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <div className="text-xs font-bold text-gray-500 uppercase mb-1">Kubernetes Version</div>
                             <div className="text-xl font-bold text-gray-900 dark:text-white">{cluster.version}</div>
                          </div>
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                             <RefreshCw size={18} className={upgradeStatus === 'checking' || upgradeStatus === 'upgrading' ? 'animate-spin' : ''} />
                          </div>
                       </div>
                       
                       {upgradeStatus === 'idle' && (
                          <Button size="sm" variant="secondary" className="w-full text-xs dark:bg-neutral-700 dark:text-white" onClick={handleCheckUpgrade}>
                             Check for Upgrades
                          </Button>
                       )}
                       {upgradeStatus === 'checking' && (
                          <div className="text-xs text-center text-gray-500 py-2">Checking compatibility...</div>
                       )}
                       {upgradeStatus === 'available' && (
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                <Check size={12} /> Version {nextVersion} available
                             </div>
                             <Button size="sm" className="w-full text-xs" onClick={handleUpgrade}>
                                Upgrade to {nextVersion}
                             </Button>
                          </div>
                       )}
                       {upgradeStatus === 'upgrading' && (
                          <div className="text-xs text-center text-blue-600 dark:text-blue-400 py-2 font-medium">Initiating Rolling Upgrade...</div>
                       )}
                       {upgradeStatus === 'up_to_date' && (
                          <div className="text-xs text-center text-gray-500 py-2 flex items-center justify-center gap-1">
                             <Check size={12}/> Cluster is up to date
                          </div>
                       )}
                    </div>

                    {/* Dashboard Management */}
                    <div className="p-5 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <div className="text-xs font-bold text-gray-500 uppercase mb-1">Web Dashboard</div>
                             <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {dashboardStatus === 'installed' ? 'Active' : 'Not Installed'}
                             </div>
                          </div>
                          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                             <FileText size={18} />
                          </div>
                       </div>

                       {dashboardStatus === 'not_installed' && (
                          <Button size="sm" variant="secondary" className="w-full text-xs dark:bg-neutral-700 dark:text-white" onClick={handleInstallDashboard}>
                             Install Dashboard
                          </Button>
                       )}
                       {dashboardStatus === 'installing' && (
                          <div className="text-xs text-center text-gray-500 py-2">Deploying resources...</div>
                       )}
                       {dashboardStatus === 'installed' && (
                          <div className="flex gap-2">
                             <Button size="sm" className="flex-1 text-xs" onClick={() => window.open(mockEndpoint + '/dashboard', '_blank')}>
                                Open
                             </Button>
                             <Button size="sm" variant="secondary" className="flex-1 text-xs dark:bg-neutral-700 dark:text-white">
                                Reset
                             </Button>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'kubeconfig' && (
              <div className="space-y-6">
                 <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-xl flex gap-3">
                    <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">Security Warning</h4>
                        <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                            This configuration provides administrative access to your cluster. Keep it secure. Regenerate if you suspect it has been compromised.
                        </p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Admin Config (YAML)</h4>
                    <div className="flex gap-2">
                       <Button size="sm" variant="secondary" onClick={handleCopy} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                          {copied ? <Check size={14} className="mr-1"/> : <Copy size={14} className="mr-1"/>} Copy
                       </Button>
                       <Button size="sm" variant="secondary" className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                          <Download size={14} className="mr-1"/> Download
                       </Button>
                    </div>
                 </div>
                 
                 <div className="relative group">
                    <pre className="p-4 bg-neutral-900 rounded-xl text-xs font-mono text-gray-300 overflow-x-auto h-64 border border-gray-800 custom-scrollbar shadow-inner relative">
                       {generateKubeconfig(token)}
                    </pre>
                    {isRegenerating && (
                        <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center rounded-xl">
                            <span className="flex items-center gap-2 text-white font-bold"><RefreshCw size={16} className="animate-spin" /> Rotating Credentials...</span>
                        </div>
                    )}
                 </div>
                 
                 <div className="flex justify-between items-center pt-2">
                    <div className="text-xs text-gray-500">
                       Run <code>export KUBECONFIG=./kubeconfig.yaml</code> to start using this file.
                    </div>
                    <Button 
                       size="sm" 
                       variant="danger" 
                       onClick={handleRegenerateToken} 
                       disabled={isRegenerating}
                       className="text-xs"
                    >
                       <Shield size={14} className="mr-1" /> Regenerate Token
                    </Button>
                 </div>
              </div>
           )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex justify-end">
           <Button onClick={onClose} variant="secondary" className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
