
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// --- Theme Context ---
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
    try {
      const saved = localStorage.getItem('nebula-theme');
      return (saved as Theme) || 'system';
    } catch (e) {
      return 'system';
    }
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
    
    try {
      localStorage.setItem('nebula-theme', theme);
    } catch (e) {
      // Ignore storage errors
    }
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

// --- Router Shim (History API Version) ---
const RouterContext = createContext<{ 
  path: string; 
  state: any;
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void 
}>({ 
  path: '/', 
  state: null,
  navigate: () => {} 
});

export const BrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => {
    try {
      return window.location.pathname || '/';
    } catch {
      return '/';
    }
  });

  const [state, setState] = useState(() => {
    try {
      return window.history.state;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handler = () => {
       try {
         setPath(window.location.pathname);
         setState(window.history.state);
       } catch {}
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean; state?: any }) => {
    try {
      if (options?.replace) {
        window.history.replaceState(options.state || null, '', to);
      } else {
        window.history.pushState(options.state || null, '', to);
      }
    } catch (e) {
      // Ignore security errors in sandboxed environments (e.g. iframe/blob)
      console.warn('Navigation URL update prevented by environment:', e);
    }
    setPath(to);
    setState(options?.state || null);
  }, []);

  return (
    <RouterContext.Provider value={{ path, state, navigate }}>
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
      
      // Wildcard match
      if (routePath && routePath.endsWith('/*')) {
        const base = routePath.replace('/*', '');
        if (path.startsWith(base)) {
          matchedElement = element;
          return;
        }
      }
      
      // Parameter match (Simple implementation)
      if (routePath && routePath.includes('/:')) {
        const base = routePath.split('/:')[0];
        if (path.startsWith(base) && path.length > base.length) {
           matchedElement = element;
           return;
        }
      }
      
      // Catch-all match (path="*")
      if (routePath === '*') {
        matchedElement = element;
        return;
      }
    }
  });
  
  // Wrap in Fragment to ensure it's treated as a valid React Node and avoid #31 error
  return matchedElement ? <>{matchedElement}</> : null;
};

export const Route: React.FC<{ path: string, element: React.ReactNode }> = () => null;

export const Navigate: React.FC<{ to: string, replace?: boolean }> = ({ to, replace }) => {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
      navigate(to, { replace });
  }, [to, navigate, replace]);
  return null;
};

export const Link: React.FC<any> = ({ to, children, className, onClick, ...props }) => {
  const { navigate } = useContext(RouterContext);

  const isExternal = to && (to.startsWith('http') || to.startsWith('//') || to.startsWith('mailto:'));

  const handleClick = (e: React.MouseEvent) => {
    if (isExternal) return;
    
    // Allow default behavior for modifier keys (new tab, etc)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a 
      href={to} 
      className={className} 
      onClick={handleClick} 
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export const useLocation = () => {
  const { path, state } = useContext(RouterContext);
  return { pathname: path, state };
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

export const useParams = () => {
  const { path } = useContext(RouterContext);
  const cleanPath = path.split('?')[0]; 
  const normalizedPath = cleanPath.endsWith('/') && cleanPath.length > 1 ? cleanPath.slice(0, -1) : cleanPath;
  const parts = normalizedPath.split('/');
  return { id: parts[parts.length - 1] };
};
