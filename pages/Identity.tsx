import React, { useState } from 'react';
import { 
  Fingerprint, Shield, UserCheck, AlertTriangle, 
  Key, LogOut, Globe, Clock, CheckCircle2, 
  Unlock, Lock, MoreHorizontal, FileText, ArrowRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const ACTIVE_SESSIONS = [
  { id: 1, user: 'John Doe', ip: '192.168.1.1', device: 'Chrome / MacOS', location: 'Singapore', time: 'Just now', status: 'active' },
  { id: 2, user: 'Sarah Connor', ip: '104.22.11.1', device: 'Firefox / Windows', location: 'Vietnam', time: '5m ago', status: 'active' },
  { id: 3, user: 'Mike Ross', ip: '45.33.22.11', device: 'Safari / iPhone', location: 'USA', time: '1h ago', status: 'idle' },
];

const ACCESS_LOGS = Array.from({ length: 15 }, (_, i) => ({
  time: `${i}:00`,
  success: Math.floor(Math.random() * 50) + 10,
  failed: Math.floor(Math.random() * 5),
}));

export const Identity: React.FC = () => {
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [autoRevoke, setAutoRevoke] = useState(false);

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Fingerprint className="text-plasma-600" size={32} />
            Identity & Access (IAM)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Zero-Trust Access Control & AI Behavior Analysis.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <Button variant="secondary" className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700 w-full sm:w-auto justify-center">
              <FileText size={16} className="mr-2"/> Audit Report
           </Button>
           <Button className="w-full sm:w-auto justify-center">
              <UserCheck size={16} className="mr-2"/> Grant Access
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: KPI & Settings */}
        <div className="space-y-6">
           {/* Security Score */}
           <div className="bg-gradient-to-br from-indigo-600 to-plasma-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-wide flex items-center gap-2">
                    <Shield size={16} /> Identity Score
                 </h3>
                 <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold">92</span>
                    <span className="text-xl text-indigo-200">/100</span>
                 </div>
                 <p className="text-xs text-indigo-100 mt-2">
                    Excellent. MFA is enforced for all admins.
                 </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           </div>

           {/* Policy Controls */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Access Policies</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Enforce MFA</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400">Require 2FA for all roles</div>
                    </div>
                    <button 
                       onClick={() => setMfaEnforced(!mfaEnforced)}
                       className={`w-12 h-6 rounded-full transition-colors relative ${mfaEnforced ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${mfaEnforced ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Auto-Revocation</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400">Remove access after 30 days idle</div>
                    </div>
                    <button 
                       onClick={() => setAutoRevoke(!autoRevoke)}
                       className={`w-12 h-6 rounded-full transition-colors relative ${autoRevoke ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${autoRevoke ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>
              </div>
           </div>

           {/* AI Insight */}
           <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-2">
                 <AlertTriangle size={16} /> Over-Privileged User
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed mb-3">
                 User <strong>Mike Ross</strong> has 'Admin' rights but hasn't performed admin actions in 45 days.
              </p>
              <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 border-none text-white text-xs h-8">
                 Downgrade to Viewer
              </Button>
           </div>
        </div>

        {/* Center/Right: Sessions & Charts */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Login Activity Chart */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass h-72">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Authentication Activity</h3>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ACCESS_LOGS} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                        <Tooltip contentStyle={{ borderRadius: '8px', background: '#1f2937', border: 'none', color: '#fff' }} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Area type="monotone" dataKey="success" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} name="Success" />
                        <Area type="monotone" dataKey="failed" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} name="Failed" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Active Sessions List */}
           <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Globe size={18} className="text-gray-400" /> Active Sessions
                 </h3>
                 <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    3 Live
                 </span>
              </div>

              <div className="space-y-4">
                 {ACTIVE_SESSIONS.map(session => (
                    <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 gap-4 sm:gap-0">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-white dark:bg-neutral-800 shadow-sm border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 shrink-0`}>
                             {session.user.charAt(0)}
                          </div>
                          <div>
                             <div className="font-bold text-sm text-gray-900 dark:text-white">{session.user}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5 flex-wrap">
                                <span>{session.ip}</span> • <span>{session.location}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                          <div className="text-xs font-medium text-gray-900 dark:text-white order-2 sm:order-1">{session.device}</div>
                          <div className="text-xs text-gray-400 mt-0.5 flex items-center sm:justify-end gap-1 order-1 sm:order-2">
                             <Clock size={10} /> {session.time}
                          </div>
                          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors sm:hidden order-3" title="Revoke Session">
                             <LogOut size={16} />
                          </button>
                       </div>
                       <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors hidden sm:block" title="Revoke Session">
                          <LogOut size={16} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};