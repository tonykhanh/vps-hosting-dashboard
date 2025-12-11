import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { EntryScreen } from './components/EntryScreen';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetail } from './pages/ProjectDetail';
import { ProjectCapsule } from './pages/ProjectCapsule';
import { CreateProject } from './pages/CreateProject';
import { Monitoring } from './pages/Monitoring';
import { AIInsights } from './pages/AIInsights';
import { ResourceScaling } from './pages/ResourceScaling';
import { Incidents } from './pages/Incidents';
import { Recovery } from './pages/Recovery';
import { Security } from './pages/Security';
import { Performance } from './pages/Performance';
import { Automation } from './pages/Automation';
import { Team } from './pages/Team';
import { Projects } from './pages/Projects';
import { Settings } from './pages/Settings';
import { Cost } from './pages/Cost';
import { UXOptimization } from './pages/UXOptimization';
import { SystemHealth } from './pages/SystemHealth';
import { Identity } from './pages/Identity';
import { VPS } from './pages/VPS';
import { Domains } from './pages/Domains';
import { NetworkPage } from './pages/Network';
import { Storage } from './pages/Storage';
import { ThemeProvider } from './context/ThemeContext';
import { Menu, Hexagon } from 'lucide-react';

// --- Global Effects ---

const CloudNetworkEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Theme Config (2030 Palette)
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const nodeColor = isDark ? 'rgba(12, 141, 233, 0.4)' : 'rgba(12, 141, 233, 0.3)'; // Plasma Blue
    const lineColor = isDark ? '12, 141, 233' : '59, 130, 246';
    const textColor = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(71, 85, 105, 0.3)';

    const codeSymbols = ['{ }', '< />', 'fn', 'var', '01', 'git', 'npm', 'if', ';;', '=>'];
    const nodeCount = 35; // Fewer nodes for cleaner look
    const connectionDistance = 250;
    const mouseDistance = 350;

    const nodes = Array.from({ length: nodeCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw Node (Cloud Point)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Draw Code Symbol (Programmer Effect) - Fainter
        ctx.font = '10px monospace';
        ctx.fillStyle = textColor;
        ctx.fillText(node.symbol, node.x + 8, node.y - 8);

        // Interaction with Mouse
        const dxMouse = mouseRef.current.x - node.x;
        const dyMouse = mouseRef.current.y - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouseDistance) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${0.15 * (1 - distMouse / mouseDistance)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Gentle attraction to mouse
          node.x += dxMouse * 0.005;
          node.y += dyMouse * 0.005;
        }

        // Connect nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${0.05 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, theme]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};

const GlobalMouseEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-hologram-white dark:bg-graphite-950 transition-colors duration-700">
      
      {/* 3D Perspective Grid - The "Entry" Grid made Global */}
      <div 
        className="absolute inset-0 bg-spatial-grid opacity-30 dark:opacity-20 transform-gpu transition-transform duration-[200ms]"
        style={{ 
          transform: `perspective(1000px) rotateX(10deg) translateZ(0) translateY(calc(var(--y) * 0.01)) translateX(calc(var(--x) * 0.01))` 
        }}
      ></div>

      {/* Cloud & Code Network (Canvas) */}
      <CloudNetworkEffect />
      
      {/* Ambient Spotlight Glow - Follows Mouse */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 opacity-40 dark:opacity-15 mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle 800px at var(--x) var(--y), rgba(12, 141, 233, 0.2), transparent 70%)',
        }}
      />
    </div>
  );
};

const Layout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex font-sans text-neutral-graphite dark:text-gray-200 relative overflow-hidden transition-colors duration-1000 ease-out">
      
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 z-40 md:hidden px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-plasma-500 to-indigo-600 text-white shadow-inner">
              <Hexagon size={16} />
            </div>
            <span className="font-bold text-gray-900 dark:text-white tracking-tight">Autonix</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-plasma-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          JD
        </div>
      </div>

      <Sidebar 
        isExpanded={isSidebarExpanded} 
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Content Area */}
      <main 
        className={`
          flex-1 px-4 md:p-8 overflow-y-auto min-h-screen relative z-10 
          transition-[margin] duration-700 ease-out-expo
          pt-20
          ${isSidebarExpanded ? 'md:ml-72' : 'md:ml-0'}
          md:pt-8
        `}
      >
        <div 
          key={location.pathname}
          className="max-w-[1600px] mx-auto h-full animate-spatial-entry"
        >
          <Routes>
            <Route path="/console" element={<Dashboard />} />
            <Route path="/console/create" element={<CreateProject />} />
            <Route path="/console/projects/:id" element={<ProjectCapsule />} />
            <Route path="/console/capsule/:id" element={<ProjectCapsule />} />
            <Route path="/console/projects" element={<Projects />} />
            <Route path="/console/monitoring" element={<Monitoring />} />
            <Route path="/console/performance" element={<Performance />} />
            <Route path="/console/insights" element={<AIInsights />} />
            <Route path="/console/scaling" element={<ResourceScaling />} />
            <Route path="/console/system-health" element={<SystemHealth />} />
            <Route path="/console/incidents" element={<Incidents />} />
            <Route path="/console/recovery" element={<Recovery />} />
            <Route path="/console/security" element={<Security />} />
            <Route path="/console/identity" element={<Identity />} />
            <Route path="/console/automation" element={<Automation />} />
            <Route path="/console/team" element={<Team />} />
            <Route path="/console/settings" element={<Settings />} />
            <Route path="/console/cost" element={<Cost />} />
            <Route path="/console/ux" element={<UXOptimization />} />
            
            {/* Infrastructure Routes */}
            <Route path="/console/compute" element={<VPS />} />
            <Route path="/console/network" element={<NetworkPage />} />
            <Route path="/console/domain" element={<Domains />} />
            <Route path="/console/s3" element={<Storage />} />
            <Route path="/console/storage" element={<Storage />} />
            
            <Route path="/console/*" element={<Navigate to="/console" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const EntryRoute: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useTheme();

  const handleComplete = () => {
    login();
    navigate('/console');
  };

  return <EntryScreen onComplete={handleComplete} />;
};

const ConsoleGuard: React.FC = () => {
  const { isAuthenticated } = useTheme();
  
  // If not authenticated, redirect to Landing Page instead of Entry screen
  // This ensures a proper flow: Landing -> Launch -> Entry -> Dashboard
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
};

/**
 * Enforces strict routing logic.
 * If the user reloads the page on '/entry' or any other route but is NOT authenticated,
 * we force them back to the Landing Page ('/').
 * This prevents getting stuck on the Entry animation screen on reload.
 */
const LocationEnforcer: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useTheme();

  // Use useLayoutEffect to trigger before paint, preventing visual flash of wrong route
  useLayoutEffect(() => {
    // Allow access to landing page AND entry page without authentication
    const isPublicPath = pathname === '/' || pathname === '/entry';

    // If user is not authenticated and trying to access a private path (anything other than root or entry)
    if (!isAuthenticated && !isPublicPath) {
      console.log('LocationEnforcer: Redirecting unauthenticated user to Landing Page');
      navigate('/');
    }
  }, [isAuthenticated, pathname, navigate]); 

  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <LocationEnforcer />
        <GlobalMouseEffects />
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Entry Sequence */}
          <Route path="/entry" element={<EntryRoute />} />
          
          {/* Protected Console Routes */}
          <Route path="/console/*" element={<ConsoleGuard />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;