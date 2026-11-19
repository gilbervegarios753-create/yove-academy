import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { OfflineProvider } from './context/OfflineContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Global error handler to shield benign dev server WebSocket / Vite HMR rejections
window.addEventListener('error', (event) => {
  const msg = String(event.message || event.error || '');
  if (
    msg.includes('WebSocket') ||
    msg.includes('failed to connect') ||
    msg.includes('closed without opened') ||
    msg.includes('vite')
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event.reason?.message || event.reason?.stack || event.reason || '');
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('failed to connect') ||
    reasonStr.includes('closed without opened') ||
    reasonStr.includes('vite')
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);

// Register PWA Service Worker in production; unregister in development to prevent caching Vite dev modules
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registrado exitosamente:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Error al registrar Service Worker:', err);
        });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <OfflineProvider>
            <App />
          </OfflineProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);

