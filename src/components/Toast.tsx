import React, { useEffect, useState, useCallback } from 'react';

export interface ToastEntry {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastTrigger: ((entry: ToastEntry) => void) | null = null;

export const showToast = (message: string, type: ToastEntry['type'] = 'info') => {
  toastTrigger?.({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    message,
    type,
  });
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const addToast = useCallback((entry: ToastEntry) => {
    setToasts((prev) => [...prev, entry]);
  }, []);

  useEffect(() => {
    toastTrigger = addToast;
    return () => {
      toastTrigger = null;
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onDismiss }: { toast: ToastEntry; onDismiss: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icon = toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ';

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{toast.message}</span>
      <button type="button" className="toast-dismiss" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};
