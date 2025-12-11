
import React, { useState, useEffect } from 'react';
import { 
  Hexagon, Activity, Lock, ArrowRight, ShieldCheck, X, User, Key, Server
} from 'lucide-react';
import { useNavigate } from '../context/ThemeContext';

interface EntryScreenProps {
  onComplete: () => void;
}

const BootLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "Initializing secure handshake...",
    "Loading neural interaction mesh...",
    "Hydrating spatial UI context...",
    "Verify integrity signatures...",
    "System ready."
  ];

  useEffect(() => {
    let delay = 0;
    messages.forEach((msg, i) => {
      delay += Math.random() * 200 + 100;
      setTimeout(() => {
        setLogs(prev => [...prev.slice(-2), `> ${msg}`]);
      }, delay);
    });
  }, []);

  return (
    <div className="font-mono text-[10px] text-neon-mint/60 leading-relaxed pointer-events-none absolute bottom-6 left-6 z-20">
      {logs.map((log, i) => (
        <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
          {log}
        </div>
      ))}
      <div className="flex items-center gap-1 mt-1 opacity-50">
        <span className="text-plasma-500">➜</span>
        <span className="animate-pulse bg-neon-mint w-1.5 h-3 block"></span>
      </div>
    </div>
  );
};

export const EntryScreen: React.FC<EntryScreenProps> = ({ onComplete }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Pre-filled credentials
  const [email] = useState("admin@autonix.io");
  const [password] = useState("password123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    // Simulate auth network request
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onComplete(); 
      }, 800);
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-white font-sans flex items-center justify-center">
      
      {/* Global Atmospheric Background (Matching Landing Page) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[#02040a]"></div>
         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-plasma-900/20 rounded-full blur-[120px] opacity-60"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
         <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"
            style={{ transform: 'perspective(1000px) rotateX(20deg)' }}
         ></div>
      </div>

      {/* Cancel Button */}
      <button 
        onClick={handleCancel}
        className="absolute top-6 right-6 z-50 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="Cancel & Return Home"
      >
        <X size={24} />
      </button>

      {/* Boot Logs */}
      <BootLog />

      {/* --- Main Stage --- */}
      <div className={`relative z-20 w-full max-w-md px-6 transition-all duration-700 ease-in-out ${success ? 'scale-110 opacity-0 blur-lg' : 'scale-100 opacity-100'}`}>
            
        {/* The Monolith Card */}
        <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            
            {/* Top Glow Line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-plasma-500/50 to-transparent"></div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 mb-6 shadow-lg shadow-plasma-500/10 relative group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-plasma-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                  <Hexagon size={32} className="text-plasma-500 fill-plasma-500/20 relative z-10" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
              <p className="text-sm text-gray-400">Authenticate to access the neural mesh.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Identity</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500 group-focus-within:text-plasma-400 transition-colors" />
                    </div>
                    <input 
                        type="email" 
                        value={email}
                        readOnly
                        className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-plasma-500 focus:border-plasma-500 focus:bg-white/5 transition-all outline-none cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Lock size={12} className="text-gray-600" />
                    </div>
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Credentials</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-500 group-focus-within:text-plasma-400 transition-colors" />
                    </div>
                    <input 
                        type="password" 
                        value={password}
                        readOnly
                        className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-plasma-500 focus:border-plasma-500 focus:bg-white/5 transition-all outline-none cursor-not-allowed font-mono tracking-widest"
                    />
                  </div>
              </div>

              <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className={`
                    group relative w-full py-4 rounded-xl font-bold text-sm tracking-wide overflow-hidden transition-all 
                    ${isAuthenticating ? 'bg-plasma-900/50 cursor-wait' : 'bg-white text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer'}
                  `}
              >
                  {/* Button Background Animation */}
                  {!isAuthenticating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  )}
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isAuthenticating ? (
                        <>
                          <Activity size={18} className="animate-spin" /> ESTABLISHING UPLINK...
                        </>
                    ) : (
                        <>
                          CONNECT TO CORE <ArrowRight size={18} />
                        </>
                    )}
                  </span>
              </button>
            </form>

            {/* Footer Status */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Server size={10} /> Node: SG-1 (Active)</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={10} /> TLS 1.3 Secured</span>
            </div>

        </div>
      </div>
    </div>
  );
};
