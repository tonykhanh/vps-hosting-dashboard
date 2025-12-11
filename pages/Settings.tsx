
import React, { useState } from 'react';
import { useNavigate } from '../context/ThemeContext';
import { 
  Settings as SettingsIcon, User, CreditCard, Bell, 
  Shield, Key, Moon, LogOut, Sun, Monitor
} from 'lucide-react';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';

// --- Sub-Components ---

const GeneralSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 flex items-center justify-center text-2xl font-bold text-white shadow-inner shrink-0">
            JD
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h2>
            <p className="text-gray-500 dark:text-gray-400">john.doe@example.com</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-bold uppercase">Admin</span>
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-bold uppercase">Pro Plan</span>
            </div>
        </div>
        <Button variant="secondary" className="sm:ml-auto dark:bg-neutral-800 dark:text-gray-200 dark:border-neutral-700">Edit Profile</Button>
      </div>

      <div className="space-y-4 max-w-lg mx-auto sm:mx-0">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
            <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-plasma-100 outline-none dark:text-white"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-plasma-100 outline-none dark:text-white"/>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-neutral-800">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-neutral-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-300">
                  {theme === 'dark' ? <Moon size={18}/> : theme === 'light' ? <Sun size={18}/> : <Monitor size={18}/>}
              </div>
              <div>
                  <div className="font-medium text-gray-900 dark:text-white capitalize">{theme} Mode</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Select system interface theme</div>
              </div>
            </div>
            
            <div className="flex bg-gray-200 dark:bg-neutral-900 p-1 rounded-lg">
              {[
                { id: 'light', icon: Sun },
                { id: 'system', icon: Monitor },
                { id: 'dark', icon: Moon }
              ].map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`p-1.5 rounded-md transition-all ${theme === t.id ? 'bg-white shadow text-plasma-600' : 'text-gray-500'}`}
                  title={`${t.id} Mode`}
                >
                  <t.icon size={16} />
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const BillingSettings: React.FC = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Current Balance</p>
              <h2 className="text-4xl font-bold">$245.00</h2>
              <p className="text-sm text-gray-400 mt-2">Next invoice due on June 1, 2024</p>
          </div>
          <Button className="bg-white text-black hover:bg-gray-100 border-none w-full sm:w-auto">Add Funds</Button>
        </div>
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-plasma-500/20 rounded-full blur-3xl"></div>
    </div>

    <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resource Usage (Current Month)</h3>
        <div className="space-y-4">
          {[
              { label: 'Compute Hours', used: 75, limit: 100, unit: 'hrs' },
              { label: 'Bandwidth', used: 450, limit: 1000, unit: 'GB' },
              { label: 'Storage', used: 22, limit: 50, unit: 'GB' }
          ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                    <span className="text-gray-900 dark:text-gray-200 font-bold">{item.used} / {item.limit} {item.unit}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-plasma-500 rounded-full" 
                      style={{ width: `${(item.used / item.limit) * 100}%` }}
                    ></div>
                </div>
              </div>
          ))}
        </div>
    </div>
  </div>
);

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    deployment: true,
    billing: true
  });

  const toggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h3 className="font-bold text-gray-900 dark:text-white">Alert Preferences</h3>
      <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive daily summaries and critical alerts via email.' },
            { key: 'slack', label: 'Slack Integration', desc: 'Forward incidents to a designated Slack channel.' },
            { key: 'deployment', label: 'Deployment Status', desc: 'Notify when a build succeeds or fails.' },
            { key: 'billing', label: 'Billing Alerts', desc: 'Notify when monthly budget exceeds 80%.' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 pr-2">{item.desc}</div>
                </div>
                <button 
                  onClick={() => toggle(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-plasma-600' : 'bg-gray-200 dark:bg-neutral-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
            </div>
          ))}
      </div>
    </div>
  );
};

const ApiSettings: React.FC = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 flex gap-3">
        <Shield className="text-amber-600 dark:text-amber-500 shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm">Security Warning</h4>
          <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
              Your API keys grant full access to your infrastructure. Do not share them.
          </p>
        </div>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active API Key</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <code className="flex-1 bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              pk_live_51Msz...x8d9s
          </code>
          <Button variant="secondary" className="dark:bg-neutral-800 dark:text-gray-200 dark:border-neutral-700">Revoke</Button>
        </div>
    </div>
    
    <Button>Generate New Key</Button>
  </div>
);

// --- Main Component ---

const TABS = [
  { id: 'general', label: 'General', icon: User, component: GeneralSettings },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, component: BillingSettings },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationSettings },
  { id: 'api', label: 'API & Tokens', icon: Key, component: ApiSettings },
];

export const Settings: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState('general');
  const { logout } = useTheme();
  const navigate = useNavigate();

  const ActiveComponent = TABS.find(t => t.id === activeTabId)?.component || GeneralSettings;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-8 pb-20 relative h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-plasma-600" size={32} />
          System Configuration
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account, billing preferences, and platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTabId === tab.id 
                  ? 'bg-white dark:bg-neutral-800 text-plasma-600 dark:text-plasma-400 shadow-sm border border-gray-100 dark:border-neutral-700' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-neutral-800">
             <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
             >
                <LogOut size={18} /> Sign Out
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
           <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-glass min-h-[500px]">
              <ActiveComponent />
           </div>
        </div>

      </div>
    </div>
  );
};
