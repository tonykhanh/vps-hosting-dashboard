
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
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)] space-y-8">
      
      {/* Full Width Header Area - Sits above columns */}
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

         {/* Primary Action - Desktop Position */}
         {primaryAction && (
            <div className="hidden md:block shrink-0">
               <Button className="shadow-xl shadow-plasma-500/20 py-3 px-6 text-base" onClick={primaryAction.onClick}>
                  <Plus size={20} className="mr-2"/> {primaryAction.label}
               </Button>
            </div>
         )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-6 lg:shrink-0">
           <div className="lg:sticky lg:top-6 z-20">
              <nav className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 rounded-3xl p-2 shadow-sm overflow-hidden">
                  <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-1 gap-1 no-scrollbar">
                      {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        const ItemIcon = item.icon;
                        return (
                          <button
                              key={item.id}
                              onClick={() => onSectionChange(item.id)}
                              className={`
                                  group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap text-left relative overflow-hidden flex-shrink-0
                                  ${isActive
                                      ? 'bg-white dark:bg-neutral-800 text-plasma-700 dark:text-white shadow-md ring-1 ring-black/5 dark:ring-white/10 font-bold' 
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-gray-200'}
                              `}
                          >
                              <ItemIcon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110 text-plasma-600 dark:text-plasma-400' : 'group-hover:scale-110'}`} />
                              
                              <span className="flex-1">{item.label}</span>
                              
                              {item.badge && (
                                  <span className="ml-2 text-[10px] bg-plasma-100 dark:bg-plasma-900/30 text-plasma-700 dark:text-plasma-400 px-1.5 py-0.5 rounded font-bold">
                                      {item.badge}
                                  </span>
                              )}
                          </button>
                        );
                      })}
                  </div>
              </nav>
           </div>
           
           {/* Mobile Primary Action (Below Nav) */}
           {primaryAction && (
              <div className="md:hidden">
                 <Button className="w-full justify-center shadow-md py-3" onClick={primaryAction.onClick}>
                    <Plus size={18} className="mr-2"/> {primaryAction.label}
                 </Button>
              </div>
           )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {children}
           </div>
        </div>
      </div>
    </div>
  );
};
