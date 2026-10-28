import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Registro do Service Worker para suporte a PWA Offline e Instalação
if ('serviceWorker' in navigator && !window.location.host.includes('localhost:517300')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('PWA Service Worker notice:', err);
    });
  });
}
