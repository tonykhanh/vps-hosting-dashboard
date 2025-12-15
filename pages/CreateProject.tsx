
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { Button } from '../components/Button';
import { BLUEPRINTS, LOCATIONS, REGIONS } from '../constants';
import { Blueprint, Project, ProjectStatus } from '../types';
import { 
  Check, ChevronRight, Server, Globe, ShieldCheck, Box, 
  ArrowLeft, Loader2, Cpu, Sparkles, Terminal, MapPin, 
  Database, Zap, Code, Layers
} from 'lucide-react';

const steps = [
  { id: 'blueprint', label: 'Blueprint' },
  { id: 'config', label: 'Configuration' },
  { id: 'review', label: 'Pre-flight' },
  { id: 'deploy', label: 'Materialize' }
];

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProject } = useProjects();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    region: 'sg',
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  
  // Location Selection State
  const [activeRegionTab, setActiveRegionTab] = useState('All Locations');

  // Derived state for success view
  const isSuccess = currentStep === 3 && !isDeploying;

  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(loc => {
      return activeRegionTab === 'All Locations' || loc.region === activeRegionTab;
    });
  }, [activeRegionTab]);

  // Hydrate from AI Intent
  useEffect(() => {
    // @ts-ignore
    const aiConfig = location.state?.aiConfig;
    
    if (aiConfig) {
      const matchedBlueprint = BLUEPRINTS.find(bp => bp.id === aiConfig.blueprintId);
      if (matchedBlueprint) {
        setSelectedBlueprint(matchedBlueprint);
        // Map simplified AI region or use default if invalid
        const validRegion = LOCATIONS.find(l => l.id === aiConfig.region) ? aiConfig.region : 'sg';
        
        setFormData({
          name: aiConfig.name || '',
          domain: aiConfig.domain || '',
          region: validRegion,
        });
        setAiInsight(aiConfig.reasoning);
        setCurrentStep(1);
      }
    }
  }, [location.state]);

  const handleNext = () => {
    if (currentStep === 2) {
      setCurrentStep(3);
      handleDeploy();
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/console');
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeployLogs(['> Initializing control plane handshake...']);

    // Simulate boot sequence
    const bootSequence = [
      "> Verifying blueprint integrity hash...",
      "> Allocating isolated compute container...",
      `> Region lock: ${formData.region.toUpperCase()} confirmed.`,
      "> Mounting high-speed NVMe volume...",
      "> Injecting SSH keys and environment context...",
      "> Configuring network mesh (VPC)...",
      "> Requesting SSL certificate from Let's Encrypt...",
      "> Starting application runtime...",
      "> HEALTH_CHECK: OK.",
      "> SYSTEM_READY."
    ];

    let delay = 0;
    bootSequence.forEach((log, index) => {
      delay += Math.random() * 400 + 300;
      setTimeout(() => {
        setDeployLogs(prev => [...prev, log]);
        
        // Finalize
        if (index === bootSequence.length - 1) {
          if (selectedBlueprint) {
            const newProject: Project = {
              id: `p-${Date.now()}`,
              name: formData.name,
              domain: formData.domain,
              blueprint: selectedBlueprint.id,
              status: ProjectStatus.RUNNING,
              region: formData.region,
              ip: '104.22.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
              createdAt: new Date().toISOString(),
              healthScore: 100,
              metrics: { cpu: [], memory: [], network: [] }
            };
            addProject(newProject);
            setIsDeploying(false);
          }
        }
      }, delay);
    });
  };

  const getRegionName = (id: string) => {
    const loc = LOCATIONS.find(l => l.id === id);
    return loc ? `${loc.name}, ${loc.region}` : id;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative p-4 lg:p-8">
      {/* Dynamic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-plasma-500/5 dark:bg-plasma-500/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />

      <div className={`
        w-full max-w-5xl h-[85vh] bg-white/80 dark:bg-[#080808]/80 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden relative transition-all duration-500
        ${isSuccess ? 'border-0' : ''}
      `}>
        
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5">
           <div 
             className="h-full bg-gradient-to-r from-plasma-600 to-indigo-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(14,165,233,0.5)]"
             style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
           />
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-end z-10">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                    Step {currentStep + 1} / {steps.length}
                 </span>
                 <span className="text-gray-300 dark:text-gray-600">|</span>
                 <span className="text-sm font-bold text-plasma-600 dark:text-plasma-400 uppercase tracking-widest">{steps[currentStep].label}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                 {currentStep === 0 && "Select Neural Blueprint"}
                 {currentStep === 1 && "Configure Matrix"}
                 {currentStep === 2 && "Pre-flight Check"}
                 {currentStep === 3 && "Materializing Capsule"}
              </h1>
           </div>
           
           {/* Step Indicators */}
           <div className="hidden md:flex gap-1">
              {steps.map((s, i) => (
                 <div 
                   key={s.id} 
                   className={`h-1 w-8 rounded-full transition-all duration-300 ${i <= currentStep ? 'bg-plasma-600' : 'bg-gray-200 dark:bg-white/10'}`}
                 />
              ))}
           </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-4 relative">
           
           {/* STEP 0: BLUEPRINTS */}
           {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {BLUEPRINTS.map((bp) => (
                    <div 
                       key={bp.id} 
                       onClick={() => setSelectedBlueprint(bp)}
                       className={`
                          group relative p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 overflow-hidden
                          ${selectedBlueprint?.id === bp.id 
                             ? 'border-plasma-500 bg-plasma-50/50 dark:bg-plasma-900/20 shadow-xl scale-[1.01]' 
                             : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-plasma-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10'}
                       `}
                    >
                       <div className="flex items-start gap-5 relative z-10">
                          <div className={`
                             p-4 rounded-2xl transition-colors duration-300
                             ${selectedBlueprint?.id === bp.id 
                                ? 'bg-plasma-500 text-white shadow-lg shadow-plasma-500/30' 
                                : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-white group-hover:text-plasma-600'}
                          `}>
                             {bp.id === 'WORDPRESS' && <Box size={28} />}
                             {bp.id === 'NODEJS' && <Code size={28} />}
                             {bp.id === 'LARAVEL' && <Layers size={28} />}
                             {bp.id === 'STATIC' && <Globe size={28} />}
                             {bp.id === 'DOCKER' && <Server size={28} />}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-plasma-600 transition-colors">{bp.name}</h3>
                                {selectedBlueprint?.id === bp.id && <div className="bg-plasma-500 text-white rounded-full p-1"><Check size={14} /></div>}
                             </div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{bp.description}</p>
                             
                             <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-4 text-xs font-mono text-gray-400 dark:text-gray-500">
                                <span className="flex items-center gap-1"><Cpu size={12}/> {bp.recommendedSize.split('/')[0]}</span>
                                <span className="flex items-center gap-1"><Zap size={12}/> {bp.recommendedSize.split('/')[1]}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {/* STEP 1: CONFIGURATION */}
           {currentStep === 1 && (
              <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
                 
                 {/* AI Suggestion Box */}
                 {aiInsight && (
                    <div className="relative overflow-hidden rounded-2xl bg-neutral-900 dark:bg-black border border-plasma-900/50 p-1 shadow-lg">
                       <div className="absolute inset-0 bg-gradient-to-r from-plasma-900/20 to-indigo-900/20 animate-pulse-slow"></div>
                       <div className="relative bg-neutral-900/80 dark:bg-black/80 backdrop-blur-sm rounded-xl p-4 flex gap-4 items-start">
                          <div className="p-2 bg-plasma-500/20 rounded-lg text-plasma-400 shrink-0">
                             <Sparkles size={20} className="animate-pulse" />
                          </div>
                          <div>
                             <h4 className="text-xs font-bold text-plasma-400 uppercase tracking-widest mb-1">AI Recommendation</h4>
                             <p className="text-sm text-gray-300 leading-relaxed">{aiInsight}</p>
                          </div>
                       </div>
                    </div>
                 )}

                 <div className="space-y-8">
                    {/* Name Input */}
                    <div className="group">
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-plasma-600 transition-colors">Identity Name</label>
                       <input 
                          type="text" 
                          className="w-full bg-transparent border-b-2 border-gray-200 dark:border-white/10 px-4 py-4 text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700 outline-none focus:border-plasma-500 transition-all"
                          placeholder="e.g. Hyperion Core"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          autoFocus
                       />
                    </div>

                    {/* Domain Input */}
                    <div className="group">
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-plasma-600 transition-colors">Primary Endpoint</label>
                       <div className="flex items-center border-b-2 border-gray-200 dark:border-white/10 focus-within:border-plasma-500 transition-all">
                          <span className="text-xl font-mono text-gray-400 px-4">https://</span>
                          <input 
                             type="text" 
                             className="flex-1 bg-transparent px-0 py-4 text-xl font-mono text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700 outline-none"
                             placeholder="app.example.com"
                             value={formData.domain}
                             onChange={(e) => setFormData({...formData, domain: e.target.value})}
                          />
                       </div>
                       <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium opacity-0 group-focus-within:opacity-100 transition-opacity">
                          <ShieldCheck size={12} /> Auto-SSL & Load Balancing enabled
                       </div>
                    </div>

                    {/* Physical Location Selection */}
                    <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Physical Location</label>
                       
                       <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                          {/* Region Tabs */}
                          <div className="flex border-b border-gray-100 dark:border-white/10 overflow-x-auto no-scrollbar">
                             {['All Locations', ...REGIONS].map(region => (
                                <button
                                   key={region}
                                   onClick={() => setActiveRegionTab(region)}
                                   className={`
                                      px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2
                                      ${activeRegionTab === region 
                                         ? 'border-plasma-500 text-plasma-600 dark:text-plasma-400 bg-plasma-50/50 dark:bg-plasma-500/10' 
                                         : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                                   `}
                                >
                                   {region}
                                </button>
                             ))}
                          </div>
                          
                          {/* Locations Grid */}
                          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-white/5">
                             {filteredLocations.map(loc => {
                                const isSelected = formData.region === loc.id;
                                return (
                                <div 
                                   key={loc.id}
                                   onClick={() => setFormData({...formData, region: loc.id})}
                                   className={`
                                      p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 relative overflow-hidden group
                                      ${isSelected 
                                         ? 'border-plasma-500 bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-plasma-500/20 scale-[1.02]' 
                                         : 'border-gray-200 dark:border-white/5 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-white/20'}
                                   `}
                                >
                                   <span className="text-4xl filter drop-shadow-sm">{loc.flag}</span>
                                   <div className="overflow-hidden relative z-10">
                                      <div className={`font-bold text-lg truncate transition-colors ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{loc.name}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-500 font-mono uppercase truncate tracking-wider">{loc.id}</div>
                                   </div>
                                   {isSelected && (
                                      <div className="absolute top-0 right-0 p-2 bg-plasma-500 text-white rounded-bl-xl shadow-sm">
                                         <Check size={16} strokeWidth={3} />
                                      </div>
                                   )}
                                </div>
                             )})}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* STEP 2: REVIEW */}
           {currentStep === 2 && selectedBlueprint && (
              <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                 
                 <div className="relative bg-white dark:bg-[#111] rounded-[2rem] p-1 shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    {/* Holographic Edge */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-plasma-500 via-purple-500 to-plasma-500"></div>
                    
                    <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-[1.8rem] p-8 space-y-8">
                       
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-plasma-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-plasma-500/30">
                             <Box size={40} />
                          </div>
                          <div>
                             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{formData.name}</h2>
                             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                                <Globe size={14} /> {formData.domain}
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5">
                             <span className="text-xs text-gray-400 uppercase font-bold">Blueprint Type</span>
                             <div className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-2">{selectedBlueprint.name}</div>
                          </div>
                          <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5">
                             <span className="text-xs text-gray-400 uppercase font-bold">Target Region</span>
                             <div className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-2 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> {getRegionName(formData.region)}
                             </div>
                          </div>
                       </div>

                       <div className="border-t border-dashed border-gray-300 dark:border-white/10 pt-8">
                          <div className="flex justify-between items-end">
                             <div>
                                <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Resources</span>
                                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">{selectedBlueprint.recommendedSize}</div>
                             </div>
                             <div className="text-right">
                                <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Cost</span>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">$20.00</div>
                             </div>
                          </div>
                       </div>

                    </div>
                 </div>

                 <p className="text-center text-sm text-gray-500 mt-8">
                    Ready to materialize? This will provision resources immediately.
                 </p>
              </div>
           )}

           {/* STEP 3: DEPLOYMENT */}
           {currentStep === 3 && (
              <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
                 {isDeploying ? (
                    <div className="w-full max-w-2xl bg-black rounded-xl border border-gray-800 p-6 font-mono text-xs md:text-sm shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-50">
                          <Loader2 size={20} className="text-plasma-500 animate-spin" />
                       </div>
                       <div className="space-y-2 h-[300px] overflow-y-auto custom-scrollbar flex flex-col justify-end">
                          {deployLogs.map((log, i) => (
                             <div key={i} className="text-green-400/90 animate-in slide-in-from-left-2 fade-in duration-300">
                                {log}
                             </div>
                          ))}
                          <div className="flex items-center gap-1 text-green-500">
                             <span>_</span>
                             <span className="w-2 h-4 bg-green-500 animate-pulse"></span>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="text-center space-y-8 border-none">
                       <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                          <Check size={48} className="text-white" strokeWidth={3} />
                       </div>
                       <div>
                          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Capsule Active</h2>
                          <p className="text-gray-500 dark:text-gray-400">
                             <span className="font-mono text-plasma-600 dark:text-plasma-400">{formData.name}</span> is now online and reachable.
                          </p>
                       </div>
                       <div className="flex gap-4 justify-center">
                          <Button size="lg" className="shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 border-none" onClick={() => navigate('/console/projects')}>
                             Open Console
                          </Button>
                          <Button size="lg" variant="secondary" onClick={() => window.open(`https://${formData.domain}`, '_blank')}>
                             Visit Domain <ArrowLeft className="rotate-180 ml-2" size={18}/>
                          </Button>
                       </div>
                    </div>
                 )}
              </div>
           )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 3 && (
           <div className="p-8 border-t border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-black/20 backdrop-blur-md">
              <Button variant="ghost" onClick={handleBack} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                 {currentStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              
              <Button 
                 onClick={handleNext} 
                 disabled={
                    (currentStep === 0 && !selectedBlueprint) ||
                    (currentStep === 1 && (!formData.name || !formData.domain))
                 }
                 className="px-10 py-4 text-base shadow-xl shadow-plasma-500/20 group"
              >
                 {currentStep === 2 ? 'Initialize' : 'Continue'}
                 <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};
