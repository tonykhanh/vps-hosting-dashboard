
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Hexagon, Terminal, Cpu, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { useLocation } from '../context/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const AICopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: 'Autonix Core v3.0 online. Waiting for intent...',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Inject context about current location
      const contextPrompt = `[Current Context: ${location.pathname}] User Request: ${input}`;
      const responseText = await sendMessageToGemini(contextPrompt);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Connection to Intelligence Mesh failed.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Minimized State (Orb) ---
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group animate-in slide-in-from-bottom-10 duration-700"
      >
        <div className="absolute inset-0 bg-plasma-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 group-hover:blur-xl transition-all duration-500 animate-pulse-slow"></div>
        <div className="relative w-14 h-14 bg-neutral-900/90 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <Sparkles className="text-plasma-400 group-hover:text-white transition-colors" size={24} />
        </div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 border-2 border-neutral-900 rounded-full"></div>
      </button>
    );
  }

  // --- Expanded State (Interface) ---
  return (
    <div className={`fixed z-50 transition-all duration-500 ease-out-expo ${
      isExpanded 
        ? 'inset-6 rounded-[2rem]' 
        : 'bottom-6 right-6 w-[400px] h-[600px] rounded-3xl'
    } bg-neutral-900/80 backdrop-blur-2xl border border-white/10 shadow-spatial flex flex-col overflow-hidden`}>
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/5 shrink-0 drag-handle cursor-move">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-plasma-500/20 rounded-lg text-plasma-400">
            <Hexagon size={18} />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wide">Autonix AI</div>
            <div className="text-[10px] text-plasma-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              ONLINE
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <button onClick={() => setMessages([{ id: 'reset', role: 'model', text: 'Context reset.', timestamp: new Date()}])} className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-colors" title="Reset Context">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-colors">
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Holographic Grid Background */}
      <div className="absolute inset-0 pointer-events-none bg-spatial-grid opacity-10 z-0"></div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`
              py-3 px-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md border
              ${msg.role === 'user' 
                ? 'bg-plasma-600/90 text-white border-plasma-500/50 rounded-br-none shadow-neon' 
                : 'bg-white/5 text-gray-200 border-white/10 rounded-bl-none'}
            `}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-plasma-400 uppercase tracking-wider opacity-70">
                  <Terminal size={10} /> Action Graph Output
                </div>
              )}
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 px-1">
              {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%] animate-pulse">
             <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 flex gap-2 items-center">
                <Cpu size={16} className="text-plasma-500 animate-spin" />
                <span className="text-xs text-plasma-400 font-mono">Calculating vectors...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 backdrop-blur-xl border-t border-white/5 shrink-0 relative z-20">
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-plasma-500/50 focus-within:bg-white/10 transition-all duration-300">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your intent..."
            className="w-full bg-transparent border-none text-white text-sm px-4 py-4 focus:ring-0 placeholder-gray-500"
            autoFocus
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 mr-2 rounded-lg transition-all ${input.trim() ? 'bg-plasma-600 text-white shadow-neon' : 'bg-transparent text-gray-600 cursor-not-allowed'}`}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-gray-600 font-mono">AI Interaction Mesh v4.0</span>
        </div>
      </div>
    </div>
  );
};
