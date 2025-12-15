
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Zap, Plus, MoreVertical, Play, Square, 
  Activity, Clock, Box, X, Code, CheckCircle2, Trash2, FileText, RefreshCw 
} from 'lucide-react';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import { FunctionLogsModal } from './FunctionLogsModal';
import { DeleteFunctionModal } from './DeleteFunctionModal';

// Mock Data
const INITIAL_FUNCTIONS = [
  { 
    id: 'fn-1', 
    name: 'resize-image-processor', 
    runtime: 'Node.js 18', 
    region: 'New York', 
    memory: '128 MB',
    timeout: '10s',
    invocations: 1200000,
    errors: '0.01%',
    status: 'active',
    lastInvoked: '2m ago'
  },
  { 
    id: 'fn-2', 
    name: 'order-webhook-handler', 
    runtime: 'Python 3.9', 
    region: 'Singapore', 
    memory: '256 MB',
    timeout: '30s',
    invocations: 450000,
    errors: '0.00%',
    status: 'active',
    lastInvoked: 'Just now'
  },
  { 
    id: 'fn-3', 
    name: 'daily-report-generator', 
    runtime: 'Go 1.x', 
    region: 'Frankfurt', 
    memory: '512 MB',
    timeout: '60s',
    invocations: 30,
    errors: '0.00%',
    status: 'active',
    lastInvoked: '1d ago'
  },
];

const RUNTIMES = [
  { id: 'node18', name: 'Node.js 18', icon: 'JS' },
  { id: 'python39', name: 'Python 3.9', icon: 'PY' },
  { id: 'go1', name: 'Go 1.x', icon: 'GO' },
  { id: 'docker', name: 'Custom Container', icon: '🐳' },
];

export const ServerlessManager: React.FC = () => {
  const [functions, setFunctions] = useState(INITIAL_FUNCTIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFunction, setNewFunction] = useState({ name: '', runtime: 'node18', memory: 128 });
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [logsFunction, setLogsFunction] = useState<string | null>(null);
  const [invokingId, setInvokingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    const runtimeName = RUNTIMES.find(r => r.id === newFunction.runtime)?.name || 'Node.js 18';
    
    // Simulate deployment delay
    setTimeout(() => {
        const newFn = {
            id: `fn-${Date.now()}`,
            name: newFunction.name,
            runtime: runtimeName,
            region: 'New York',
            memory: `${newFunction.memory} MB`,
            timeout: '10s',
            invocations: 0,
            errors: '0.00%',
            status: 'deploying',
            lastInvoked: '-'
        };
        
        setFunctions([newFn, ...functions]);
        setIsDeploying(false);
        setShowCreateModal(false);
        setNewFunction({ name: '', runtime: 'node18', memory: 128 });

        // Simulate going active
        setTimeout(() => {
            setFunctions(prev => prev.map(f => f.id === newFn.id ? { ...f, status: 'active' } : f));
        }, 3000);
    }, 1500);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setFunctions(prev => prev.filter(f => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleInvoke = (id: string) => {
      setInvokingId(id);
      setTimeout(() => {
          setFunctions(prev => prev.map(f => {
              if (f.id === id) {
                  return { 
                      ...f, 
                      invocations: f.invocations + 1,
                      lastInvoked: 'Just now'
                  };
              }
              return f;
          }));
          setInvokingId(null);
      }, 800);
  };

  const formatInvocations = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num.toString();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10" onClick={() => setActiveDropdown(null)}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="text-amber-500 fill-current" /> Serverless Functions
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Deploy code without managing servers. Auto-scaling included.</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
             <Plus size={16} className="mr-2"/> Create Function
          </Button>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Activity size={24} />
             </div>
             <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Total Invocations (24h)</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatInvocations(functions.reduce((acc, curr) => acc + curr.invocations, 0))}
                </div>
             </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Clock size={24} />
             </div>
             <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Avg. Duration</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">124ms</div>
             </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                <Box size={24} />
             </div>
             <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Active Functions</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{functions.length}</div>
             </div>
          </div>
       </div>

       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap size={20} className="text-plasma-600"/> Functions
             </h3>
             <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-gray-600 dark:text-gray-300">
                {functions.length} Deployed
             </span>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
             <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium">
                   <tr>
                      <th className="px-6 py-4">Function Name</th>
                      <th className="px-6 py-4">Runtime</th>
                      <th className="px-6 py-4">Region</th>
                      <th className="px-6 py-4">Memory / Timeout</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                   {functions.map((fn, index) => (
                      <tr key={fn.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors relative group">
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                               <div className="p-1.5 bg-gray-100 dark:bg-neutral-700 rounded text-gray-500">
                                  <Code size={14} />
                               </div>
                               {fn.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
                               {formatInvocations(fn.invocations)} inv • {fn.errors} err • {fn.lastInvoked}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded-md text-xs font-mono text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-neutral-600">
                               {fn.runtime}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{fn.region}</td>
                         <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{fn.memory}</span> • {fn.timeout}
                         </td>
                         <td className="px-6 py-4">
                            {fn.status === 'active' ? (
                               <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Active
                               </span>
                            ) : (
                               <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Deploying
                               </span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right relative">
                            <div className="flex justify-end gap-2">
                               <button 
                                  onClick={() => handleInvoke(fn.id)}
                                  disabled={fn.status !== 'active' || invokingId === fn.id}
                                  className={`p-2 rounded-lg transition-colors ${invokingId === fn.id ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'}`} 
                                  title="Test Function"
                               >
                                  {invokingId === fn.id ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                                </button>
                               <button 
                                  onClick={(e) => { e.stopPropagation(); toggleDropdown(fn.id); }}
                                  className={`p-2 rounded-lg transition-colors ${activeDropdown === fn.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
                               >
                                  <MoreVertical size={16} className="rotate-90" />
                               </button>

                               {activeDropdown === fn.id && (
                                  <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= functions.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                     <button 
                                        onClick={() => { setLogsFunction(fn.name); setActiveDropdown(null); }}
                                        className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                     >
                                        <FileText size={14} /> View Logs
                                     </button>
                                     <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setDeleteTarget(fn); 
                                            setActiveDropdown(null); 
                                        }}
                                        className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                     >
                                        <Trash2 size={14} /> Delete
                                     </button>
                                  </div>
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {functions.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                   No functions deployed. Create one to get started.
                </div>
             )}
          </div>
       </div>

       {/* Create Modal */}
       {showCreateModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowCreateModal(false)}>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap size={20} className="text-amber-500"/> Deploy Serverless Function
                 </h3>
                 <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
              </div>
              
              <div className="p-8 space-y-6 overflow-y-auto">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Function Name</label>
                    <input 
                       type="text" 
                       className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white text-sm"
                       placeholder="my-function"
                       value={newFunction.name}
                       onChange={(e) => setNewFunction({...newFunction, name: e.target.value})}
                       autoFocus
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Runtime</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       {RUNTIMES.map(rt => (
                          <button
                             key={rt.id}
                             onClick={() => setNewFunction({...newFunction, runtime: rt.id})}
                             className={`
                                p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                                ${newFunction.runtime === rt.id 
                                   ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                                   : 'border-gray-200 dark:border-neutral-700 hover:border-amber-300 dark:hover:border-amber-700 text-gray-600 dark:text-gray-400'}
                             `}
                          >
                             <span className="text-lg font-bold">{rt.icon}</span>
                             <span className="text-xs font-bold">{rt.name}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                       <span>Memory Allocation</span>
                       <span className="text-amber-600 dark:text-amber-400">{newFunction.memory} MB</span>
                    </div>
                    <input 
                       type="range" 
                       min="128" max="2048" step="64"
                       value={newFunction.memory}
                       onChange={(e) => setNewFunction({...newFunction, memory: parseInt(e.target.value)})}
                       className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                       <span>128 MB</span>
                       <span>2048 MB</span>
                    </div>
                 </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900">
                 <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button 
                    className="gap-2 bg-amber-500 hover:bg-amber-600 border-none text-white shadow-lg shadow-amber-500/20" 
                    onClick={handleDeploy} 
                    disabled={!newFunction.name || isDeploying}
                    isLoading={isDeploying}
                 >
                    <Zap size={16}/> {isDeploying ? 'Deploying...' : 'Deploy Function'}
                 </Button>
              </div>
           </div>
        </div>,
        document.body
      )}

      {/* Logs Modal */}
      {logsFunction && (
         <FunctionLogsModal 
            functionName={logsFunction}
            onClose={() => setLogsFunction(null)}
         />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
         <DeleteFunctionModal 
            functionName={deleteTarget.name}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
         />
      )}
    </div>
  );
};
