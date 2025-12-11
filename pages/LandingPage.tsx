
import React, { useState, useEffect } from 'react';
import { Link } from '../context/ThemeContext';
import {
   ArrowRight, Sparkles, Server, Globe, Box, Hexagon,
   Activity, Play, CheckCircle2, ShieldCheck,
   Zap, GitBranch, MessageSquare, Check, BrainCircuit,
   Lock, RefreshCw, Database, ChevronDown, Command, Layers,
   CreditCard, Layout
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CircuitBackground } from '../components/CircuitBackground';

// --- Components ---

const SpatialCard = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
   return (
      <div className={`relative group p-8 rounded-[2rem] bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 overflow-hidden shadow-glass hover:shadow-spatial-card ${className}`}>
         <div className="absolute inset-0 bg-gradient-to-br from-plasma-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
         <div className="relative z-10">{children}</div>
      </div>
   );
};

const Typewriter: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
   const [displayed, setDisplayed] = useState('');
   useEffect(() => {
      let timeoutId: number;
      let charIndex = 0;

      const type = () => {
         if (charIndex < text.length) {
            setDisplayed(prev => prev + text.charAt(charIndex));
            charIndex++;
            timeoutId = window.setTimeout(type, 30);
         }
      };

      const startTimeout = window.setTimeout(type, delay);

      return () => {
         window.clearTimeout(startTimeout);
         window.clearTimeout(timeoutId);
      };
   }, [text, delay]);
   return <span className="font-mono text-neon-mint">{displayed}</span>;
};

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="border-b border-white/10 last:border-0">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full py-6 flex items-center justify-between text-left group"
         >
            <span className="font-medium text-lg text-gray-200 group-hover:text-white transition-colors">{question}</span>
            <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
         </button>
         <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-400 leading-relaxed">{answer}</p>
         </div>
      </div>
   );
};

const PricingCard: React.FC<{
   tier: string;
   price: string;
   features: string[];
   isPopular?: boolean;
}> = ({ tier, price, features, isPopular }) => {
   return (
      <div className={`
      relative p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500
      ${isPopular
            ? 'bg-white/10 border-plasma-500/50 shadow-[0_0_40px_-10px_rgba(14,165,233,0.3)] scale-105 z-10'
            : 'bg-white/5 border-white/10 hover:border-white/20'}
    `}>
         {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-plasma-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
               MOST POPULAR
            </div>
         )}
         <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
         <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">{price}</span>
            {price !== 'Free' && <span className="text-gray-400 text-sm">/mo</span>}
         </div>
         <ul className="space-y-4 mb-8">
            {features.map((feature, i) => (
               <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check size={16} className={isPopular ? "text-plasma-400" : "text-gray-500"} />
                  {feature}
               </li>
            ))}
         </ul>
         <Link
            to="/entry"
            className={`
          w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
          ${isPopular
                  ? 'bg-plasma-500 hover:bg-plasma-400 text-white shadow-neon'
                  : 'bg-white/10 hover:bg-white/20 text-white'}
        `}
         >
            Choose {tier} <ArrowRight size={16} />
         </Link>
      </div>
   );
};

export const LandingPage: React.FC = () => {
   return (
      <div className="min-h-screen text-white font-sans selection:bg-plasma-500/30 overflow-x-hidden">
         <Navbar />

         {/* Background Ambient */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            {/* New Circuit Background Effect */}
            <CircuitBackground opacity={0.3} />

            <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-plasma-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

            {/* 3D Perspective Grid */}
            <div className="absolute inset-0 bg-spatial-grid opacity-10" style={{ transform: 'perspective(1000px) rotateX(10deg)' }}></div>
         </div>

         {/* 1. HERO SECTION: Intent Surface Zero */}
         <section className="relative z-10 pt-48 pb-32 px-6" id="hero">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">

               <div className="lg:col-span-7 space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-up hover:border-plasma-500/50 transition-colors cursor-default">
                     <span className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse"></span>
                     <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Post-Dashboard Era // V3.0</span>
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                     Deploy & Operate <br />
                     Infrastructure via <span className="text-transparent bg-clip-text bg-gradient-to-r from-plasma-400 via-white to-plasma-200 text-glow">Intent.</span>
                  </h1>

                  <p className="text-xl text-gray-400 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                     Forget complex dashboards. Just describe your intent, and Autonix autonomously constructs and operates your entire Cloud infrastructure using its Action Graph Engine.
                  </p>

                  {/* Core Pillars */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                     <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-plasma-500" /> No Manual Config</span>
                     <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-plasma-500" /> 100% Automated</span>
                     <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-plasma-500" /> Autonomous Ops</span>
                  </div>

                  <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                     <Link
                        to="/entry"
                        className="group relative px-8 py-4 bg-white text-black rounded-xl text-lg font-bold overflow-hidden shadow-neon transition-transform hover:scale-105 inline-flex items-center gap-2"
                     >
                        <div className="absolute inset-0 bg-plasma-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10 flex items-center gap-2">
                           Initialize First Capsule <ArrowRight size={20} />
                        </span>
                     </Link>
                     <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-lg font-bold transition-all backdrop-blur-md flex items-center gap-2">
                        <Play size={20} /> Watch Demo
                     </button>
                  </div>
               </div>

               {/* Holographic Intent Console */}
               <div className="lg:col-span-5 perspective-1000 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-spatial transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700 group overflow-hidden">
                     <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-plasma-500 via-neon-mint to-plasma-500 opacity-50"></div>
                     <div className="absolute -inset-10 bg-plasma-500/10 blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>

                     <div className="p-4 border-b border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">INTENT_ZERO_SURFACE</span>
                     </div>

                     <div className="p-6 h-[400px] font-mono text-sm flex flex-col gap-4 relative z-10">
                        <div className="flex gap-3">
                           <span className="text-plasma-400">&gt;</span>
                           <span className="text-white">describe intent</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border-l-2 border-plasma-500 text-gray-300 italic leading-relaxed">
                           "Create an e-commerce site for Client X, shop.com domain, optimized for high traffic, with hourly auto-backups and SSL security."
                        </div>

                        <div className="space-y-2 pl-4 border-l border-white/10 text-xs text-gray-400">
                           <div className="flex items-center justify-between">
                              <span>Compiling Context...</span>
                              <span className="text-neon-mint">100%</span>
                           </div>
                           <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-neon-mint w-full animate-boot-load"></div>
                           </div>
                           <div className="pt-2 space-y-1">
                              <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-neon-mint" /> Blueprint: <span className="text-white">E-Commerce Scale</span></div>
                              <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-neon-mint" /> Infra: <span className="text-white">3x Cluster Nodes + Redis</span></div>
                              <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-neon-mint" /> Policy: <span className="text-white">Auto-Scaling & Hourly Backup</span></div>
                           </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5 text-gray-500 text-xs">
                           <Typewriter text="Action Graph ready. Press Enter to execute." delay={2000} />
                           <span className="animate-pulse ml-1">_</span>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </section>

         {/* 2. PROBLEM -> NEW PARADIGM */}
         <section className="py-24 px-6 border-t border-white/5 relative z-10 bg-white/[0.02]" id="paradigm">
            <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Exhausted by Legacy Dashboards?</h2>
               <p className="text-lg text-gray-400 mb-12">
                  Hundreds of forms, checkboxes, and endless error logs. You want to build products, but you're stuck configuring servers.
                  <br /><br />
                  <span className="text-white font-bold">Welcome to the Post-Dashboard Era.</span>
               </p>
            </div>
         </section>

         {/* 3. HOW IT WORKS (4 LAYERS) */}
         <section className="py-32 px-6 relative z-10" id="engine">
            <div className="max-w-7xl mx-auto">
               <div className="mb-20">
                  <h2 className="text-4xl font-bold mb-6 tracking-tight">
                     <span className="text-plasma-500">4-Layer Autonomous</span> Architecture.
                  </h2>
                  <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                     Autonix is not just a management tool. It is an intelligent operating system that understands intent and automatically translates it into physical infrastructure.
                  </p>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SpatialCard className="h-full">
                     <div className="w-12 h-12 rounded-2xl bg-plasma-500/10 flex items-center justify-center text-plasma-400 mb-6">
                        <MessageSquare size={24} />
                     </div>
                     <h3 className="text-lg font-bold mb-2">1. Interaction Mesh</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        The AI layer translates natural language into technical configuration. It understands that "Production" context implies redundancy and security.
                     </p>
                  </SpatialCard>

                  <SpatialCard className="h-full">
                     <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                        <GitBranch size={24} />
                     </div>
                     <h3 className="text-lg font-bold mb-2">2. Action Graph Engine</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        Every intent becomes an Action Graph (Node-Edge). Allows for simulation, rollback, and infrastructure branching just like code.
                     </p>
                  </SpatialCard>

                  <SpatialCard className="h-full">
                     <div className="w-12 h-12 rounded-2xl bg-neon-mint/10 flex items-center justify-center text-neon-mint mb-6">
                        <Zap size={24} />
                     </div>
                     <h3 className="text-lg font-bold mb-2">3. Autonomous Ops</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        Self-healing system health monitoring. Automatically recovers from errors and scales when traffic spikes without intervention.
                     </p>
                  </SpatialCard>

                  <SpatialCard className="h-full">
                     <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6">
                        <Server size={24} />
                     </div>
                     <h3 className="text-lg font-bold mb-2">4. Infra Abstraction</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        The physical layer is abstracted. Automatically provisions KVM/LXC, Networking, and Storage on any underlying cloud platform.
                     </p>
                  </SpatialCard>
               </div>
            </div>
         </section>

         {/* 4. EXPERIENCE LAYER */}
         <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5" id="experience">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
               <div className="order-2 md:order-1 relative">
                  {/* Visual Mockup - Abstract Spatial Capsule */}
                  <div className="relative aspect-square max-w-lg mx-auto">
                     <div className="absolute inset-0 bg-plasma-500/20 blur-[100px] rounded-full animate-pulse-slow"></div>
                     <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-full w-full h-full p-12 flex items-center justify-center shadow-spatial">
                        <div className="text-center space-y-4">
                           <div className="inline-block p-6 rounded-full bg-plasma-500 text-black shadow-neon animate-float">
                              <Box size={48} />
                           </div>
                           <div>
                              <h3 className="text-2xl font-bold text-white">Shop-Prod Capsule</h3>
                              <p className="text-plasma-400 font-mono text-sm mt-1">cap-8821x • Running</p>
                           </div>
                           {/* Orbiting Satellites */}
                           <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float" style={{ animationDelay: '1s' }}>
                              <div className="p-2 bg-white/10 rounded-full border border-white/20"><Globe size={20} /></div>
                              <span className="text-[10px] text-gray-400">shop.com</span>
                           </div>
                           <div className="absolute bottom-16 right-16 flex flex-col items-center gap-1 animate-float" style={{ animationDelay: '2s' }}>
                              <div className="p-2 bg-white/10 rounded-full border border-white/20"><Database size={20} /></div>
                              <span className="text-[10px] text-gray-400">Postgres</span>
                           </div>
                           <div className="absolute bottom-16 left-16 flex flex-col items-center gap-1 animate-float" style={{ animationDelay: '3s' }}>
                              <div className="p-2 bg-white/10 rounded-full border border-white/20"><ShieldCheck size={20} /></div>
                              <span className="text-[10px] text-gray-400">WAF Active</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="order-1 md:order-2 space-y-8">
                  <div className="inline-block px-3 py-1 rounded-full border border-plasma-500/30 bg-plasma-500/10 text-plasma-400 text-xs font-bold uppercase tracking-wider">
                     User Experience
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">
                     From Intent to <span className="text-white">Capsule</span>.<br />
                     The Future Workspace.
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                     Instead of a dry list of resources, your project is a living Capsule.
                     Use the <strong>Time-lens</strong> to rewind and check past states, or fast-forward to see load forecasts.
                  </p>
                  <ul className="space-y-4 pt-4">
                     <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Check size={14} /></div>
                        <span className="text-gray-300">Context-adaptive surfaces (Adaptive UI).</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Check size={14} /></div>
                        <span className="text-gray-300">Visualize all component relationships (Graph View).</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Check size={14} /></div>
                        <span className="text-gray-300">Real-time navigation with Time-lens.</span>
                     </li>
                  </ul>
               </div>
            </div>
         </section>

         {/* 5. OPERATIONS LAYER */}
         <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Autonomous Operations</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                     The system never sleeps. AI continuously monitors, detects anomalies, and automatically executes approved recovery procedures.
                  </p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-3xl bg-neutral-900 border border-white/5 hover:border-plasma-500/30 transition-colors">
                     <Activity className="text-plasma-500 mb-4" size={32} />
                     <h3 className="text-xl font-bold text-white mb-2">Predictive Monitoring</h3>
                     <p className="text-gray-400 text-sm">
                        Predicts traffic spikes before they happen. Automatically scales infrastructure to anticipate load, preventing downtime.
                     </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-neutral-900 border border-white/5 hover:border-red-500/30 transition-colors">
                     <RefreshCw className="text-red-500 mb-4" size={32} />
                     <h3 className="text-xl font-bold text-white mb-2">Auto-Recovery</h3>
                     <p className="text-gray-400 text-sm">
                        When a service fails, the system automatically restarts, reroutes traffic, or restores from the latest snapshot in seconds.
                     </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-neutral-900 border border-white/5 hover:border-neon-mint/30 transition-colors">
                     <BrainCircuit className="text-neon-mint mb-4" size={32} />
                     <h3 className="text-xl font-bold text-white mb-2">Explainable AI</h3>
                     <p className="text-gray-400 text-sm">
                        Every AI action is transparent. You can review decision logs and rollback any action at any time if the AI makes a mistake.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* 6. INFRA MATRIX */}
         <section className="py-32 px-6 bg-gradient-to-b from-graphite-900 to-black">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
               <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                     Infrastructure Matrix.<br />
                     All in One Graph.
                  </h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                     No more logging into 10 different admin panels for VPS, Domain, SSL, and Backup. Autonix consolidates everything into a single control matrix.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <Server size={24} className="text-blue-400 mb-2" />
                        <div className="font-bold">VPS Orchestration</div>
                        <div className="text-xs text-gray-500 mt-1">Auto-provision, KVM/LXC</div>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <Globe size={24} className="text-purple-400 mb-2" />
                        <div className="font-bold">Domain & DNS Sphere</div>
                        <div className="text-xs text-gray-500 mt-1">Auto-connect, SSL, CDN</div>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <ShieldCheck size={24} className="text-green-400 mb-2" />
                        <div className="font-bold">Security & Audit</div>
                        <div className="text-xs text-gray-500 mt-1">WAF, DDoS, Compliance</div>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <RefreshCw size={24} className="text-amber-400 mb-2" />
                        <div className="font-bold">Backup & DR Matrix</div>
                        <div className="text-xs text-gray-500 mt-1">Snapshot timeline, Restore</div>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  {/* Decorative Matrix Grid */}
                  <div className="absolute inset-0 bg-spatial-grid opacity-30 mask-image-b"></div>
                  <div className="relative p-8 border border-white/10 rounded-3xl bg-black/50 backdrop-blur-sm">
                     <div className="font-mono text-xs text-neon-mint mb-4">root@autonix-matrix:~# status</div>
                     <div className="space-y-3 font-mono text-sm text-gray-300">
                        <div className="flex justify-between"><span>[VPS-01] Web-Node</span><span className="text-green-500">RUNNING</span></div>
                        <div className="flex justify-between"><span>[VPS-02] Worker</span><span className="text-green-500">RUNNING</span></div>
                        <div className="flex justify-between"><span>[DB-01]  Postgres</span><span className="text-green-500">HEALTHY</span></div>
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="flex justify-between"><span>[DOM]    shop.com</span><span className="text-blue-400">PROPAGATED</span></div>
                        <div className="flex justify-between"><span>[SSL]    Let's Encrypt</span><span className="text-blue-400">VALID (89 days)</span></div>
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="flex justify-between"><span>[BKUP]   Daily-Snap</span><span className="text-gray-500">COMPLETED 2h AGO</span></div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 7. PRICING */}
         <section className="py-24 px-6 border-t border-white/5 bg-white/[0.02]" id="pricing">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                     Start small and scale autonomously. No hidden fees for the AI Ops layer.
                  </p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <PricingCard
                     tier="Developer"
                     price="Free"
                     features={[
                        "1 Project Capsule",
                        "Standard Action Graph",
                        "Basic Monitoring",
                        "Community Support",
                        "1 User"
                     ]}
                  />
                  <PricingCard
                     tier="Pro"
                     price="$29"
                     isPopular
                     features={[
                        "10 Project Capsules",
                        "Advanced Auto-Scaling",
                        "AI Root Cause Analysis",
                        "Priority Support",
                        "5 Team Members",
                        "30 Days Log Retention"
                     ]}
                  />
                  <PricingCard
                     tier="Scale"
                     price="$99"
                     features={[
                        "Unlimited Capsules",
                        "Custom Blueprints",
                        "Enterprise Compliance (SOC2)",
                        "Dedicated Success Manager",
                        "Unlimited Team Members",
                        "1 Year Log Retention"
                     ]}
                  />
               </div>
            </div>
         </section>

         {/* 8. FAQ */}
         <section className="py-24 px-6 border-t border-white/5" id="faq">
            <div className="max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
               <div className="space-y-2">
                  <FaqItem
                     question="Do I need technical skills to use this?"
                     answer="Not at all. Autonix is designed 'Intent-first'. You just need to say what you want (e.g., 'a WordPress website'), and the system handles everything from server provisioning to domain setup."
                  />
                  <FaqItem
                     question="How is this different from VPS providers (DigitalOcean, Vultr)?"
                     answer="Old providers sell you raw ingredients (servers). Autonix sells you the result (an operating system). We automate setup, security, and maintenance so you don't have to do it manually."
                  />
                  <FaqItem
                     question="Can I migrate from legacy infrastructure?"
                     answer="Yes. Autonix supports data and container imports. We have AI tools that scan and suggest a roadmap for converting legacy infrastructure into an Action Graph."
                  />
                  <FaqItem
                     question="Where do I control what the AI does?"
                     answer="You have ultimate control. The AI proposes an Action Graph, you Preview and Approve it before execution. Everything is transparent."
                  />
                  <FaqItem
                     question="If the AI makes a mistake, can I rollback?"
                     answer="Yes. The Action Graph Engine stores every state. You can 'Time-travel' back to any previous point with a single click."
                  />
               </div>
            </div>
         </section>

         {/* 9. FINAL CTA */}
         <section className="py-40 px-6 text-center relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-plasma-500/5 blur-[150px] pointer-events-none"></div>
            <div className="max-w-4xl mx-auto relative z-10">
               <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
                  The Future of Cloud Ops<br />
                  <span className="text-white">via Intent.</span>
               </h2>
               <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  No more messy dashboards, no more cryptic error logs. Just intelligent resolution suggestions and a reversible infrastructure graph.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                     to="/entry"
                     className="px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform duration-500 shadow-neon flex items-center gap-3"
                  >
                     Get Started <ArrowRight size={20} />
                  </Link>
               </div>
               <p className="mt-8 text-sm text-gray-600">
                  *Free to initialize. No credit card required until deployment.
               </p>
            </div>
         </section>

      </div>
   );
};
