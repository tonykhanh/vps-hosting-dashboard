
import React, { useState } from 'react';
import { 
  Sparkles, User, Layout, MousePointer, 
  MessageSquare, Zap, BarChart3, Settings, 
  CheckCircle2, Palette, Smartphone, X, Send
} from 'lucide-react';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data Generators based on Persona
const getUsageData = (persona: string) => {
  if (persona === 'Developer') {
    return [
      { feature: 'Terminal', clicks: 150, time: 80 },
      { feature: 'Logs', clicks: 120, time: 60 },
      { feature: 'Deploy', clicks: 90, time: 30 },
      { feature: 'Monitoring', clicks: 60, time: 20 },
      { feature: 'Settings', clicks: 10, time: 5 },
    ];
  } else if (persona === 'Manager') {
    return [
      { feature: 'Dashboard', clicks: 200, time: 100 },
      { feature: 'Cost', clicks: 150, time: 80 },
      { feature: 'Team', clicks: 80, time: 40 },
      { feature: 'Reports', clicks: 60, time: 30 },
      { feature: 'Settings', clicks: 20, time: 10 },
    ];
  }
  // Power User (Default)
  return [
    { feature: 'Dashboard', clicks: 120, time: 45 },
    { feature: 'Deploy', clicks: 80, time: 15 },
    { feature: 'Monitoring', clicks: 200, time: 120 },
    { feature: 'Logs', clicks: 150, time: 60 },
    { feature: 'Settings', clicks: 20, time: 5 },
  ];
};

const ENGAGEMENT_TREND = Array.from({ length: 7 }, (_, i) => ({
  day: `Day ${i+1}`,
  score: 70 + Math.random() * 20
}));

export const UXOptimization: React.FC = () => {
  const [persona, setPersona] = useState('Power User');
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true);
  
  // New States for "Missing Functions"
  const [aiSuggestionVisible, setAiSuggestionVisible] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [syncOS, setSyncOS] = useState(true);

  // Dynamic Data based on state
  const usageData = getUsageData(persona);

  const handleFeedbackSubmit = () => {
    if (!feedback) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedback('');
      setFeedbackSent(false);
    }, 2000);
  };

  return (
    <div className={`space-y-8 pb-20 relative h-full ${highContrast ? 'grayscale contrast-125' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-plasma-600" size={32} />
            UX Intelligence
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI-Driven Personalization & Adaptive Interfaces.
          </p>
        </div>
        
        {/* Adaptive Toggle */}
        <div 
          onClick={() => setAdaptiveMode(!adaptiveMode)}
          className={`
            cursor-pointer px-4 py-2 rounded-full border flex items-center gap-3 transition-all duration-300 w-full md:w-auto justify-between md:justify-start select-none
            ${adaptiveMode ? 'bg-plasma-600 border-plasma-500 text-white shadow-neon' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400'}
          `}
        >
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider">Adaptive UI</span>
            <span className="text-[10px] opacity-80">{adaptiveMode ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${adaptiveMode ? 'bg-white/30' : 'bg-gray-200 dark:bg-neutral-600'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${adaptiveMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Analysis */}
        <div className="space-y-6">
           {/* Persona Card */}
           <div className="bg-gradient-to-br from-indigo-600 to-plasma-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500">
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><User size={24}/></div>
                        <div>
                           <div className="text-xs text-indigo-200 uppercase font-bold">Detected Persona</div>
                           <div className="text-2xl font-bold">{persona}</div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Persona Selector (Simulated AI Detection Change) */}
                 <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-lg">
                    {['Power User', 'Developer', 'Manager'].map(p => (
                        <button 
                            key={p}
                            onClick={() => setPersona(p)}
                            className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${persona === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
                        >
                            {p}
                        </button>
                    ))}
                 </div>

                 <p className="text-indigo-100 text-sm leading-relaxed mb-4 h-16">
                    {persona === 'Power User' && "You frequently access monitoring logs and scaling controls. Optimizing for high-density data."}
                    {persona === 'Developer' && "Code-centric workflow detected. Emphasizing logs, terminal access, and deployment triggers."}
                    {persona === 'Manager' && "High-level overview preference. Prioritizing cost, team health, and reporting dashboards."}
                 </p>
                 <div className="flex gap-2">
                    <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold">#{persona.replace(' ', '')}</span>
                    <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold">#NightMode</span>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           </div>

           {/* Engagement Metrics */}
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <BarChart3 size={16} /> Engagement Score
              </h3>
              <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ENGAGEMENT_TREND}>
                       <defs>
                          <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Tooltip 
                            contentStyle={{borderRadius: '8px', background: '#1f2937', border: 'none', color: 'white'}}
                            itemStyle={{color: '#a78bfa'}}
                        />
                       <Area type="monotone" dataKey="score" stroke="#8b5cf6" fill="url(#colorEngage)" strokeWidth={3} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                 <span className="text-2xl font-bold text-gray-900 dark:text-white">High</span>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Top 10% activity this week</p>
              </div>
           </div>
        </div>

        {/* Center: Usage Behavior */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-8 shadow-glass">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MousePointer size={20} className="text-plasma-600" /> Feature Usage Heatmap
                 </h3>
                 <span className="text-xs text-gray-500 dark:text-gray-400">Last 7 Days</span>
              </div>

              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageData} layout="vertical" margin={{ left: 20 }}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="feature" type="category" width={80} tick={{fontSize: 12, fill: '#9ca3af'}} />
                       <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{borderRadius: '8px', background: '#1f2937', border: 'none', color: 'white'}} />
                       <Bar dataKey="clicks" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1000} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              {aiSuggestionVisible && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                     <Zap className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">AI Suggestion</h4>
                            <button onClick={() => setAiSuggestionVisible(false)} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"><X size={14}/></button>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed mt-1">
                           You spend 40% of your time in <strong>Monitoring</strong>. I've prepared a custom dashboard layout that puts live metrics front and center.
                        </p>
                        <div className="mt-3 flex gap-2">
                           <Button size="sm" className="bg-blue-600 text-white border-none h-8 text-xs hover:bg-blue-700 shadow-md" onClick={() => setAiSuggestionVisible(false)}>Apply Layout</Button>
                           <Button size="sm" variant="secondary" className="h-8 text-xs bg-white dark:bg-neutral-800 dark:text-white border dark:border-neutral-700" onClick={() => setAiSuggestionVisible(false)}>Dismiss</Button>
                        </div>
                     </div>
                  </div>
              )}
           </div>

           {/* Adaptive Controls */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-5 shadow-sm">
                 <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Layout size={18} /> Interface Density
                 </h4>
                 <div className="flex bg-gray-100 dark:bg-neutral-900 p-1 rounded-lg">
                    <button 
                       onClick={() => setDensity('comfortable')}
                       className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${density === 'comfortable' ? 'bg-white dark:bg-neutral-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                    >
                       Comfortable
                    </button>
                    <button 
                       onClick={() => setDensity('compact')}
                       className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${density === 'compact' ? 'bg-white dark:bg-neutral-800 shadow-sm text-plasma-600 dark:text-plasma-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                    >
                       Compact
                    </button>
                 </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Auto-adjusts based on screen size and data volume.
                 </p>
              </div>

              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-5 shadow-sm">
                 <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Palette size={18} /> Adaptive Theme
                 </h4>
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sync with OS</span>
                    <button 
                        onClick={() => setSyncOS(!syncOS)} 
                        className={`w-10 h-5 rounded-full relative transition-colors ${syncOS ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'}`}
                    >
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${syncOS ? 'left-6' : 'left-1'}`}></div>
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">High Contrast</span>
                    <button 
                        onClick={() => setHighContrast(!highContrast)} 
                        className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'}`}
                    >
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${highContrast ? 'left-6' : 'left-1'}`}></div>
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Feedback Loop */}
      {showFeedback && (
          <div className="fixed bottom-6 right-6 md:right-24 z-40 animate-in slide-in-from-bottom-4">
             <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-xl rounded-2xl p-4 w-72 md:w-80">
                {!feedbackSent ? (
                    <>
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                              <MessageSquare size={14} className="text-plasma-600"/> UX Feedback
                           </h4>
                           <button onClick={() => setShowFeedback(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"><X size={14}/></button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                           Is the new navigation layout helpful for your workflow?
                        </p>
                        <div className="flex gap-2 mb-3">
                           <button onClick={() => setFeedback('Yes')} className={`flex-1 py-1.5 border rounded text-xs font-medium transition-colors ${feedback === 'Yes' ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-gray-200 dark:border-neutral-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:text-gray-300'}`}>Yes</button>
                           <button onClick={() => setFeedback('No')} className={`flex-1 py-1.5 border rounded text-xs font-medium transition-colors ${feedback === 'No' ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'border-gray-200 dark:border-neutral-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:text-gray-300'}`}>No</button>
                        </div>
                        <div className="relative">
                            <input 
                               type="text" 
                               placeholder="Optional comment..."
                               value={feedback && feedback !== 'Yes' && feedback !== 'No' ? feedback : ''}
                               onChange={(e) => setFeedback(e.target.value)}
                               className="w-full text-xs p-2 pr-8 border border-gray-200 dark:border-neutral-700 rounded bg-gray-50 dark:bg-neutral-900 outline-none focus:bg-white dark:focus:bg-neutral-800 focus:border-plasma-300 transition-colors dark:text-white"
                            />
                            <button 
                                onClick={handleFeedbackSubmit}
                                className={`absolute right-1 top-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors ${feedback ? 'text-plasma-600' : 'text-gray-300 cursor-not-allowed'}`}
                                disabled={!feedback}
                            >
                                <Send size={12} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4 text-green-600 dark:text-green-400 animate-in fade-in zoom-in">
                        <CheckCircle2 size={32} className="mx-auto mb-2" />
                        <span className="font-bold text-sm">Thanks for your input!</span>
                    </div>
                )}
             </div>
          </div>
      )}

    </div>
  );
};
