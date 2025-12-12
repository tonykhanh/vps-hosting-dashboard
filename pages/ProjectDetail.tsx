
import React, { useState } from 'react';
import { useParams, useNavigate } from '../context/ThemeContext';
import { MOCK_PROJECTS } from '../constants';
import { Card, CardHeader } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Globe, RefreshCw, Power, Terminal, Settings } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = MOCK_PROJECTS.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'logs'>('overview');

  if (!project) return <div className="p-10 text-center">Project not found</div>;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/console')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {project.name}
            <Badge status={project.status} />
          </h1>
          <a href={`https://${project.domain}`} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mt-1">
            <Globe size={14} /> {project.domain}
          </a>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" size="sm"><RefreshCw size={16} className="mr-2"/> Redeploy</Button>
           <Button variant="secondary" size="sm"><Terminal size={16} className="mr-2"/> Console</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'metrics', 'logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader title="Instance Details" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                       <span className="block text-gray-500 text-xs uppercase mb-1">IP Address</span>
                       <span className="font-mono font-medium">{project.ip}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                       <span className="block text-gray-500 text-xs uppercase mb-1">Region</span>
                       <span className="font-medium">{project.region.toUpperCase()}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                       <span className="block text-gray-500 text-xs uppercase mb-1">Blueprint</span>
                       <span className="font-medium">{project.blueprint}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                       <span className="block text-gray-500 text-xs uppercase mb-1">Created At</span>
                       <span className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Deployment History" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                         <div>
                            <p className="text-sm font-medium text-gray-900">Commit #{1000 + i}</p>
                            <p className="text-xs text-gray-500">Deployed by John Doe • 2 hours ago</p>
                         </div>
                         <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Success</span>
                      </div>
                    ))}
                  </div>
                </Card>
             </div>
             
             <div className="space-y-6">
                <Card className="bg-gray-900 text-white border-gray-800">
                   <CardHeader title="Quick Actions" className="text-white" />
                   <div className="space-y-2">
                      <button className="w-full text-left px-4 py-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-sm flex items-center justify-between group">
                         <span>Restart Server</span>
                         <RefreshCw size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                      </button>
                      <button className="w-full text-left px-4 py-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-sm flex items-center justify-between group">
                         <span>Flush Cache</span>
                         <Terminal size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                      </button>
                      <button className="w-full text-left px-4 py-3 rounded bg-red-900/20 text-red-400 hover:bg-red-900/30 transition-colors text-sm flex items-center justify-between group">
                         <span>Stop Instance</span>
                         <Power size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                      </button>
                   </div>
                </Card>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-2">AI Insight</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Traffic has increased by 15% in the last hour. CPU usage is stable at 25%. No action needed, but keep an eye on memory if trend continues.
                  </p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
             <Card>
               <CardHeader title="CPU Usage (%)" />
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={project.metrics.cpu}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="time" hide />
                     <YAxis />
                     <Tooltip />
                     <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </Card>
             <Card>
               <CardHeader title="Memory Usage (%)" />
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={project.metrics.memory}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="time" hide />
                     <YAxis />
                     <Tooltip />
                     <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </Card>
          </div>
        )}

        {activeTab === 'logs' && (
          <Card className="bg-gray-900 text-gray-200 font-mono text-xs p-0 overflow-hidden">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
               <span>Live Logs (tail -f)</span>
               <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Connected</span>
             </div>
             <div className="p-4 space-y-1 h-[500px] overflow-y-auto">
                <div className="text-gray-500">[2024-05-24 10:00:01] INFO: Request received GET /api/v1/status</div>
                <div className="text-gray-500">[2024-05-24 10:00:02] INFO: Processing job queue: 0 jobs</div>
                <div className="text-green-400">[2024-05-24 10:00:05] SUCCESS: Health check returned 200 OK</div>
                <div className="text-gray-500">[2024-05-24 10:01:15] INFO: Worker process started (PID 234)</div>
                <div className="text-yellow-400">[2024-05-24 10:02:00] WARN: Memory usage spiked to 60%</div>
                <div className="text-gray-500">[2024-05-24 10:02:01] INFO: Garbage collection ran. Memory freed.</div>
                {/* Simulated log lines */}
                {Array.from({length: 10}).map((_, i) => (
                   <div key={i} className="text-gray-500">[2024-05-24 10:0{2+i}:00] INFO: Keeping connection alive...</div>
                ))}
             </div>
          </Card>
        )}
      </div>
    </div>
  );
};
