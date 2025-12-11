
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('nebula-theme');
    return (saved as Theme) || 'system';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('nebula-theme', theme);
  }, [theme]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isAuthenticated, login, logout }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- Router Shim ---
const RouterContext = createContext<{ path: string; navigate: (to: string) => void }>({ 
  path: '/', 
  navigate: () => {} 
});

export const HashRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handler = () => {
       let p = window.location.hash.slice(1);
       if (!p || p === '') p = '/';
       setPath(p);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (to: string) => {
    // Manually set hash to trigger hashchange event
    window.location.hash = to;
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path } = useContext(RouterContext);
  
  let matchedElement = null;
  React.Children.forEach(children, (child) => {
    if (matchedElement) return;
    if (React.isValidElement(child)) {
      const { path: routePath, element } = child.props as any;
      
      // Exact match
      if (routePath === path) {
        matchedElement = element;
        return;
      }
      
      // Wildcard match (e.g. /console/*)
      if (routePath.endsWith('/*')) {
        const base = routePath.replace('/*', '');
        if (path.startsWith(base)) {
          matchedElement = element;
          return;
        }
      }
      
      // Parameter match (e.g. /console/projects/:id)
      if (routePath.includes('/:')) {
        const base = routePath.split('/:')[0];
        // Check if path starts with base and has something after it
        if (path.startsWith(base) && path.length > base.length) {
           matchedElement = element;
           return;
        }
      }
    }
  });
  
  return matchedElement;
};

export const Route: React.FC<{ path: string, element: React.ReactNode }> = () => null;

export const Navigate: React.FC<{ to: string, replace?: boolean }> = ({ to }) => {
  const { navigate } = useContext(RouterContext);
  useEffect(() => navigate(to), [to, navigate]);
  return null;
};

export const Link: React.FC<any> = ({ to, children, className, onClick, ...props }) => {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent) => {
    // CRITICAL: Strictly prevent default to avoid 'refused to connect' issues in iframes/sandboxes
    e.preventDefault();
    // Stop propagation to prevent any parent handlers from triggering navigation
    e.stopPropagation();
    
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a 
      href={`#${to}`} 
      className={className} 
      onClick={handleClick}
      target="_self"
      role="link"
      {...props}
    >
      {children}
    </a>
  );
};

export const useLocation = () => {
  const { path } = useContext(RouterContext);
  return { pathname: path };
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

export const useParams = () => {
  const { path } = useContext(RouterContext);
  const parts = path.split('/');
  return { id: parts[parts.length - 1] };
};
