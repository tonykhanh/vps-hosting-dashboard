
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../Button';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  desc?: string;
  badge?: string;
  action?: string;
  onClick?: () => void;
}

interface InfrastructureLayoutProps {
  title: string;
  description: string;
  icon: any;
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (id: any) => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
}

export const InfrastructureLayout: React.FC<InfrastructureLayoutProps> = ({
  title,
  description,
  icon: Icon,
  navItems,
  activeSection,
  onSectionChange,
  primaryAction,
  children
}) => {
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)] space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-plasma-100 dark:bg-plasma-900/30 rounded-xl text-plasma-600 dark:text-plasma-400 shadow-sm border border-plasma-200 dark:border-plasma-800">
                <Icon size={28} />
              </div>
              {title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 ml-1 text-base md:text-lg max-w-2xl leading-relaxed">
              {description}
            </p>
         </div>

         {/* Primary Action */}
         {primaryAction && (
            <div className="shrink-0 w-full md:w-auto">
               <Button className="shadow-xl shadow-plasma-500/20 py-3 px-6 text-base w-full md:w-auto justify-center" onClick={primaryAction.onClick}>
                  <Plus size={20} className="mr-2"/> {primaryAction.label}
               </Button>
            </div>
         )}
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-20 bg-gray-50/95 dark:bg-[#020617]/95 backdrop-blur-sm -mx-4 px-4 md:mx-0 md:px-0 transition-colors duration-500">
        <nav className="flex gap-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  group flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap
                  ${isActive
                    ? 'border-plasma-600 text-plasma-600 dark:text-plasma-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-neutral-700'}
                `}
                title={item.desc}
              >
                <ItemIcon 
                  size={18} 
                  className={`
                    transition-colors 
                    ${isActive ? 'text-plasma-600 dark:text-plasma-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'}
                  `} 
                />
                
                <span>{item.label}</span>
                
                {item.badge && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-plasma-100 text-plasma-700 dark:bg-plasma-900/50 dark:text-plasma-300' : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pt-2">
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            {children}
         </div>
      </div>
    </div>
  );
};
