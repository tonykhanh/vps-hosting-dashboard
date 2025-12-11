
import React from 'react';

export const CircuitBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-graphite-950">
      {/* 1. Gradient Haze (Deep Space Atmosphere) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-plasma-900/30 via-graphite-950 to-graphite-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      
      {/* 2. Holographic Grid Surface (Perspective Plane) */}
      <div 
        className="absolute inset-0 bg-spatial-grid opacity-20" 
        style={{ 
          transform: 'perspective(1000px) rotateX(20deg) scale(1.5)',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' 
        }}
      ></div>

      {/* 3. Neural Circuitry SVG */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="neural-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="trace-gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0)" />
            <stop offset="50%" stopColor="rgba(14, 165, 233, 0.8)" />
            <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
          </linearGradient>

          <linearGradient id="trace-gradient-mint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 255, 163, 0)" />
            <stop offset="50%" stopColor="rgba(0, 255, 163, 0.6)" />
            <stop offset="100%" stopColor="rgba(0, 255, 163, 0)" />
          </linearGradient>
        </defs>

        {/* Abstract Neural Pathways (Curved Beziers) */}
        <g style={{ opacity: opacity + 0.4 }} filter="url(#neural-glow)">
           {/* Central Vein */}
           <path 
             d="M0 50% C 20% 50%, 40% 30%, 50% 30% S 80% 50%, 100% 50%" 
             fill="none" 
             stroke="url(#trace-gradient-blue)" 
             strokeWidth="1.5" 
             className="circuit-path-slow"
           />
           
           {/* Branching Veins */}
           <path 
             d="M50% 30% C 50% 10%, 70% 0, 80% 0" 
             fill="none" 
             stroke="rgba(56, 189, 248, 0.3)" 
             strokeWidth="1" 
             className="circuit-path"
             style={{ animationDuration: '7s' }}
           />
           <path 
             d="M50% 30% C 50% 60%, 30% 80%, 20% 100%" 
             fill="none" 
             stroke="url(#trace-gradient-mint)" 
             strokeWidth="1" 
             className="circuit-path-fast" 
           />

           {/* Glowing Nodes at Intersections */}
           <circle cx="50%" cy="30%" r="3" fill="#0ea5e9" className="animate-pulse" />
           <circle cx="20%" cy="50%" r="2" fill="#0ea5e9" opacity="0.6" />
           <circle cx="80%" cy="50%" r="2" fill="#0ea5e9" opacity="0.6" />
        </g>

        {/* Transparent Microchip Layers (Floating HUD Elements) */}
        <g style={{ opacity: opacity + 0.15 }} stroke="rgba(14, 165, 233, 0.15)" fill="none" strokeWidth="1">
           {/* Left Chip */}
           <path d="M5% 20% L15% 20% L18% 25% L18% 35% L15% 40% L5% 40% Z" />
           <line x1="5%" y1="25%" x2="10%" y2="25%" />
           <line x1="5%" y1="30%" x2="12%" y2="30%" />
           <line x1="5%" y1="35%" x2="10%" y2="35%" />

           {/* Right Chip */}
           <path d="M95% 60% L85% 60% L82% 65% L82% 75% L85% 80% L95% 80% Z" />
           <line x1="95%" y1="65%" x2="90%" y2="65%" />
           <line x1="95%" y1="70%" x2="88%" y2="70%" />
           <line x1="95%" y1="75%" x2="90%" y2="75%" />
        </g>
        
        {/* Ambient Data Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
            <circle 
                key={i}
                cx={`${Math.random() * 100}%`} 
                cy={`${Math.random() * 100}%`} 
                r={Math.random() * 1.5 + 0.5} 
                fill={`rgba(${Math.random() > 0.5 ? '14, 165, 233' : '0, 255, 163'}, ${0.2 + Math.random() * 0.3})`}
                className="animate-pulse"
                style={{ 
                  animationDelay: `${Math.random() * 5}s`, 
                  animationDuration: `${3 + Math.random() * 4}s` 
                }}
            />
        ))}
      </svg>
      
      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#020617_100%)] opacity-80"></div>
    </div>
  );
};
