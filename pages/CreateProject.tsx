
import React, { useState } from 'react';
import { useNavigate } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { BLUEPRINTS } from '../constants';
import { Blueprint, BlueprintType } from '../types';
import { Check, ChevronRight, Server, Globe, ShieldCheck, Box, ArrowLeft, Loader2, Cpu } from 'lucide-react';

const steps = ['Select Blueprint', 'Configure', 'Review', 'Deploy'];

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    region: 'sg-1',
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleDeploy();
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
    // Simulate deployment delay
    setTimeout(() => {
      setIsDeploying(false);
      navigate('/console');
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-plasma-500/5 dark:bg-plasma-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-4xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Wizard Header */}
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 dark:bg-black/20 gap-4 md:gap-0">
           <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create New Capsule</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Deploy production-ready infrastructure.</p>
           </div>
           
           {/* Stepper */}
           <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                 <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                       index <= currentStep 
                          ? 'bg-plasma-600 text-white shadow-neon' 
                          : 'bg-gray-200 dark:bg-neutral-800 text-gray-500 dark:text-gray-500'
                    }`}>
                       {index < currentStep ? <Check size={14} /> : index + 1}
                    </div>
                    {/* Only show label on larger screens to save space */}
                    <span className={`ml-2 text-sm font-medium hidden sm:block ${
                       index <= currentStep 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-600'
                    }`}>
                       {step}
                    </span>
                    {index < steps.length - 1 && (
                       <div className={`w-4 md:w-8 h-0.5 mx-1 md:mx-2 transition-colors duration-300 ${index < currentStep ? 'bg-plasma-500' : 'bg-gray-200 dark:bg-neutral-800'}`} />
                    )}
                 </div>
              ))}
           </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           
           {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Choose a Blueprint</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BLUEPRINTS.map((bp) => (
                       <div 
                          key={bp.id} 
                          onClick={() => setSelectedBlueprint(bp)}
                          className={`
                             group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                             ${selectedBlueprint?.id === bp.id 
                                ? 'border-plasma-500 bg-plasma-50/50 dark:bg-plasma-900/20 shadow-lg scale-[1.02]' 
                                : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-plasma-300 dark:hover:border-plasma-500/50 hover:shadow-md'}
                          `}
                       >
                          <div className="flex items-start gap-4">
                             <div className={`p-3 rounded-xl transition-colors ${
                                selectedBlueprint?.id === bp.id 
                                   ? 'bg-plasma-100 dark:bg-plasma-900/50 text-plasma-600 dark:text-plasma-400' 
                                   : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 group-hover:text-plasma-500 dark:group-hover:text-plasma-400'
                             }`}>
                                <Box size={24} />
                             </div>
                             <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{bp.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{bp.description}</p>
                                <div className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-700 px-3 py-1.5 rounded-lg">
                                   <Cpu size={14} className="mr-2" /> {bp.recommendedSize}
                                </div>
                             </div>
                          </div>
                          
                          {selectedBlueprint?.id === bp.id && (
                             <div className="absolute top-4 right-4 w-6 h-6 bg-plasma-500 rounded-full flex items-center justify-center text-white">
                                <Check size={14} />
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {currentStep === 1 && (
              <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-plasma-100 dark:bg-plasma-900/30 text-plasma-600 dark:text-plasma-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <Server size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configure Capsule</h2>
                    <p className="text-gray-500 dark:text-gray-400">Set the identity and location for your new infrastructure.</p>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                       <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-plasma-500 focus:border-plasma-500 outline-none transition-all dark:text-white font-medium"
                          placeholder="e.g., My Awesome Shop"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          autoFocus
                       />
                    </div>
                    
                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Domain</label>
                       <div className="flex">
                          <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 text-sm font-mono">
                             https://
                          </span>
                          <input 
                             type="text" 
                             className="flex-1 px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-r-xl focus:ring-2 focus:ring-plasma-500 focus:border-plasma-500 outline-none transition-all dark:text-white font-mono text-sm"
                             placeholder="example.com"
                             value={formData.domain}
                             onChange={(e) => setFormData({...formData, domain: e.target.value})}
                          />
                       </div>
                       <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <ShieldCheck size={12} className="text-green-500"/> Auto-SSL & DNS management enabled
                       </p>
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Region</label>
                       <div className="grid grid-cols-2 gap-4">
                          {['sg-1', 'vn-1', 'jp-1', 'us-west'].map((region) => (
                             <button
                                key={region}
                                onClick={() => setFormData({...formData, region})}
                                className={`px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all ${
                                   formData.region === region 
                                      ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20 text-plasma-700 dark:text-plasma-400' 
                                      : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-600'
                                }`}
                             >
                                {region}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {currentStep === 2 && selectedBlueprint && (
              <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="bg-gradient-to-br from-indigo-600 to-plasma-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
                    <div className="relative z-10">
                       <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <Box size={20} /> Capsule Summary
                       </h3>
                       <div className="space-y-4 font-mono text-sm">
                          <div className="flex justify-between border-b border-white/20 pb-2">
                             <span className="text-indigo-200">Blueprint</span>
                             <span className="font-bold">{selectedBlueprint.name}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/20 pb-2">
                             <span className="text-indigo-200">Name</span>
                             <span className="font-bold">{formData.name}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/20 pb-2">
                             <span className="text-indigo-200">Domain</span>
                             <span className="font-bold">{formData.domain}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/20 pb-2">
                             <span className="text-indigo-200">Region</span>
                             <span className="font-bold uppercase">{formData.region}</span>
                          </div>
                          <div className="flex justify-between pt-2 text-lg">
                             <span className="text-indigo-200">Est. Cost</span>
                             <span className="font-bold">$20.00 <span className="text-sm font-normal">/ mo</span></span>
                          </div>
                       </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 flex items-center gap-3">
                       <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                          <ShieldCheck size={20} />
                       </div>
                       <div>
                          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Security</div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">Auto-SSL</div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 flex items-center gap-3">
                       <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                          <Globe size={20} />
                       </div>
                       <div>
                          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Network</div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">Global CDN</div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {currentStep === 3 && (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                 {isDeploying ? (
                    <div className="space-y-8">
                       <div className="relative">
                          <div className="w-24 h-24 border-4 border-plasma-200 dark:border-neutral-800 border-t-plasma-600 rounded-full animate-spin mx-auto"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Server size={32} className="text-plasma-600 animate-pulse" />
                          </div>
                       </div>
                       <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Provisioning Infrastructure...</h2>
                          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                             Autonix AI is configuring your VPS, initializing the container runtime, and issuing SSL certificates.
                          </p>
                       </div>
                       <div className="w-64 mx-auto bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-plasma-600 h-full w-2/3 rounded-full animate-[loading_2s_ease-in-out_infinite]" />
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                          <Check size={40} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Deployment Successful!</h2>
                          <p className="text-gray-500 dark:text-gray-400 mt-2">
                             Your capsule <span className="font-mono text-gray-900 dark:text-white font-bold">{formData.name}</span> is now live.
                          </p>
                       </div>
                       <Button size="lg" className="shadow-xl shadow-plasma-500/20" onClick={() => navigate('/console')}>
                          Enter Capsule
                       </Button>
                    </div>
                 )}
              </div>
           )}
        </div>

        {/* Wizard Footer */}
        {currentStep < 3 && (
           <div className="p-6 border-t border-gray-100 dark:border-white/5 flex justify-between bg-white dark:bg-neutral-900">
              <Button variant="ghost" onClick={handleBack} className="text-gray-500 dark:text-gray-400">
                 {currentStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              <Button 
                 onClick={handleNext} 
                 disabled={
                    (currentStep === 0 && !selectedBlueprint) ||
                    (currentStep === 1 && (!formData.name || !formData.domain))
                 }
                 className="px-8 shadow-lg shadow-plasma-500/20"
              >
                 {currentStep === 2 ? 'Deploy Capsule' : 'Continue'}
                 {currentStep < 2 && <ChevronRight size={18} className="ml-2" />}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};
