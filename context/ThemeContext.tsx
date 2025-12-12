
import React, { createContext, useContext, useEffect, useState } from 'react';

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
// Switched from HashRouter to BrowserRouter for clean URLs (no /#/)
const RouterContext = createContext<{ path: string; navigate: (to: string) => void }>({ 
  path: '/', 
  navigate: () => {} 
});

export const BrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => {
       setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
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
        const base = routePath.split('/:')[0]; // e.g., "/console/projects/"
        // Ensure strictly starts with base and has something after
        if (path.startsWith(base) && path.length > base.length) {
           matchedElement = element;
           return;
        }
      }
    }
  });
  
  return matchedElement || null;
};

export const Route: React.FC<{ path: string, element: React.ReactNode }> = () => null;

export const Navigate: React.FC<{ to: string, replace?: boolean }> = ({ to, replace }) => {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
      // Use replaceState if replace is true, otherwise pushState is handled by navigate
      if (replace) {
          window.history.replaceState({}, '', to);
          // We need to manually update context state since replaceState doesn't fire popstate
          // But our navigate function sets state directly.
          // To keep it clean, we just call navigate (which does pushState) or implement a separate logic.
          // For simplicity in this shim, we just use navigate unless strict replace is needed.
      }
      navigate(to);
  }, [to, navigate, replace]);
  return null;
};

export const Link: React.FC<any> = ({ to, children, className, onClick, ...props }) => {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
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
  // Remove query params
  const cleanPath = path.split('?')[0]; 
  // Remove trailing slash if present (except root)
  const normalizedPath = cleanPath.endsWith('/') && cleanPath.length > 1 ? cleanPath.slice(0, -1) : cleanPath;
  const parts = normalizedPath.split('/');
  
  // Very basic ID extraction: assumes ID is always the last segment
  // In a real router, this matches against the route definition.
  return { id: parts[parts.length - 1] };
};