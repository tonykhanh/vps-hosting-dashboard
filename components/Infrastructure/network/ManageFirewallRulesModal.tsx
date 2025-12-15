
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, Plus, Trash2, ArrowDown, ArrowUp, Save } from 'lucide-react';
import { Button } from '../../Button';

interface ManageFirewallRulesModalProps {
  group: { id: string; name: string; rulesIn: number; rulesOut: number };
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
}

interface Rule {
  id: string;
  type: 'inbound' | 'outbound';
  protocol: 'TCP' | 'UDP' | 'ICMP';
  port: string;
  source: string; // or destination for outbound
  description: string;
}

// Initial mock rules generator
const generateMockRules = (groupName: string): Rule[] => {
  const rules: Rule[] = [];
  if (groupName.toLowerCase().includes('web')) {
    rules.push({ id: 'r1', type: 'inbound', protocol: 'TCP', port: '80', source: '0.0.0.0/0', description: 'HTTP' });
    rules.push({ id: 'r2', type: 'inbound', protocol: 'TCP', port: '443', source: '0.0.0.0/0', description: 'HTTPS' });
  }
  if (groupName.toLowerCase().includes('ssh') || groupName.toLowerCase().includes('admin')) {
    rules.push({ id: 'r3', type: 'inbound', protocol: 'TCP', port: '22', source: '0.0.0.0/0', description: 'SSH' });
  }
  // Default outbound
  rules.push({ id: 'r4', type: 'outbound', protocol: 'TCP', port: 'All', source: '0.0.0.0/0', description: 'Allow All Outbound' });
  return rules;
};

export const ManageFirewallRulesModal: React.FC<ManageFirewallRulesModalProps> = ({ group, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');
  const [rules, setRules] = useState<Rule[]>(generateMockRules(group.name));
  
  // New Rule State
  const [newRule, setNewRule] = useState({
    protocol: 'TCP',
    port: '',
    source: '0.0.0.0/0',
    description: ''
  });

  const handleAddRule = () => {
    if (!newRule.port) return;
    
    const rule: Rule = {
      id: `r-${Date.now()}`,
      type: activeTab,
      protocol: newRule.protocol as 'TCP' | 'UDP' | 'ICMP',
      port: newRule.port,
      source: newRule.source,
      description: newRule.description
    };
    
    setRules([...rules, rule]);
    setNewRule({ protocol: 'TCP', port: '', source: '0.0.0.0/0', description: '' });
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const handleSave = () => {
    const rulesIn = rules.filter(r => r.type === 'inbound').length;
    const rulesOut = rules.filter(r => r.type === 'outbound').length;
    onUpdate(group.id, { rulesIn, rulesOut });
    onClose();
  };

  const filteredRules = rules.filter(r => r.type === activeTab);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-3xl shadow-2xl p-0 border border-gray-200 dark:border-neutral-700 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900 rounded-t-3xl">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                <Shield size={20} />
             </div>
             <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Manage Rules</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{group.name}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"><X size={20}/></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-neutral-800 px-6 bg-gray-50 dark:bg-neutral-900/50">
           <button 
              onClick={() => setActiveTab('inbound')}
              className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'inbound' ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
           >
              <ArrowDown size={14} /> Inbound Rules
           </button>
           <button 
              onClick={() => setActiveTab('outbound')}
              className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'outbound' ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
           >
              <ArrowUp size={14} /> Outbound Rules
           </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-neutral-900 custom-scrollbar">
           
           {/* Add Rule Form */}
           <div className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-200 dark:border-neutral-800 mb-6">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Add New {activeTab} Rule</h4>
              <div className="grid grid-cols-12 gap-3 items-end">
                 <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Protocol</label>
                    <select 
                       className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm dark:text-white outline-none focus:ring-1 focus:ring-plasma-500"
                       value={newRule.protocol}
                       onChange={(e) => setNewRule({...newRule, protocol: e.target.value})}
                    >
                       <option>TCP</option>
                       <option>UDP</option>
                       <option>ICMP</option>
                    </select>
                 </div>
                 <div className="col-span-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Ports</label>
                    <input 
                       type="text" 
                       placeholder="e.g. 80, 443"
                       className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm dark:text-white outline-none focus:ring-1 focus:ring-plasma-500"
                       value={newRule.port}
                       onChange={(e) => setNewRule({...newRule, port: e.target.value})}
                    />
                 </div>
                 <div className="col-span-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{activeTab === 'inbound' ? 'Source' : 'Destination'}</label>
                    <input 
                       type="text" 
                       placeholder="0.0.0.0/0"
                       className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm dark:text-white outline-none focus:ring-1 focus:ring-plasma-500"
                       value={newRule.source}
                       onChange={(e) => setNewRule({...newRule, source: e.target.value})}
                    />
                 </div>
                 <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Description</label>
                    <input 
                       type="text" 
                       placeholder="Optional"
                       className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm dark:text-white outline-none focus:ring-1 focus:ring-plasma-500"
                       value={newRule.description}
                       onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                    />
                 </div>
                 <div className="col-span-2">
                    <Button size="sm" className="w-full justify-center" onClick={handleAddRule} disabled={!newRule.port}>
                       <Plus size={14} className="mr-1" /> Add
                    </Button>
                 </div>
              </div>
           </div>

           {/* Rules Table */}
           <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 font-medium">
                    <tr>
                       <th className="px-4 py-3">Protocol</th>
                       <th className="px-4 py-3">Port Range</th>
                       <th className="px-4 py-3">{activeTab === 'inbound' ? 'Sources' : 'Destinations'}</th>
                       <th className="px-4 py-3">Description</th>
                       <th className="px-4 py-3 text-right"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {filteredRules.map(rule => (
                       <tr key={rule.id} className="bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                          <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-300">{rule.protocol}</td>
                          <td className="px-4 py-3 font-mono font-bold text-gray-800 dark:text-gray-200">{rule.port}</td>
                          <td className="px-4 py-3">
                             <span className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
                                {rule.source}
                             </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 italic">{rule.description || '-'}</td>
                          <td className="px-4 py-3 text-right">
                             <button onClick={() => handleDeleteRule(rule.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                <Trash2 size={14} />
                             </button>
                          </td>
                       </tr>
                    ))}
                    {filteredRules.length === 0 && (
                       <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">No rules configured for this traffic direction.</td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 rounded-b-3xl flex justify-end gap-3">
           <Button variant="secondary" onClick={onClose} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
           <Button onClick={handleSave} className="shadow-lg shadow-plasma-500/20 gap-2">
              <Save size={16} /> Save Changes
           </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
