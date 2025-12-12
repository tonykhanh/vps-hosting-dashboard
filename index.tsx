
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix for Recharts compatibility issues with React 18/19 imports
// Ensures hooks like useRef are available in the expected global scope for esm.sh builds
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
