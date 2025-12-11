
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

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-1000 ease-slow
        ${isScrolled 
          ? 'bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-4 shadow-glass' 
          : 'bg-transparent py-8 border-b border-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-plasma-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-1000 rounded-full"></div>
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-plasma-500 to-indigo-600 text-white shadow-lg group-hover:scale-105 transition-transform duration-700 ease-spring">
              <Hexagon size={20} className="fill-current" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-plasma-600 dark:group-hover:text-plasma-400 transition-colors duration-700">Autonix</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
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
        <div className="hidden md:flex items-center gap-4">
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
          className="md:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#020617] border-b border-gray-100 dark:border-white/5 p-6 md:hidden flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-2 duration-300">
          {['Hero', 'Paradigm', 'Engine', 'Experience', 'Pricing', 'FAQ'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-lg font-medium text-gray-900 dark:text-white py-3 border-b border-gray-50 dark:border-white/5"
              onClick={(e) => scrollToSection(e, item.toLowerCase())}
            >
              {item}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-4">
             <Link to="/entry" className="w-full text-center font-bold text-gray-600 dark:text-gray-400">Log In</Link>
             <Link to="/entry" className="w-full inline-flex items-center justify-center rounded-xl py-4 text-base font-bold bg-plasma-600 border-none text-white hover:shadow-lg transition-all">
               Launch Console
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
};