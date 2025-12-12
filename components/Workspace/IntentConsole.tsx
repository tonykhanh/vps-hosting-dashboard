
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Command, Loader2, Box, Server, Activity, Globe } from 'lucide-react';

interface IntentConsoleProps {
  intent: string;
  setIntent: (value: string) => void;
  isMorphing: boolean;
  onTrigger: () => void;
}

export const IntentConsole: React.FC<IntentConsoleProps> = ({ 
  intent, 
  setIntent, 
  isMorphing, 
  onTrigger 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (intent.length > 5) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [intent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && intent) {
      onTrigger();
    }
  };

  return (
    <div className={`flex flex-col items-center transition-all duration-700 ease-elastic z-30 ${intent || isFocused ? 'mt-8 md:mt-16' : 'mt-[12vh] md:mt-[18vh]'} ${isMorphing ? 'scale-110 opacity-0 translate-y-10 blur-sm' : ''}`}>
        
      {/* Greeting / Prompt */}
      <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-8 text-center tracking-tight transition-all duration-500 ${intent || isFocused ? 'opacity-40 scale-90 translate-y-[-20px]' : 'opacity-100'}`}>
        What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-plasma-500 via-indigo-400 to-plasma-500 bg-[length:200%_auto] animate-shimmer text-glow">manifest</span>?
      </h1>

      {/* The Intent Bar */}
      <div className={`relative w-full max-w-3xl transition-all duration-500 group ${isFocused ? 'scale-105' : 'scale-100'}`}>
        {/* Holographic Glow */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-plasma-500 via-neon-purple to-plasma-500 rounded-2xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-500 ${isFocused ? 'opacity-70' : ''}`}></div>
        
        <div className="relative bg-white/80 dark:bg-black/70 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-spatial rounded-2xl flex items-center p-2 transition-all group-hover:border-plasma-500/30">
          <div className="pl-4 text-plasma-500">
            {intent ? <Sparkles size={24} className="animate-pulse" /> : <Command size={24} className="opacity-50" />}
          </div>
          <input
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Describe infrastructure intent (e.g. 'Production Cluster in SG with Redis')..."
            className="w-full bg-transparent border-none outline-none focus:outline-none text-xl md:text-2xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600/70 focus:ring-0 px-4 py-4 leading-relaxed font-light font-sans tracking-wide"
            disabled={isMorphing}
          />
          <button 
            onClick={onTrigger}
            className={`p-4 rounded-xl transition-all duration-300 ${intent ? 'bg-plasma-600 text-white shadow-neon scale-100' : 'bg-transparent text-gray-400 scale-90 opacity-0 pointer-events-none'}`}
          >
            {isMorphing ? <Loader2 size={24} className="animate-spin"/> : <ArrowRight size={24} />}
          </button>
        </div>

        {/* AI Blueprint Preview (The "Graph" Preview) */}
        {showPreview && !isMorphing && (
          <div className="absolute top-full left-0 w-full mt-4 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Box size={12} /> Detected Intent Blueprint
                </span>
                <span className="text-xs text-plasma-500 font-mono bg-plasma-500/10 px-2 py-1 rounded">CONFIDENCE: 98%</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                    <Server size={16} className="text-neon-purple"/>
                    <span>3x High-Freq Nodes</span>
                </div>
                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                    <Activity size={16} className="text-neon-mint"/>
                    <span>Auto-Scaling</span>
                </div>
                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                    <Globe size={16} className="text-plasma-500"/>
                    <span>Global CDN</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs text-gray-400">Press <strong className="text-white">Enter</strong> to materialize this graph.</span>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
