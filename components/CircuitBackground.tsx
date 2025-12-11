import React from 'react';

export const CircuitBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 bg-spatial-grid" 
        style={{ opacity: opacity }}
      ></div>

      {/* SVG Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0)" />
            <stop offset="50%" stopColor="rgba(14, 165, 233, 0.8)" />
            <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
          </linearGradient>
          <linearGradient id="circuit-gradient-mint" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 255, 163, 0)" />
            <stop offset="50%" stopColor="rgba(0, 255, 163, 0.8)" />
            <stop offset="100%" stopColor="rgba(0, 255, 163, 0)" />
          </linearGradient>
        </defs>

        {/* Traces Group 1 (Top Left) */}
        <g style={{ opacity: opacity + 0.2 }}>
          <path d="M0 100 H100 L150 150 H300" fill="none" stroke="url(#circuit-gradient)" strokeWidth="1" className="circuit-path" />
          <circle cx="300" cy="150" r="2" fill="#0ea5e9" />
          
          <path d="M50 0 V50 L100 100 H200" fill="none" stroke="url(#circuit-gradient-mint)" strokeWidth="1" className="circuit-path-slow" style={{ animationDelay: '1s' }} />
          <circle cx="200" cy="100" r="2" fill="#00ffa3" />
        </g>

        {/* Traces Group 2 (Bottom Right) */}
        <g style={{ opacity: opacity + 0.2, transform: 'rotate(180deg)', transformOrigin: 'center' }}>
           <path d="M0 200 H150 L200 250 H400" fill="none" stroke="url(#circuit-gradient)" strokeWidth="1" className="circuit-path" style={{ animationDelay: '0.5s' }} />
           <circle cx="400" cy="250" r="2" fill="#0ea5e9" />
        </g>

        {/* Traces Group 3 (Random Connectors) */}
        <g style={{ opacity: opacity }}>
           <path d="M20% 0 V20% L25% 25% H40%" fill="none" stroke="#334155" strokeWidth="1" />
           <path d="M80% 100% V80% L75% 75% H60%" fill="none" stroke="#334155" strokeWidth="1" />
           <path d="M0 60% H10% L15% 65% V80%" fill="none" stroke="#334155" strokeWidth="1" />
           
           {/* Animated Pulse on Static Line */}
           <path d="M0 60% H10% L15% 65% V80%" fill="none" stroke="url(#circuit-gradient-mint)" strokeWidth="1" className="circuit-path-fast" />
        </g>
        
        {/* Floating Nodes */}
        <circle cx="15%" cy="25%" r="3" fill="#1e293b" />
        <circle cx="85%" cy="75%" r="3" fill="#1e293b" />
      </svg>
    </div>
  );
};