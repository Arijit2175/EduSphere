import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/polish.css'
import App from './App.jsx'

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((reg) => {
      console.log('[Main] Service Worker registered:', reg.scope);
      
      // Check for updates periodically
      setInterval(() => {
        reg.update();
      }, 60000); // Check every minute
    })
    .catch((err) => {
      console.log('[Main] Service Worker registration failed:', err);
    });
}

// Preconnect to API endpoint for faster requests
const link = document.createElement('link');
link.rel = 'preconnect';
link.href = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
document.head.appendChild(link);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
