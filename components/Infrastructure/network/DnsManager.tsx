
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Globe, Edit2, Trash2, Plus, ArrowLeft, Save, 
  X, MoreVertical, RotateCcw, Settings, CheckCircle2, Zap
} from 'lucide-react';
import { Button } from '../../Button';
import { DOMAIN_LIST } from '../../../constants';
import { DeleteDomainModal } from './DeleteDomainModal';

interface DnsRecord {
  id: string;
  domainId: string; // Link to domain
  type: string;
  name: string;
  value: string;
  ttl: string;
  priority?: number;
}

// Extended Mock Records linked to domains
const INITIAL_RECORDS: DnsRecord[] = [
  // Records for nexus-agency.com (d-1)
  { id: 'r-1', domainId: 'd-1', type: 'A', name: '@', value: '104.22.15.192', ttl: '3600', priority: 0 },
  { id: 'r-2', domainId: 'd-1', type: 'CNAME', name: 'www', value: 'nexus-agency.com', ttl: '3600', priority: 0 },
  { id: 'r-3', domainId: 'd-1', type: 'MX', name: '@', value: 'mail.protonmail.com', ttl: '14400', priority: 10 },
  // Records for client-portal.io (d-2)
  { id: 'r-4', domainId: 'd-2', type: 'A', name: '@', value: '10.0.0.5', ttl: '3600', priority: 0 },
  { id: 'r-5', domainId: 'd-2', type: 'CNAME', name: 'api', value: 'client-portal.io', ttl: '3600', priority: 0 },
  // Records for dev-test.site (d-3)
  { id: 'r-6', domainId: 'd-3', type: 'A', name: '@', value: '192.168.1.50', ttl: '300', priority: 0 },
];

export const DnsManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'details'>('list');
  
  // Selected Domain for Details View
  const [selectedDomainObj, setSelectedDomainObj] = useState<typeof DOMAIN_LIST[0] | null>(null);
  
  // Domain List State
  const [domains, setDomains] = useState(DOMAIN_LIST);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainIp, setNewDomainIp] = useState('');
  const [deleteDomainTarget, setDeleteDomainTarget] = useState<typeof DOMAIN_LIST[0] | null>(null);

  // Record List State (Global store filtered by view)
  const [allRecords, setAllRecords] = useState<DnsRecord[]>(INITIAL_RECORDS);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DnsRecord | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [recordForm, setRecordForm] = useState({
    type: 'A',
    name: '@',
    value: '',
    ttl: '3600',
    priority: 0
  });

  const handleManageDNS = (domain: typeof DOMAIN_LIST[0]) => {
    setSelectedDomainObj(domain);
    setView('details');
    setActiveDropdown(null);
  };

  const handleBack = () => {
    setView('list');
    setSelectedDomainObj(null);
  };

  const handleAddDomain = () => {
    if (!newDomainName) return;
    
    const newDomainId = `d-${Date.now()}`;
    const newDomain = {
        id: newDomainId,
        name: newDomainName,
        registrar: 'Nebula', // Mock default
        expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        ssl: 'valid',
        autoRenew: true,
        dnsStatus: 'healthy',
        nameservers: 'Cloudflare',
        target: newDomainIp || '127.0.0.1' 
    };

    setDomains([...domains, newDomain]);
    
    // Create default records for new domain
    if (newDomainIp) {
        const defaultRecord: DnsRecord = {
            id: `r-${Date.now()}`,
            domainId: newDomainId,
            type: 'A',
            name: '@',
            value: newDomainIp,
            ttl: '3600',
            priority: 0
        };
        setAllRecords(prev => [...prev, defaultRecord]);
    }

    setShowAddDomainModal(false);
    setNewDomainName('');
    setNewDomainIp('');
  };

  const handleDeleteDomainConfirm = () => {
    if (deleteDomainTarget) {
        setDomains(prev => prev.filter(d => d.id !== deleteDomainTarget.id));
        // Cleanup records
        setAllRecords(prev => prev.filter(r => r.domainId !== deleteDomainTarget.id));
        setDeleteDomainTarget(null);
    }
  };

  const openAddRecordModal = () => {
    setEditingRecord(null);
    setRecordForm({ type: 'A', name: '@', value: '', ttl: '3600', priority: 0 });
    setShowRecordModal(true);
  };

  const openEditRecordModal = (record: DnsRecord) => {
    setEditingRecord(record);
    setRecordForm({
      type: record.type,
      name: record.name,
      value: record.value,
      ttl: record.ttl,
      priority: record.priority || 0
    });
    setShowRecordModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setAllRecords(prev => prev.filter(r => r.id !== id));
    }
    setActiveDropdown(null);
  };

  const handleSaveRecord = () => {
    if (!selectedDomainObj) return;

    if (editingRecord) {
      setAllRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...recordForm } : r));
    } else {
      const newRecord: DnsRecord = {
        id: `r-${Date.now()}`,
        domainId: selectedDomainObj.id,
        ...recordForm
      };
      setAllRecords(prev => [...prev, newRecord]);
    }
    setShowRecordModal(false);
  };

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // LIST VIEW (Domains)
  if (view === 'list') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setActiveDropdown(null)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="text-plasma-600" size={32} />
                DNS Management
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your domains and DNS records.</p>
          </div>
          <Button onClick={() => setShowAddDomainModal(true)}>
             <Plus size={16} className="mr-2"/> Add Domain
          </Button>
        </div>

        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Active Domains</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">{domains.length} Domains Configured</div>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                    <tr>
                      <th className="px-6 py-4">Domain Name</th>
                      <th className="px-6 py-4">Registrar / Nameservers</th>
                      <th className="px-6 py-4">Target</th>
                      <th className="px-6 py-4">Expiry Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                    {domains.map((domain, index) => (
                      <tr key={domain.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors relative">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                  <Globe size={18} />
                                </div>
                                {domain.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-900 dark:text-white font-medium">{domain.registrar}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{domain.nameservers} NS</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-xs bg-gray-100 dark:bg-neutral-900 px-2 py-1 rounded w-fit text-gray-600 dark:text-gray-300">
                                {domain.target}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-xs font-bold px-2 py-1 rounded w-fit ${
                                new Date(domain.expiry) < new Date('2024-07-01') ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            }`}>
                                {domain.expiry}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(domain.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeDropdown === domain.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical size={18} className="rotate-90" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === domain.id && (
                                <div className={`absolute right-8 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= domains.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleManageDNS(domain);
                                    }}
                                    className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                    >
                                    <Settings size={14} /> Manage DNS
                                    </button>
                                    <button 
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                        setDeleteDomainTarget(domain); 
                                        setActiveDropdown(null); 
                                    }}
                                    className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                    <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            )}
                          </td>
                      </tr>
                    ))}
                </tbody>
              </table>
          </div>
        </div>

        {/* Add Domain Modal */}
        {showAddDomainModal && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
             <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-neutral-700">
                <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <Plus size={20} className="text-plasma-600"/> Add Domain
                   </h3>
                   <button onClick={() => setShowAddDomainModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"><X size={20}/></button>
                </div>

                <div className="p-8 space-y-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Domain Name</label>
                      <input 
                         type="text" 
                         className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white placeholder-gray-400"
                         placeholder="example.com"
                         value={newDomainName}
                         onChange={(e) => setNewDomainName(e.target.value)}
                         autoFocus
                      />
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target IP (Optional)</label>
                      <input 
                         type="text" 
                         className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white placeholder-gray-400 font-mono text-sm"
                         placeholder="192.168.1.1"
                         value={newDomainIp}
                         onChange={(e) => setNewDomainIp(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                         This will create a default A record for @ pointing to this IP.
                      </p>
                   </div>

                   <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg h-fit">
                         <Zap size={18} />
                      </div>
                      <div>
                         <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">Auto-Configuration</h4>
                         <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                            We will automatically set up default nameservers and basic DNS records.
                         </p>
                      </div>
                   </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900">
                   <Button variant="secondary" onClick={() => setShowAddDomainModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                   <Button className="gap-2 shadow-lg shadow-plasma-500/20" onClick={handleAddDomain} disabled={!newDomainName}>
                      Add Domain
                   </Button>
                </div>
             </div>
          </div>,
          document.body
        )}

        {/* Delete Domain Modal */}
        {deleteDomainTarget && (
            <DeleteDomainModal 
                domainName={deleteDomainTarget.name}
                onClose={() => setDeleteDomainTarget(null)}
                onConfirm={handleDeleteDomainConfirm}
            />
        )}
      </div>
    );
  }

  // DETAILS VIEW (Records)
  if (view === 'details' && selectedDomainObj) {
    const domainRecords = allRecords.filter(r => r.domainId === selectedDomainObj.id);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative" onClick={() => activeDropdown && setActiveDropdown(null)}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <button 
                onClick={handleBack}
                className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            >
                <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {selectedDomainObj.name}
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full border border-green-200 dark:border-green-800 uppercase font-bold">Active</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Managing DNS Records</p>
            </div>
            </div>
            <div className="flex gap-2">
            <Button variant="secondary" className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                <RotateCcw size={16} className="mr-2"/> Reset to Default
            </Button>
            <Button onClick={openAddRecordModal}>
                <Plus size={16} className="mr-2"/> Add Record
            </Button>
            </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl overflow-visible shadow-sm">
            {/* Added Header to match other tables */}
            <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   <Globe size={20} className="text-plasma-600"/> DNS Records
                </h3>
                <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold">
                   {domainRecords.length} Records
                </span>
            </div>

            <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-neutral-700">
                    <tr>
                        <th className="px-6 py-4 w-24">Type</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Value</th>
                        <th className="px-6 py-4 w-24">Priority</th>
                        <th className="px-6 py-4 w-32">TTL</th>
                        <th className="px-6 py-4 text-right w-20"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                    {domainRecords.map((record, index) => (
                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors group relative">
                            <td className="px-6 py-4">
                            <span className={`
                                font-bold px-2 py-1 rounded text-xs w-16 block text-center
                                ${record.type === 'A' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                                    record.type === 'CNAME' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                    record.type === 'MX' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                                    'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300'}
                            `}>
                                {record.type}
                            </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">{record.name}</td>
                            <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400 break-all">{record.value}</td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-500">
                            {(record.type === 'MX' || record.type === 'SRV') ? record.priority : '-'}
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-500">{record.ttl}</td>
                            <td className="px-6 py-4 text-right relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(record.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeDropdown === record.id ? 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <MoreVertical size={18} className="rotate-90"/>
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === record.id && (
                                <div className={`absolute right-8 w-32 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${index >= domainRecords.length - 1 ? 'bottom-full mb-2 origin-bottom-right' : 'top-8 origin-top-right'}`}>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditRecordModal(record);
                                        }}
                                        className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRecord(record.id);
                                        }}
                                        className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            
            {domainRecords.length === 0 && (
                <div className="p-10 text-center text-gray-400">
                No DNS records found for this domain.
                </div>
            )}
        </div>

        {/* Add/Edit Record Modal */}
        {showRecordModal && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-neutral-700">
                <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-800">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        {editingRecord ? <Edit2 size={20} className="text-plasma-600"/> : <Plus size={20} className="text-plasma-600"/>}
                        {editingRecord ? 'Edit DNS Record' : 'Add DNS Record'}
                    </h3>
                    <button onClick={() => setShowRecordModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"><X size={20}/></button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Form Fields */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                        <select 
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white font-bold"
                            value={recordForm.type}
                            onChange={(e) => setRecordForm({...recordForm, type: e.target.value})}
                        >
                            {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        </div>
                        <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                            placeholder="@"
                            value={recordForm.name}
                            onChange={(e) => setRecordForm({...recordForm, name: e.target.value})}
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Value / Target</label>
                        <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white font-mono text-sm"
                        placeholder="192.168.1.1"
                        value={recordForm.value}
                        onChange={(e) => setRecordForm({...recordForm, value: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">TTL (Seconds)</label>
                            <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white"
                            placeholder="3600"
                            value={recordForm.ttl}
                            onChange={(e) => setRecordForm({...recordForm, ttl: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-bold mb-2 transition-colors ${['MX', 'SRV'].includes(recordForm.type) ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-neutral-600'}`}>Priority</label>
                            <input 
                            type="number" 
                            className={`w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 outline-none dark:text-white transition-opacity ${['MX', 'SRV'].includes(recordForm.type) ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                            placeholder="10"
                            value={recordForm.priority}
                            onChange={(e) => setRecordForm({...recordForm, priority: parseInt(e.target.value)})}
                            disabled={!['MX', 'SRV'].includes(recordForm.type)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 bg-gray-50 dark:bg-neutral-900">
                    <Button variant="secondary" onClick={() => setShowRecordModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                    <Button className="gap-2 shadow-lg shadow-plasma-500/20" onClick={handleSaveRecord} disabled={!recordForm.value}>
                        <Save size={16}/> Save Record
                    </Button>
                </div>
            </div>
            </div>,
            document.body
        )}
        </div>
    );
  }

  // Fallback (should not happen)
  return null;
};
