import React, { useState, useEffect } from 'react';
import { 
  Lock, ShieldCheck, AlertOctagon, CheckCircle2, 
  FileText, Eye, Ban, Globe, Server, Activity, 
  Loader2, Sparkles, RefreshCw, Download, History,
  Search, Filter, ChevronRight, Calendar, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { HealthScore } from '../components/HealthScore';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface Threat {
  id: string;
  type: string;
  source: string;
  severity: 'critical' | 'warning' | 'minor';
  status: 'active' | 'blocked' | 'mitigated';
  timestamp: string;
}

interface Vulnerability {
  id: string;
  cve: string;
  component: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'patching' | 'remediated';
  description: string;
}

interface Regulation {
  id: string;
  name: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lastAudit: string;
  score: number;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  status: 'success' | 'failure' | 'warning';
}

export const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'threats' | 'audit'>('overview');
  const [complianceScore, setComplianceScore] = useState(92);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [scheduledReporting, setScheduledReporting] = useState(true);

  // Mock Traffic Data for Live Monitoring
  const [trafficData, setTrafficData] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, requests: 50 + Math.random() * 20 })));

  useEffect(() => {
    const interval = setInterval(() => {
        setTrafficData(prev => [...prev.slice(1), { time: prev[prev.length-1].time + 1, requests: 50 + Math.random() * 50 }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock Data
  const [regulations] = useState<Regulation[]>([
    { id: '1', name: 'GDPR', status: 'compliant', lastAudit: '2 days ago', score: 100 },
    { id: '2', name: 'SOC 2 Type II', status: 'pending', lastAudit: 'Running now...', score: 85 },
    { id: '3', name: 'ISO 27001', status: 'compliant', lastAudit: '1 week ago', score: 98 },
    { id: '4', name: 'HIPAA', status: 'non-compliant', lastAudit: '1 hour ago', score: 72 },
  ]);

  const [threats, setThreats] = useState<Threat[]>([
    { id: 't-1', type: 'SQL Injection Attempt', source: '192.168.45.22', severity: 'critical', status: 'blocked', timestamp: 'Just now' },
    { id: 't-2', type: 'Port Scanning', source: '45.22.11.99', severity: 'warning', status: 'active', timestamp: '5 min ago' },
    { id: 't-3', type: 'Unusual Admin Login', source: 'Frankfurt, DE', severity: 'warning', status: 'mitigated', timestamp: '1 hour ago' },
  ]);

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([
    { id: 'v-1', cve: 'CVE-2024-2111', component: 'Nginx 1.18', riskLevel: 'critical', status: 'open', description: 'Buffer overflow in HTTP/2 handling' },
    { id: 'v-2', cve: 'CVE-2023-4001', component: 'OpenSSL', riskLevel: 'medium', status: 'open', description: 'Potential memory leak in TLS handshake' },
    { id: 'v-3', cve: 'CVE-2023-9921', component: 'Kernel', riskLevel: 'low', status: 'open', description: 'Minor permission leak in usb driver' },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    { id: 'l-1', timestamp: '2024-05-25 14:30:22', actor: 'System (AI)', action: 'Auto-Blocked IP 192.168.45.22', resource: 'WAF Rule #992', status: 'success' },
    { id: 'l-2', timestamp: '2024-05-25 14:28:10', actor: 'john.doe@admin', action: 'Modified Bucket Policy', resource: 's3://billing-data', status: 'success' },
    { id: 'l-3', timestamp: '2024-05-25 14:15:00', actor: 'unknown', action: 'Failed Login Attempt', resource: 'SSH Gateway', status: 'warning' },
    { id: 'l-4', timestamp: '2024-05-25 12:00:00', actor: 'System (Cron)', action: 'Backup Verification', resource: 'DB Snapshot', status: 'success' },
    { id: 'l-5', timestamp: '2024-05-25 11:45:33', actor: 'sarah.dev', action: 'Deploy to Prod', resource: 'Capsule #102', status: 'failure' },
  ]);

  const handleBlockThreat = (id: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, status: 'blocked' } : t));
  };

  const handlePatchVulnerability = (id: string) => {
    setVulnerabilities(prev => prev.map(v => v.id === id ? { ...v, status: 'patching' } : v));
    setTimeout(() => {
       setVulnerabilities(prev => prev.map(v => v.id === id ? { ...v, status: 'remediated' } : v));
       setComplianceScore(prev => Math.min(100, prev + 2));
    }, 2500);
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      // Mock download action
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Lock className="text-plasma-600" size={32} />
            Security & Compliance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI-Powered Threat Defense & Automated Governance.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Live Status Pill */}
           <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-full border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-3">
              <div className="flex flex-col items-end">
                 <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Live Monitoring</span>
                 <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Active
                 </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 font-bold">
                 <ShieldCheck size={20} />
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-neutral-800 overflow-x-auto">
        <nav className="flex space-x-8 min-w-max">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'compliance', label: 'Compliance Reports', icon: FileText },
            { id: 'threats', label: 'Threats & Vulnerabilities', icon: AlertOctagon },
            { id: 'audit', label: 'Audit Logs', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400' 
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-neutral-600'}
              `}
            >
              <tab.icon size={16} className={activeTab === tab.id ? 'text-plasma-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'}/>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {/* Top Stats */}
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass flex flex-col items-center justify-center lg:col-span-1">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Overall Compliance</h3>
                 <HealthScore score={complianceScore} />
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {regulations.map(reg => (
                   <div key={reg.id} className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                         <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg text-gray-600 dark:text-gray-300">
                            <FileText size={18} />
                         </div>
                         {reg.status === 'compliant' && <CheckCircle2 size={18} className="text-green-500" />}
                         {reg.status === 'non-compliant' && <AlertOctagon size={18} className="text-red-500" />}
                         {reg.status === 'pending' && <Loader2 size={18} className="text-plasma-500 animate-spin" />}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-800 dark:text-white">{reg.name}</h4>
                         <div className="flex justify-between items-end mt-1">
                            <p className={`text-xs font-medium ${
                               reg.status === 'compliant' ? 'text-green-600 dark:text-green-400' : 
                               reg.status === 'non-compliant' ? 'text-red-600 dark:text-red-400' : 'text-plasma-600 dark:text-plasma-400'
                            }`}>
                               {reg.status.replace('-', ' ').toUpperCase()}
                            </p>
                            <span className="text-xs font-bold text-gray-400">{reg.score}%</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Dashboard Widgets */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Threats Mini */}
              <div className="bg-white dark:bg-neutral-800/60 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <AlertOctagon className="text-red-500" size={20}/> Active Threats
                    </h3>
                    <Button size="sm" variant="ghost" onClick={() => setActiveTab('threats')} className="dark:text-gray-400 dark:hover:text-white">View All</Button>
                 </div>
                 <div className="space-y-3">
                    {threats.slice(0, 3).map(t => (
                       <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-red-500"></div>
                             <div>
                                <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{t.type}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{t.source}</div>
                             </div>
                          </div>
                          <span className="text-xs font-medium bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-gray-100 dark:border-neutral-700 shadow-sm uppercase dark:text-gray-300">
                             {t.status}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* AI Insights Mini */}
              <div className="bg-gradient-to-br from-indigo-600 to-plasma-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                       <Sparkles size={20}/> AI Risk Assessment
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                       System integrity is stable. However, <strong>HIPAA compliance</strong> is at risk due to an unencrypted backup volume found in <em>us-west</em> region.
                    </p>
                    <Button className="!bg-white !text-indigo-600 hover:bg-indigo-50 border-none w-full justify-between group shadow-md hover:shadow-lg transition-all dark:!bg-white dark:!text-indigo-600 dark:hover:bg-indigo-50">
                       <span className="font-bold">Auto-Remediate Violation</span> <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                    </Button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              </div>
           </div>
        </div>
      )}

      {/* COMPLIANCE TAB */}
      {activeTab === 'compliance' && (
         <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Header Action */}
            <div className="bg-white dark:bg-neutral-800/60 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Compliance Reports</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xl">
                     Generate automated audit reports for regulatory bodies (SOC2, GDPR, HIPAA). AI gathers logs, configurations, and incident history instantly.
                  </p>
               </div>
               <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <Button 
                     className="gap-2 shadow-lg shadow-plasma-500/20 py-3 px-6 w-full md:w-auto justify-center"
                     isLoading={isGeneratingReport}
                     onClick={handleGenerateReport}
                  >
                     {isGeneratingReport ? 'Generating PDF...' : <><Download size={18} /> Generate Audit Report</>}
                  </Button>
                  
                  {/* Scheduled Reporting Toggle */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                     <span className="font-medium">Scheduled (Monthly)</span>
                     <button onClick={() => setScheduledReporting(!scheduledReporting)} className={`text-plasma-600 dark:text-plasma-400 transition-transform ${scheduledReporting ? '' : 'grayscale opacity-50'}`}>
                        {scheduledReporting ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* AI Recommendations */}
               <div className="bg-white dark:bg-neutral-800/60 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <Sparkles size={18} className="text-plasma-600" /> Post-Audit Analysis
                  </h3>
                  <div className="space-y-4">
                     <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">HIPAA Violation Detected</h4>
                           <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">CRITICAL</span>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mb-3 leading-relaxed">
                           Database backup encryption is using outdated AES-128. Upgrade to AES-256 GCM immediately to meet compliance standards.
                        </p>
                        <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700 border-none text-xs w-full">
                           Auto-Fix: Upgrade Encryption
                        </Button>
                     </div>
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl">
                        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-1">Access Control Optimization (SOC 2)</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                           User 'dev-team' has unnecessary write access to Production Billing.
                        </p>
                        <Button size="sm" variant="secondary" className="text-xs w-full dark:bg-neutral-700 dark:text-white">
                           Review Permissions
                        </Button>
                     </div>
                  </div>
               </div>

               {/* Report History */}
               <div className="bg-white dark:bg-neutral-800/60 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <History size={18} className="text-gray-500" /> Report History
                  </h3>
                  <div className="space-y-3">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10 group gap-3 sm:gap-0">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-lg group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:shadow-sm transition-all"><FileText size={16}/></div>
                              <div>
                                 <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Q{4-i} 2024 Audit Report</div>
                                 <div className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10}/> Generated automatically</div>
                              </div>
                           </div>
                           <Button size="sm" variant="ghost" className="text-gray-400 hover:text-plasma-600 w-full sm:w-auto"><Download size={16} /></Button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* THREATS TAB */}
      {activeTab === 'threats' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6 relative z-10">
                     <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                        <Activity size={16} className="text-red-500" /> Live Traffic Monitoring
                     </h3>
                     <div className="text-xs text-gray-400 flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Real-time Ingress</div>
                  </div>
                  
                  {/* Live Traffic Graph */}
                  <div className="h-40 w-full mb-6 relative z-10">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                           <defs>
                              <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <XAxis hide />
                           <Tooltip contentStyle={{background: '#1f2937', border: 'none', color: '#fff'}} />
                           <Area type="monotone" dataKey="requests" stroke="#ef4444" fill="url(#trafficGrad)" strokeWidth={2} isAnimationActive={false} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="space-y-3 relative z-10">
                     <h4 className="text-xs font-bold text-gray-400 uppercase">Recent Events</h4>
                     {threats.map(threat => (
                        <div key={threat.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/10 transition-colors gap-4 sm:gap-0">
                           <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${
                                 threat.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 
                                 threat.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                 <AlertOctagon size={18} />
                              </div>
                              <div>
                                 <div className="font-bold text-gray-100">{threat.type}</div>
                                 <div className="text-xs text-gray-400 flex items-center gap-2">
                                    <Globe size={10} /> {threat.source}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              {threat.status === 'active' && <Button size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700 border-none w-full sm:w-auto" onClick={() => handleBlockThreat(threat.id)}><Ban size={12} className="mr-1"/> Block IP</Button>}
                              {threat.status === 'blocked' && <span className="text-green-400 text-xs font-bold bg-green-900/20 px-2 py-1 rounded">Blocked</span>}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-1 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass flex flex-col">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                  <Eye size={16} /> Vulnerability Scanner
               </h3>
               <div className="flex-1 space-y-4">
                  {vulnerabilities.map(vuln => (
                     <div key={vuln.id} className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-white/5 rounded-xl p-4 shadow-sm relative">
                        {vuln.status === 'remediated' && (
                           <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 z-10 flex items-center justify-center rounded-xl">
                              <span className="text-green-600 font-bold text-sm flex items-center gap-2"><CheckCircle2 size={16}/> Fixed</span>
                           </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{vuln.cve}</span>
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              vuln.riskLevel === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                              vuln.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                           }`}>{vuln.riskLevel}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-200 text-sm">{vuln.component}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{vuln.description}</p>
                        <Button size="sm" className="w-full text-xs dark:bg-neutral-700 dark:text-white" variant="secondary" isLoading={vuln.status === 'patching'} onClick={() => handlePatchVulnerability(vuln.id)}>
                           {vuln.status === 'patching' ? 'Patching...' : 'Auto-Patch'}
                        </Button>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
         <div className="bg-white dark:bg-neutral-800/60 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col md:flex-row justify-between gap-4">
               <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Audit Ledger</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Immutable record of all system actions and security events.</p>
               </div>
               <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full sm:w-auto">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input type="text" placeholder="Search actor, action..." className="pl-9 pr-4 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-plasma-200 outline-none w-full sm:w-64 dark:text-white" />
                  </div>
                  <div className="flex gap-2">
                     <Button variant="secondary" className="px-3 dark:bg-neutral-700 dark:text-white flex-1 sm:flex-none justify-center"><Filter size={16} /> Filter</Button>
                     <Button variant="secondary" className="px-3 dark:bg-neutral-700 dark:text-white flex-1 sm:flex-none justify-center"><Download size={16} /> Export</Button>
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-white/5">
                     <tr>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">Actor</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Resource</th>
                        <th className="px-6 py-4">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                     {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{log.timestamp}</td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 shrink-0">
                                    {log.actor.charAt(0).toUpperCase()}
                                 </div>
                                 <span className="font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap">{log.actor}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{log.action}</td>
                           <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400 text-xs"><span className="bg-gray-50/50 dark:bg-white/5 rounded w-fit px-2 py-1">{log.resource}</span></td>
                           <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                                 log.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800' : 
                                 log.status === 'failure' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                              }`}>
                                 {log.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-center">
               <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">Load More Logs</Button>
            </div>
         </div>
      )}

    </div>
  );
};