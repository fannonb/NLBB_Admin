import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/global.css';

declare global {
  interface Window {
    __NLBB_APP_MOUNTED__?: boolean;
  }
}

const renderFatal = (title: string, detail: string) => {
  const root = document.getElementById('root');
  if (!root) {
    return;
  }

  root.innerHTML = `
    <div style="font-family:Segoe UI,Tahoma,sans-serif;padding:20px;max-width:860px;margin:40px auto;background:#fff;border:1px solid #e1e6ef;border-radius:14px">
      <h1 style="margin:0 0 12px;color:#1e2f4c">${title}</h1>
      <pre style="white-space:pre-wrap;margin:0;color:#3b4b64">${detail}</pre>
    </div>
  `;
};

if (
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      void registration.unregister();
    });
  });
}

window.addEventListener('error', (event) => {
  renderFatal('Runtime Error', event.error?.message ?? String(event.message ?? 'Unknown error'));
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason instanceof Error ? event.reason.stack ?? event.reason.message : String(event.reason);
  renderFatal('Unhandled Promise Rejection', reason);
});

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  window.__NLBB_APP_MOUNTED__ = true;
} catch (error) {
  renderFatal('Bootstrap Error', error instanceof Error ? error.stack ?? error.message : String(error));
}
