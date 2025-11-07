import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress extension console errors
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('MetaMask')) {
    return;
  }
  originalError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);