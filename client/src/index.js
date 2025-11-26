import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

console.log('index.js loaded');
console.log('Root element:', document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('Root created');

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('App rendered');
} catch (error) {
  console.error('Error rendering app:', error);
}

