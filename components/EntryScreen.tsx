
import React, { useState, useEffect } from 'react';
import { 
  Hexagon, Activity, Fingerprint, ScanFace, Lock, ShieldCheck, X
} from 'lucide-react';
import { useNavigate } from '../context/ThemeContext';

interface EntryScreenProps {
  onComplete: () => void;
}

const BootLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "Establishing secure uplink [TLS 1.3]...",
    "Verifying integrity signatures...",
    "Loading neural interaction mesh...",
    "Syncing Action Graph nodes...",
    "Hydrating spatial UI context...",
    "Decrypting user vault...",
    "System ready."
  ];

  useEffect(() => {
    let delay = 0;
    messages.forEach((msg, i) => {
      delay += Math.random() * 300 + 150;
      setTimeout(() => {
        setLogs(prev => [...prev.slice(-3), `> ${msg}`]);
      }, delay);
    });
  }, []);

  return (
    <div className="font-mono text-[10px] text-neon-mint/90 leading-relaxed pointer-events-none h-20 overflow-hidden flex flex-col justify-end">
      {logs.map((log, i) => (
        <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
          {log}
        </div>
      ))}
      <div className="flex items-center gap-1 mt-1">
        <span className="text-plasma-500">➜</span>
        <span className="animate-pulse bg-neon-mint w-2 h-4 block"></span>
      </div>
    </div>
  );
};

export const EntryScreen: React.FC<EntryScreenProps> = ({ onComplete }) => {
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'biometric'>('landing');
  const [authStep, setAuthStep] = useState(0); // 0: Idle, 1: Scanning, 2: Success
  const navigate = useNavigate();
  
  const handleAuth = () => {
    setViewState('auth');
    setAuthStep(1); // Start scanning
    
    // Simulate biometric scan sequence
    setTimeout(() => {
      setAuthStep(2); // Success
      setTimeout(() => {
        setViewState('biometric'); // Transition out
        // The zoom effect happens via CSS on the main container
        setTimeout(onComplete, 800); 
      }, 1200);
    }, 2500);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-graphite-950 text-white font-sans transition-colors duration-700">
      
      {/* Background Grid - Perspective shifted */}
      <div className="absolute inset-0 bg-spatial-grid opacity-20 pointer-events-none" style={{ transform: 'perspective(500px) rotateX(20deg) scale(1.5)' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-graphite-950/50 to-plasma-900/20 pointer-events-none"></div>

      {/* Cancel Button */}
      <button 
        onClick={handleCancel}
        className="absolute top-6 right-6 z-50 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="Cancel & Return Home"
      >
        <X size={24} />
      </button>

      {/* --- HUD --- */}
      <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
         <div className="flex justify-between items-start opacity-70">
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 text-xs font-mono text-plasma-400">
                  <Activity size={14} className="animate-pulse" />
                  <span>SECURE_GATEWAY_v4.2</span>
               </div>
               <div className="h-px w-24 bg-plasma-500/30"></div>
            </div>
            <div className="text-right text-[10px] font-mono tracking-widest text-plasma-500/60 flex flex-col items-end">
               <span>ENCRYPTED CONNECTION</span>
               <span>NODE: SG-1</span>
            </div>
         </div>

         <div className="flex justify-between items-end">
            <div className="w-80">
               <BootLog />
            </div>
            <div className="text-right opacity-30">
               <Hexagon size={32} className="text-plasma-500 animate-spin-slow" />
            </div>
         </div>
      </div>

      {/* --- Main Stage --- */}
      <div className={`relative z-20 flex flex-col items-center justify-center h-full w-full transition-all duration-1000 ease-in-out ${viewState === 'biometric' ? 'scale-[2.5] opacity-0 blur-md' : 'scale-100 opacity-100'}`}>
         
         <div className="relative">
            
            {/* The Monolith Card */}
            <div className="w-full max-w-sm bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-spatial relative overflow-hidden group">
               
               {/* Ambient Glow */}
               <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
               <div className="absolute -inset-1 bg-plasma-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full"></div>

               {/* Content Container */}
               <div className="relative z-10 flex flex-col items-center text-center">
                  
                  {/* Brand Mark */}
                  <div className="mb-10 relative">
                     <div className={`absolute inset-0 bg-plasma-500 blur-2xl rounded-full transition-opacity duration-1000 ${authStep === 1 ? 'opacity-50 animate-pulse' : authStep === 2 ? 'opacity-80 bg-neon-mint' : 'opacity-10'}`}></div>
                     
                     <div className="relative w-24 h-24 bg-gradient-to-b from-graphite-800 to-black rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl">
                        <Hexagon size={48} className={`transition-colors duration-500 ${authStep === 2 ? 'text-neon-mint fill-neon-mint/20' : 'text-plasma-500 fill-plasma-500/20'}`} />
                     </div>
                     
                     {/* Scanning Ring */}
                     {authStep === 1 && (
                       <div className="absolute -inset-6">
                          <svg className="w-full h-full animate-spin-slow text-plasma-400 opacity-60" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 8" />
                          </svg>
                          <svg className="absolute inset-0 w-full h-full animate-spin-slow text-plasma-300 opacity-40" viewBox="0 0 100 100" style={{animationDirection: 'reverse', animationDuration: '3s'}}>
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="10 20" />
                          </svg>
                       </div>
                     )}
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Autonix Console</h1>
                  <p className="text-sm text-gray-400 mb-10 font-medium">Identify to access infrastructure.</p>

                  {/* Interaction Area */}
                  {viewState === 'landing' && (
                     <button 
                        onClick={handleAuth}
                        className="group relative w-full h-14 bg-white text-black rounded-2xl font-bold text-sm tracking-wide overflow-hidden transition-all hover:scale-[1.02] shadow-neon"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-plasma-200 to-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           <Fingerprint size={20} /> INITIALIZE SESSION
                        </span>
                     </button>
                  )}

                  {viewState === 'auth' && (
                     <div className={`w-full h-14 bg-white/5 border rounded-2xl flex items-center justify-center gap-3 text-sm font-mono transition-all duration-300 ${authStep === 2 ? 'border-neon-mint/50 bg-neon-mint/10 text-neon-mint' : 'border-white/10 text-plasma-300'}`}>
                        {authStep === 1 ? (
                           <>
                              <ScanFace size={18} className="animate-pulse" />
                              <span className="animate-pulse">VERIFYING BIOMETRICS...</span>
                           </>
                        ) : (
                           <>
                              <ShieldCheck size={18} className="text-neon-mint" />
                              <span className="text-neon-mint tracking-widest font-bold">ACCESS GRANTED</span>
                           </>
                        )}
                     </div>
                  )}

               </div>
            </div>
            
            {/* Footer Status */}
            <div className="text-center mt-8 text-[10px] text-gray-600 font-mono tracking-widest uppercase opacity-60">
               Authorized Personnel Only • ID: 884-XJ
            </div>

         </div>
      </div>
    </div>
  );
};
