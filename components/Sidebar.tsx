
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from '../context/ThemeContext';
import { 
  LayoutGrid, Plus, Settings, Box, Activity, Hexagon, 
  BrainCircuit, Scale, ShieldAlert, Lock, Gauge, GitMerge, 
  Users, LifeBuoy, ChevronDown, ChevronRight, ChevronLeft, 
  CreditCard, Sparkles, Moon, Sun, Monitor, HeartPulse, Fingerprint, Server, X,
  Cpu, Network, HardDrive, Globe, Database
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme, isAuthenticated } = useTheme();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    // Always allow toggling on mobile since it's always expanded
    if (!isExpanded && !isMobileOpen) return;
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isActive = (path: string) => {
    if (path === '/console') {
      return location.pathname === '/console' || location.pathname === '/console/';
    }
    return location.pathname.startsWith(path);
  };

  // Determine if we are in "expanded mode" (either desktop expanded or mobile open)
  const showExpanded = isExpanded || isMobileOpen;

  const navGroups = [
    {
      id: 'core',
      label: 'Workspace',
      items: [
        { name: 'Dashboard', path: '/console', icon: LayoutGrid },
        { name: 'Projects', path: '/console/projects', icon: Box },
        { name: 'Team', path: '/console/team', icon: Users },
      ]
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      items: [
        { name: 'S3', path: '/console/s3', icon: Database },
        { name: 'Compute', path: '/console/compute', icon: Cpu },
        { name: 'Network', path: '/console/network', icon: Network },
        { name: 'Domain', path: '/console/domain', icon: Globe },
      ]
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      items: [
        { name: 'AI Insights', path: '/console/insights', icon: BrainCircuit },
        { name: 'Automation', path: '/console/automation', icon: GitMerge },
        { name: 'Experience', path: '/console/ux', icon: Sparkles },
      ]
    },
    {
      id: 'ops',
      label: 'Operations',
      items: [
        { name: 'System Health', path: '/console/system-health', icon: HeartPulse },
        { name: 'Monitoring', path: '/console/monitoring', icon: Activity },
        { name: 'Performance', path: '/console/performance', icon: Gauge },
        { name: 'Scaling', path: '/console/scaling', icon: Scale },
        { name: 'Cost & Budget', path: '/console/cost', icon: CreditCard },
      ]
    },
    {
      id: 'security',
      label: 'Resilience',
      items: [
        { name: 'Incidents', path: '/console/incidents', icon: ShieldAlert },
        { name: 'Recovery', path: '/console/recovery', icon: LifeBuoy },
        { name: 'Security', path: '/console/security', icon: Lock },
        { name: 'Identity', path: '/console/identity', icon: Fingerprint },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onMobileClose}
      />

      <aside 
        className={`
          fixed z-50 flex flex-col
          bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl 
          border-r md:border border-white/20 dark:border-white/10 shadow-2xl
          
          /* Mobile Styles */
          inset-y-0 left-0 w-72 transition-transform duration-300 ease-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          
          /* Desktop Styles */
          md:translate-x-0
          md:left-4 md:top-4 md:bottom-4 md:rounded-[2.5rem]
          md:transition-[width] md:duration-500 md:cubic-bezier(0.25, 1, 0.5, 1)
          ${isExpanded ? 'md:w-72' : 'md:w-20'}
        `}
      >
        {/* 1. Header / Brand */}
        <div className={`h-24 flex items-center shrink-0 w-full ${showExpanded ? 'px-8 justify-between' : 'justify-center px-0'}`}>
          <div className={`flex items-center ${showExpanded ? 'gap-3' : 'justify-center w-full'}`}>
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="absolute inset-0 bg-plasma-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
              <div className="relative shrink-0 p-3 rounded-2xl bg-gradient-to-br from-plasma-500 to-indigo-600 text-white shadow-inner">
                <Hexagon size={24} />
              </div>
            </div>
            
            <div className={`flex flex-col transition-all duration-300 ${showExpanded ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 overflow-hidden'}`}>
              <span className="font-bold text-gray-900 dark:text-white text-xl tracking-tight leading-none whitespace-nowrap">Autonix</span>
              <span className="text-[10px] text-plasma-600 dark:text-plasma-400 font-bold uppercase tracking-[0.2em] mt-1 whitespace-nowrap">Platform</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onMobileClose}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. Primary Action (New Project) */}
        <div className={`mb-2 shrink-0 transition-all duration-300 ${showExpanded ? 'px-4' : 'px-0 flex justify-center w-full'}`}>
          <Link
            to="/console/create"
            onClick={onMobileClose}
            className={`
              relative group flex items-center justify-center
              bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 
              hover:bg-plasma-600 dark:hover:bg-plasma-200 hover:shadow-lg hover:shadow-plasma-500/30
              transition-all duration-300 rounded-2xl overflow-hidden
              ${showExpanded ? 'h-14 w-full gap-3' : 'h-12 w-12'}
            `}
          >
            <Plus size={24} className="shrink-0 transition-transform group-hover:rotate-90" />
            <span className={`font-bold text-sm whitespace-nowrap transition-all duration-300 ${showExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 hidden'}`}>
              New Project
            </span>
          </Link>
        </div>

        {/* 3. Navigation Scroll Area */}
        <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar space-y-8 mask-image-b ${showExpanded ? 'px-4' : 'px-0 flex flex-col items-center w-full'}`}>
          {navGroups.map((group) => {
            const isGroupCollapsed = collapsedGroups[group.id];

            return (
              <div key={group.id} className={`space-y-2 ${!showExpanded && 'w-full flex flex-col items-center'}`}>
                {/* Group Label */}
                {showExpanded ? (
                  <button 
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300 transition-colors group select-none"
                  >
                    <span>{group.label}</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isGroupCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                ) : (
                  <div className="w-8 h-[2px] bg-gray-100 dark:bg-white/5 mx-auto rounded-full mb-3" />
                )}

                {/* Items */}
                <div className={`space-y-1 transition-all duration-500 ease-in-out ${showExpanded && isGroupCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[800px] opacity-100'} ${!showExpanded && 'flex flex-col items-center w-full'}`}>
                  {group.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onMobileClose}
                        className={`
                          relative flex items-center rounded-xl transition-all duration-300 group
                          ${active 
                            ? 'text-white shadow-lg shadow-plasma-500/30' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
                          ${showExpanded ? 'px-4 py-3 gap-3' : 'justify-center w-12 h-12'}
                        `}
                      >
                        {/* Active Background Pill */}
                        {active && (
                          <div className="absolute inset-0 bg-gradient-to-r from-plasma-600 to-indigo-600 rounded-xl -z-10" />
                        )}

                        <item.icon 
                          size={20} 
                          strokeWidth={active ? 2.5 : 2} 
                          className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} 
                        />
                        
                        <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${showExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none w-0'}`}>
                          {item.name}
                        </span>

                        {/* Tooltip for Collapsed State (Desktop Only) */}
                        {!showExpanded && (
                          <div className="absolute left-14 bg-neutral-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-[60] shadow-xl translate-x-2 group-hover:translate-x-0 hidden md:block">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* 4. Footer & Controls */}
        <div className={`shrink-0 flex flex-col gap-3 ${showExpanded ? 'p-4' : 'p-2 items-center w-full'}`}>
          {/* Toggle Button (Desktop Only) */}
          <button 
            onClick={onToggle}
            className={`
              hidden md:flex
              absolute -right-5 top-1/2 -translate-y-1/2 z-50
              w-10 h-10 rounded-full bg-white dark:bg-neutral-800 
              border-4 border-slate-50 dark:border-neutral-950 shadow-xl
              items-center justify-center text-gray-400 dark:text-gray-500
              hover:text-plasma-600 dark:hover:text-plasma-400 hover:scale-110
              transition-all duration-300
            `}
          >
            {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Theme Toggle Pill */}
          {showExpanded ? (
            <div className="flex items-center justify-between p-1 bg-gray-100/50 dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-white/5">
               {[
                 { id: 'light', icon: Sun },
                 { id: 'system', icon: Monitor },
                 { id: 'dark', icon: Moon }
               ].map((t) => (
                 <button 
                   key={t.id}
                   onClick={() => setTheme(t.id as any)}
                   className={`
                     p-2 rounded-lg flex-1 flex justify-center transition-all duration-300
                     ${theme === t.id 
                       ? 'bg-white dark:bg-neutral-700 text-plasma-600 shadow-sm scale-105' 
                       : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}
                   `}
                 >
                    <t.icon size={16} />
                 </button>
               ))}
            </div>
          ) : (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-12 h-12 rounded-xl bg-gray-100/50 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-plasma-600 transition-colors"
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          )}

          {/* User Profile Mini-Card with Settings */}
          <div className={`flex items-center gap-2 w-full h-14 ${showExpanded ? 'items-stretch' : 'justify-center'}`}>
            <Link 
              to="/console/settings"
              onClick={onMobileClose}
              className={`
                flex items-center rounded-2xl transition-all duration-300 cursor-pointer group
                ${showExpanded 
                  ? 'flex-1 h-full px-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10' 
                  : 'justify-center w-14 h-14'}
              `}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-plasma-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
                  JD
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ${showExpanded ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0 hidden'}`}>
                <div className="text-sm font-bold text-gray-900 dark:text-white truncate">John Doe</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Workspace</div>
              </div>
            </Link>

            {/* Settings Button (Visible when expanded) - Fixed Width Square */}
            {showExpanded && (
              <Link 
                to="/console/settings"
                onClick={onMobileClose}
                className="w-14 h-full flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-plasma-600 dark:hover:text-plasma-400 rounded-2xl transition-colors shrink-0"
                title="Settings"
              >
                <Settings size={20} />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
