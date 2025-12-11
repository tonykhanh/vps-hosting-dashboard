import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, 
  Clock, Activity, Search, Zap, FileText, 
  ArrowRight, RefreshCw, Server, Database, 
  Terminal, X, Loader2
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface Incident {
  id: string;
  title: string;
  type: 'critical' | 'warning' | 'info';
  status: 'pending' | 'in_progress' | 'resolved';
  time: string;
  service: string;
  description: string;
  rootCause?: string;
  aiRecommendation?: string;
  actions: { label: string, handler: string }[];
}

interface Risk {
  id: string;
  title: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'critical' | 'moderate';
  forecastTime: string;
}

export const Incidents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('inc-1');
  const [isResolving, setIsResolving] = useState(false);

  // Mock Data
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'inc-1',
      title: 'Database Connection Pool Exhausted',
      type: 'critical',
      status: 'pending',
      time: '10 min ago',
      service: 'PostgreSQL-Main',
      description: 'Application API is returning 500 errors. Database connections have reached max_connections limit (100/100).',
      rootCause: 'A recent deployment introduced a slow query in the analytics module that is locking table rows longer than expected, causing connection pile-up.',
      aiRecommendation: 'Immediate restart of the connection pool is required to clear stuck connections. Follow up with scaling Read Replicas.',
      actions: [
        { label: 'Restart Connection Pool', handler: 'restart_pool' },
        { label: 'Kill Idle Queries', handler: 'kill_queries' },
        { label: 'Scale Read Replica', handler: 'scale_db' }
      ]
    },
    {
      id: 'inc-2',
      title: 'High API Latency (>2s)',
      type: 'warning',
      status: 'in_progress',
      time: '45 min ago',
      service: 'API Gateway',
      description: 'Average response time increased from 150ms to 2100ms in the last hour.',
      rootCause: 'Traffic spike from IP range 192.168.x.x (Potential Bot Crawl). Cache hit ratio dropped to 10%.',
      aiRecommendation: 'Enable Rate Limiting for unauthenticated users and purge CDN cache for affected routes.',
      actions: [
        { label: 'Enable WAF Rate Limit', handler: 'enable_waf' },
        { label: 'Purge CDN Cache', handler: 'purge_cache' }
      ]
    }
  ]);

  const [risks, setRisks] = useState<Risk[]>([
    { id: 'r-1', title: 'SSL Certificate Expiry', probability: 'high', impact: 'critical', forecastTime: '3 days' },
    { id: 'r-2', title: 'Disk Volume Saturation', probability: 'medium', impact: 'critical', forecastTime: '48 hours' }
  ]);

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  const handleAction = (action: string) => {
    setIsResolving(true);
    // Simulate resolution
    setTimeout(() => {
      setIsResolving(false);
      setIncidents(prev => prev.map(inc => 
        inc.id === selectedIncidentId ? { ...inc, status: 'resolved' } : inc
      ));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'in_progress': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'resolved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 dark:bg-neutral-800';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'critical': return <ShieldAlert size={18} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber-500" />;
      case 'info': return <Activity size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-20 relative h-auto min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={32} />
            Incident & Risk Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI-Driven Root Cause Analysis & Automated Remediation.
          </p>
        </div>
        
        {/* Risk Score Pill */}
        <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-full border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
           <div className="flex flex-col items-start md:items-end">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">System Risk Level</span>
              <span className="text-sm font-bold text-amber-500">Moderate</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold">
              45
           </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Left Col: Incident Feed */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
           <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg w-full md:w-fit overflow-x-auto">
              <button 
                onClick={() => setActiveTab('current')}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'current' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                Active Issues ({incidents.filter(i => i.status !== 'resolved').length})
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                Resolved
              </button>
           </div>

           <div className="space-y-3">
              {incidents
                .filter(i => activeTab === 'current' ? i.status !== 'resolved' : i.status === 'resolved')
                .map(incident => (
                  <div 
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                      ${selectedIncidentId === incident.id 
                        ? 'bg-white dark:bg-neutral-800 border-plasma-500 ring-2 ring-plasma-100 dark:ring-plasma-900 shadow-lg' 
                        : 'bg-white/60 dark:bg-neutral-800/60 border-white/60 dark:border-white/10 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          {getSeverityIcon(incident.type)}
                          <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(incident.status)}`}>
                             {incident.status.replace('_', ' ')}
                          </span>
                       </div>
                       <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {incident.time}
                       </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-plasma-600 transition-colors">
                      {incident.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {incident.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                       <Server size={12} /> {incident.service}
                    </div>
                  </div>
              ))}
              
              {incidents.filter(i => activeTab === 'current' ? i.status !== 'resolved' : i.status === 'resolved').length === 0 && (
                 <div className="text-center py-10 text-gray-400">
                    <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
                    <p>No incidents found.</p>
                 </div>
              )}
           </div>

           {/* Risk Forecast Section (Sticky Bottom Left) */}
           <div className="mt-auto bg-gradient-to-br from-gray-900 to-gray-800 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl p-5 text-white shadow-xl">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <Zap size={14} className="text-amber-400" /> Predicted Risks (Next 48h)
              </h4>
              <div className="space-y-3">
                 {risks.map(risk => (
                   <div key={risk.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5 hover:border-white/20">
                      <div>
                         <div className="text-sm font-medium text-gray-200">{risk.title}</div>
                         <div className="text-xs text-gray-400">Forecast: {risk.forecastTime}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${risk.probability === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                         {risk.probability} Prob.
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Col: Detail View / Situation Room */}
        <div className="lg:col-span-8 h-full">
           {selectedIncident ? (
             <div className="space-y-6 animate-in slide-in-from-right duration-300">
                
                {/* 1. Header Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-gray-200 dark:border-neutral-700 shadow-sm relative overflow-hidden">
                   {selectedIncident.status === 'resolved' && (
                     <div className="absolute top-0 right-0 p-6">
                        <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold flex items-center gap-2 border border-green-200 dark:border-green-800">
                           <CheckCircle2 size={18} /> Incident Resolved
                        </div>
                     </div>
                   )}
                   <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      {getSeverityIcon(selectedIncident.type)}
                      <span className="text-sm text-gray-500 font-mono uppercase tracking-wide">ID: {selectedIncident.id.toUpperCase()}</span>
                   </div>
                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{selectedIncident.title}</h2>
                   <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                      {selectedIncident.description}
                   </p>
                </div>

                {/* 2. RCA & AI Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-plasma-100 dark:border-plasma-900/30 rounded-3xl p-6 shadow-glass relative">
                      <div className="absolute -top-3 -left-3 bg-plasma-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                         <Zap size={12} /> Root Cause Analysis
                      </div>
                      <div className="mt-2 space-y-4">
                         <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {selectedIncident.rootCause}
                         </p>
                         <div className="text-xs text-gray-400 flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                            <Activity size={14} /> Analysis confidence: 98.5%
                         </div>
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold mb-4">
                         <FileText size={18} /> AI Recommendation
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                         {selectedIncident.aiRecommendation}
                      </p>
                      <div className="flex flex-wrap gap-2">
                         {selectedIncident.actions.map((action, idx) => (
                           <Button 
                              key={idx}
                              size="sm"
                              variant="secondary"
                              className="text-xs dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
                              disabled={selectedIncident.status === 'resolved' || isResolving}
                              onClick={() => handleAction(action.handler)}
                           >
                              {action.label}
                           </Button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* 3. Remediation Actions (The Big Buttons) */}
                {selectedIncident.status !== 'resolved' && (
                  <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-3xl p-8">
                     <h3 className="text-gray-900 dark:text-white font-bold mb-6 flex items-center gap-2">
                        <Terminal size={20} className="text-gray-500" /> Remediation Console
                     </h3>
                     
                     {isResolving ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                           <div className="relative">
                              <div className="w-16 h-16 border-4 border-plasma-200 border-t-plasma-600 rounded-full animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Zap size={24} className="text-plasma-600 animate-pulse" />
                              </div>
                           </div>
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white">Executing Remediation Plan...</h4>
                           <p className="text-gray-500 dark:text-gray-400">Restarting connection pool and verifying health checks.</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <button 
                             onClick={() => handleAction('restart')}
                             className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl hover:border-plasma-500 hover:shadow-md transition-all text-left gap-3 sm:gap-0"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg group-hover:bg-plasma-50 dark:group-hover:bg-plasma-900/20 group-hover:text-plasma-600 transition-colors">
                                    <RefreshCw size={20} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-plasma-700 dark:group-hover:text-plasma-400">One-Click Fix</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Execute recommended automated recovery</div>
                                 </div>
                              </div>
                              <ArrowRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-plasma-500 group-hover:translate-x-1 transition-all hidden sm:block" />
                           </button>

                           <button className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl hover:border-gray-400 dark:hover:border-neutral-500 hover:shadow-md transition-all text-left gap-3 sm:gap-0">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-lg">
                                    <Database size={20} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-gray-900 dark:text-white">Manual Console</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Open terminal access to DB node</div>
                                 </div>
                              </div>
                              <ArrowRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-all hidden sm:block" />
                           </button>
                        </div>
                     )}
                  </div>
                )}

                {/* 4. Timeline / Logs */}
                <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Incident Timeline</h3>
                   <div className="space-y-4 pl-4 border-l-2 border-gray-100 dark:border-neutral-700">
                      <div className="relative">
                         <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900 shadow-sm"></div>
                         <div className="text-sm text-gray-900 dark:text-white font-bold">Incident Detected</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400">{selectedIncident.time} • Detected by Anomaly Watchdog</div>
                      </div>
                      <div className="relative">
                         <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-neutral-900 shadow-sm"></div>
                         <div className="text-sm text-gray-900 dark:text-white font-bold">AI Analysis Completed</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400">2 min later • Root cause identified as connection saturation</div>
                      </div>
                      {selectedIncident.status === 'resolved' && (
                        <div className="relative">
                           <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-neutral-900 shadow-sm"></div>
                           <div className="text-sm text-gray-900 dark:text-white font-bold">Resolved</div>
                           <div className="text-xs text-gray-500 dark:text-gray-400">Just now • Automated pool restart successful</div>
                        </div>
                      )}
                   </div>
                </div>

             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <ShieldAlert size={64} className="opacity-20" />
                <p>Select an incident to view the situation room.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};