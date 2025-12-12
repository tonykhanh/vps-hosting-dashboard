
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface CircuitBackgroundProps {
  opacity?: number;
  className?: string;
  forceTheme?: 'light' | 'dark';
  interactive?: boolean;
}

export const CircuitBackground: React.FC<CircuitBackgroundProps> = ({ 
  opacity = 0.2, 
  className = '',
  forceTheme,
  interactive = true
}) => {
  const { theme: contextTheme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 }); // Start center
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Theme Logic
  const isSystemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const activeTheme = forceTheme || contextTheme;
  const isDark = activeTheme === 'dark' || (activeTheme === 'system' && isSystemDark);

  // Colors - Deep Space Aesthetic (Darkened for better contrast)
  const bgGradient = isDark 
    ? 'radial-gradient(circle at 50% 0%, #050a14 0%, #000000 100%)' // Very dark blue/black
    : 'radial-gradient(circle at 50% 0%, #f1f5f9 0%, #cbd5e1 100%)'; // Darker slate for light mode depth

  // Grid & Lines
  // Increased opacity for better visibility
  const gridColor = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.06)'; 
  const primaryStroke = isDark ? '#38bdf8' : '#0284c7'; // Sky-400 / Sky-600
  const secondaryStroke = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.3)';

  // Mouse Interaction with damping for smoothness could be added here, 
  // but direct React state is usually sufficient for background parallax.
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinates 0..1
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Parallax Calculations
  // Tilt the grid slightly based on mouse Y
  // Pan the grid background slightly based on mouse X/Y
  const perspectiveRotateX = 15 + (mousePosition.y * 5); // 15 to 20 degrees tilt
  const bgPosX = mousePosition.x * -30; // Move grid slightly
  const bgPosY = mousePosition.y * -30;

  return (
    <div 
        ref={containerRef} 
        className={`absolute inset-0 overflow-hidden pointer-events-none select-none transition-colors duration-1000 ease-in-out ${className}`} 
        style={{ background: bgGradient }}
    >
      
      {/* 1. Dynamic Spotlight (Soft Ambient Glow following mouse) */}
      <div 
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.15)'}, transparent 70%)`,
        }}
      />

      {/* 2. Perspective Grid Floor */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{
            transform: `perspective(1000px) rotateX(${perspectiveRotateX}deg) scale(1.1)`,
            transformOrigin: '50% 100%', // Rotate from bottom
            opacity: 0.9
        }}
      >
         <div 
            className="absolute inset-0" 
            style={{
                backgroundImage: `
                    linear-gradient(${gridColor} 1px, transparent 1px), 
                    linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
                backgroundPosition: `${bgPosX}px ${bgPosY}px`,
                // Fade out grid at top (horizon)
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)'
            }}
         />
      </div>

      {/* 3. Circuit SVG Layer (Floating Elements) */}
      <svg className="absolute inset-0 w-full h-full opacity-80" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="circuit-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={primaryStroke} stopOpacity="0" />
                <stop offset="50%" stopColor={primaryStroke} stopOpacity="0.8" />
                <stop offset="100%" stopColor={primaryStroke} stopOpacity="0" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Background Tech Lines (Static but subtle) */}
        <g stroke={secondaryStroke} strokeWidth="1" fill="none">
            {/* Left Diagonal */}
            <path d="M-100,800 L300,400" />
            <path d="M-100,850 L350,400" opacity="0.6" />
            
            {/* Right Diagonal */}
            <path d="M2000,800 L1600,400" />
            <path d="M2000,850 L1550,400" opacity="0.6" />
            
            {/* Hexagons (Abstract) */}
            <path d="M100 100 L120 100 L130 117 L120 134 L100 134 L90 117 Z" transform="translate(100, 200)" opacity="0.3" />
            <path d="M100 100 L120 100 L130 117 L120 134 L100 134 L90 117 Z" transform="translate(1400, 300)" opacity="0.3" />
        </g>

        {/* Animated Flow Lines */}
        {/* We use large curved paths to simulate data streams */}
        <path 
            d="M-200,600 Q400,400 800,600 T1800,500" 
            stroke="url(#circuit-line-grad)" 
            strokeWidth="2" 
            fill="none"
            className="circuit-path-slow"
            style={{ opacity: 0.7 }}
        />
        
        <path 
            d="M-200,300 Q500,100 1200,300 T2200,200" 
            stroke="url(#circuit-line-grad)" 
            strokeWidth="1.5" 
            fill="none"
            className="circuit-path"
            style={{ animationDuration: '8s', opacity: 0.6 }}
        />

        {/* Pulsing Nodes */}
        {/* Randomly placed nodes that pulse softly */}
        {[
            { cx: '15%', cy: '30%', r: 2, delay: '0s' },
            { cx: '85%', cy: '60%', r: 2, delay: '1.5s' },
            { cx: '50%', cy: '80%', r: 3, delay: '2.2s' },
            { cx: '30%', cy: '50%', r: 1.5, delay: '0.5s' }
        ].map((node, i) => (
            <circle 
                key={i}
                cx={node.cx} 
                cy={node.cy} 
                r={node.r} 
                fill={primaryStroke}
                className="animate-pulse"
                style={{ animationDuration: '4s', animationDelay: node.delay }}
                filter={isDark ? "url(#glow)" : ""}
            />
        ))}
      </svg>
      
      {/* 4. Vignette Overlay (Darken edges) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
            background: isDark 
                ? 'radial-gradient(circle at center, transparent 30%, #000000 100%)' 
                : 'radial-gradient(circle at center, transparent 40%, #ffffff 100%)'
        }}
      />
    </div>
  );
};
