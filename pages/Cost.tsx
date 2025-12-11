import React, { useState } from 'react';
import { 
  CreditCard, TrendingDown, DollarSign, PieChart, 
  ArrowRight, CheckCircle2, AlertTriangle, Sparkles, 
  Wallet, HardDrive, Cpu, Network, TrendingUp, Edit2
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

// Mock Data
const COST_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  spend: Math.floor(20 + Math.random() * 10),
  forecast: i > 25 ? Math.floor(28 + Math.random() * 5) : null,
  budget: 35
}));

interface SavingOp {
  id: string;
  title: string;
  saving: string;
  type: 'compute' | 'storage' | 'network';
  description: string;
  status: 'pending' | 'applied';
}

export const Cost: React.FC = () => {
  const [savings, setSavings] = useState<SavingOp[]>([
    { id: '1', title: 'Downsize Dev VPS', saving: '$12.00/mo', type: 'compute', description: 'Instance "dev-api" avg CPU < 5%. Resize to 1 vCPU.', status: 'pending' },
    { id: '2', title: 'Delete Unattached Volume', saving: '$8.50/mo', type: 'storage', description: 'Volume vol-0921 is not attached to any instance.', status: 'pending' },
    { id: '3', title: 'Use Reserved Instances', saving: '$45.00/mo', type: 'compute', description: 'Commit to 1-year plan for Prod DB.', status: 'pending' },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview');

  const handleApplySaving = (id: string) => {
    setSavings(prev => prev.map(s => s.id === id ? { ...s, status: 'applied' } : s));
  };

  const totalSpend = 482.50;
  const projectedSpend = 520.00;
  const budget = 600.00;

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <CreditCard className="text-plasma-600" size={32} />
            Cost & Budgeting
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Financial Governance & AI-Driven Optimization.
          </p>
        </div>
        <div className="flex gap-2 bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl w-full md:w-auto">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-neutral-700 shadow-sm text-plasma-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('projects')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-white dark:bg-neutral-700 shadow-sm text-plasma-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Project Budgets
            </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Left Column: Charts & Overview */}
          <div className="lg:col-span-2 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Month-to-Date Spend</h3>
                      <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${totalSpend.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">Updates hourly</div>
                  </div>
                  <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Forecast (End of Month)</h3>
                      <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${projectedSpend.toFixed(2)}</div>
                      <div className={`text-xs font-bold mt-1 ${projectedSpend > budget ? 'text-red-500' : 'text-green-500'}`}>
                          {projectedSpend > budget ? 'Over Budget' : 'Within Budget'}
                      </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-600 to-plasma-600 rounded-3xl p-6 text-white shadow-lg">
                      <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wide flex items-center gap-2">
                          <Sparkles size={14} /> Potential Savings
                      </h3>
                      <div className="mt-2 text-3xl font-bold text-white">$65.50<span className="text-sm font-normal text-indigo-200">/mo</span></div>
                      <p className="text-xs text-indigo-100 mt-1 opacity-80">3 recommendations available</p>
                  </div>
              </div>

              {/* Main Chart */}
              <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-8 shadow-glass">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">Daily Spend vs Forecast</h3>
                      <div className="flex gap-4 text-xs font-medium">
                          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-plasma-500"></span> Actual</div>
                          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-400 opacity-50 border border-dashed border-indigo-600"></span> Forecast</div>
                          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400/50"></span> Budget Limit</div>
                      </div>
                  </div>

                  <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={COST_HISTORY}>
                              <defs>
                                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-neutral-700" />
                              <XAxis dataKey="day" hide />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(value) => `$${value}`} />
                              <Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#1e293b', borderColor: '#374151', color: '#f3f4f6' }} formatter={(value: number) => `$${value.toFixed(2)}`} />
                              <ReferenceLine y={35} label="Daily Budget Cap" stroke="red" strokeDasharray="3 3" />
                              
                              <Area type="monotone" dataKey="spend" stroke="#3b82f6" fill="url(#colorSpend)" strokeWidth={3} />
                              <Area type="monotone" dataKey="forecast" stroke="#818cf8" fill="transparent" strokeDasharray="5 5" strokeWidth={3} />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Resource Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center gap-3 shadow-sm">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Cpu size={20}/></div>
                      <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Compute</div>
                          <div className="font-bold text-gray-900 dark:text-white">$240.00</div>
                      </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center gap-3 shadow-sm">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><HardDrive size={20}/></div>
                      <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Storage</div>
                          <div className="font-bold text-gray-900 dark:text-white">$120.00</div>
                      </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center gap-3 shadow-sm">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><Network size={20}/></div>
                      <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Network</div>
                          <div className="font-bold text-gray-900 dark:text-white">$122.50</div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Right Column: AI Recommendations */}
          <div className="lg:col-span-1 space-y-6">
              
              {/* AI Advisor */}
              <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Sparkles size={16} /> FinOps Advisor
                  </h3>
                  
                  <div className="space-y-4">
                      {savings.map(rec => (
                          <div key={rec.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm relative overflow-hidden">
                              {rec.status === 'applied' && (
                                  <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 z-10 flex items-center justify-center">
                                      <span className="text-green-600 font-bold text-sm flex items-center gap-2">
                                          <CheckCircle2 size={16} /> Optimization Applied
                                      </span>
                                  </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-2">
                                  <div className={`p-1.5 rounded-lg ${rec.type === 'compute' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                                      {rec.type === 'compute' ? <Cpu size={16} /> : <HardDrive size={16} />}
                                  </div>
                                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">
                                      Save {rec.saving}
                                  </span>
                              </div>
                              
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{rec.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{rec.description}</p>
                              
                              <Button 
                                  size="sm" 
                                  className="w-full text-xs dark:bg-neutral-700 dark:text-white" 
                                  variant="secondary"
                                  onClick={() => handleApplySaving(rec.id)}
                              >
                                  Apply Fix
                              </Button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4">
             {[
                { name: 'E-Commerce Prod', used: 240, limit: 300, trend: 'up' },
                { name: 'Dev Environment', used: 45, limit: 50, trend: 'stable' },
                { name: 'Marketing Site', used: 12, limit: 100, trend: 'down' },
                { name: 'Analytics Service', used: 85, limit: 150, trend: 'up' },
                { name: 'Legacy API', used: 195, limit: 200, trend: 'stable' },
             ].map((proj, i) => {
                const percent = (proj.used / proj.limit) * 100;
                const isCritical = percent > 90;
                const isWarning = percent > 75;

                return (
                    <div key={i} className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="font-bold text-lg text-gray-900 dark:text-white">{proj.name}</div>
                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                    {proj.trend === 'up' && <TrendingUp size={12} className="text-red-400" />}
                                    {proj.trend === 'down' && <TrendingDown size={12} className="text-green-400" />}
                                    {proj.trend === 'stable' && <ArrowRight size={12} className="text-gray-400" />}
                                    Forecast: ${Math.round(proj.used * 1.1)}
                                </div>
                            </div>
                            <div className={`p-2 rounded-xl ${isCritical ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500'}`}>
                                <Wallet size={20} />
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-2">
                             <div className="text-2xl font-bold text-gray-900 dark:text-white">${proj.used}</div>
                             <div className="text-sm font-medium text-gray-500 dark:text-gray-400">/ ${proj.limit}</div>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden mb-3">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                    isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-plasma-500'
                                }`} 
                                style={{ width: `${Math.min(100, percent)}%` }}
                            ></div>
                        </div>
                        
                        {isWarning && (
                            <div className={`flex items-center gap-1.5 text-xs font-bold mb-4 ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                <AlertTriangle size={12} /> 
                                {isCritical ? 'Budget Exceeded Alert' : 'Approaching Limit'}
                            </div>
                        )}
                        
                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                           <span className="text-xs text-gray-400">Resets in 12 days</span>
                           <button className="text-xs font-bold text-plasma-600 dark:text-plasma-400 hover:underline flex items-center gap-1">
                              <Edit2 size={12} /> Adjust Cap
                           </button>
                        </div>
                    </div>
                );
            })}
             
             {/* Add New Budget */}
             <div className="border-2 border-dashed border-gray-300/50 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500 hover:border-plasma-300 dark:hover:border-plasma-500/50 hover:text-plasma-500 dark:hover:text-plasma-400 hover:bg-plasma-50/10 dark:hover:bg-plasma-900/10 transition-all cursor-pointer min-h-[220px]">
                <div className="w-12 h-12 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center shadow-sm">
                   <Edit2 size={20} />
                </div>
                <span className="font-bold">Set New Budget</span>
             </div>
        </div>
      )}
    </div>
  );
};