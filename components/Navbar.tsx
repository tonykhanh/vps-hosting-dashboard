
import React, { useState, useEffect } from 'react';
import { Hexagon, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from '../context/ThemeContext';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Transition point
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Determine navbar background state
  const navBackgroundClass = (isScrolled || isMobileMenuOpen)
    ? 'bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-glass' 
    : 'bg-transparent border-b border-transparent';

  const navPaddingClass = (isScrolled || isMobileMenuOpen) ? 'py-4' : 'py-6 md:py-8';

  return (
    <>
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-500 ease-in-out
          ${navBackgroundClass}
          ${navPaddingClass}
        `}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-plasma-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-1000 rounded-full"></div>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-plasma-500 to-indigo-600 text-white shadow-lg group-hover:scale-105 transition-transform duration-700 ease-spring">
                <Hexagon size={20} className="fill-current" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-plasma-600 dark:group-hover:text-plasma-400 transition-colors duration-700">Autonix</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {['Hero', 'Paradigm', 'Engine', 'Experience', 'Pricing', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                onClick={(e) => scrollToSection(e, item.toLowerCase())}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-plasma-600 dark:hover:text-white transition-colors duration-500 relative group cursor-pointer"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-plasma-500 transition-all duration-700 ease-out group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/entry" className="text-sm font-bold text-gray-900 dark:text-white hover:text-plasma-600 transition-colors duration-500">
              Log In
            </Link>
            <Link 
              to="/entry" 
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 shadow-lg shadow-plasma-500/20 group bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-gray-100 border-none transition-all duration-700 ease-out hover:shadow-neon hover:scale-105 font-medium"
            >
              Launch Console <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-500" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors duration-300 relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`
          fixed inset-0 z-40 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-2xl lg:hidden flex flex-col pt-28 px-6 pb-10
          transition-all duration-500 ease-out-expo
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          {['Hero', 'Paradigm', 'Engine', 'Experience', 'Pricing', 'FAQ'].map((item, idx) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`
                text-3xl font-bold text-gray-900 dark:text-white py-2 border-b border-gray-100 dark:border-white/5 
                hover:text-plasma-600 dark:hover:text-plasma-400 transition-all duration-500 transform
                ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
              `}
              style={{ transitionDelay: `${100 + (idx * 50)}ms` }}
              onClick={(e) => scrollToSection(e, item.toLowerCase())}
            >
              {item}
            </a>
          ))}
          
          <div 
            className={`mt-auto flex flex-col gap-4 transition-all duration-700 delay-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
             <Link to="/entry" className="w-full py-4 rounded-2xl text-center text-lg font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                Log In
             </Link>
             <Link to="/entry" className="w-full py-4 rounded-2xl text-center text-lg font-bold bg-plasma-600 text-white shadow-xl shadow-plasma-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
               Launch Console <ArrowRight size={20} />
             </Link>
          </div>
        </div>
      </div>
    </>
  );
};
