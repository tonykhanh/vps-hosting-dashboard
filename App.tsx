
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useTheme } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
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
import { AICopilot } from './components/AICopilot';
import { ThemeProvider } from './context/ThemeContext';
import { Menu, Hexagon } from 'lucide-react';
import { CircuitBackground } from './components/CircuitBackground';

const GlobalMouseEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden bg-white dark:bg-black transition-colors duration-700">
      <CircuitBackground interactive={true} />
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
      
      {/* Mobile Header (Visible on Tablet and Mobile) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 z-40 lg:hidden px-4 flex items-center justify-between">
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
      
      {/* AI Copilot Overlay (Global Subsystem) */}
      <AICopilot />

      {/* Main Content Area */}
      <main 
        className={`
          flex-1 px-4 md:p-8 overflow-y-auto min-h-screen relative z-10 
          transition-[margin] duration-500 ease-out-expo
          pt-20 lg:pt-8
          ${isSidebarExpanded ? 'lg:ml-80' : 'lg:ml-28'}
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
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
};

const LocationEnforcer: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useTheme();

  useEffect(() => {
    const isPublicPath = pathname === '/' || pathname === '/entry';

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
      <ProjectProvider>
        <BrowserRouter>
          <LocationEnforcer />
          <GlobalMouseEffects />
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Entry Sequence */}
            <Route path="/entry" element={<EntryRoute />} />
            
            {/* Protected Console Routes */}
            <Route path="/console/*" element={<ConsoleGuard />} />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
