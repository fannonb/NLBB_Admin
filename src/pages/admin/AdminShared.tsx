import React from 'react';

export const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const formatDateTime = (value?: string | null) => {
  if (!value || value === '-') return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatNumber = (value: number) => value.toLocaleString('en-KE');

export const statusTone = (status: string) => {
  if (['approved', 'active', 'success'].includes(status)) return 'success';
  if (['pending'].includes(status)) return 'warning';
  if (['suspended', 'disabled', 'failed', 'expired'].includes(status)) return 'danger';
  return 'neutral';
};

export const StatusBadge = ({ status }: { status: string }) => (
  <span className={`admin-badge admin-badge-${statusTone(status)}`}>{status}</span>
);

export const AdminPageHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) => (
  <header className="admin-page-header">
    <div>
      <p className="admin-kicker">NLBB Admin</p>
      <h1>{title}</h1>
      <p className="subtle">{subtitle}</p>
    </div>
    {action ? <div className="admin-page-action">{action}</div> : null}
  </header>
);

export const AdminLoading = ({ label = 'Loading admin data...' }: { label?: string }) => (
  <div className="admin-state">
    <span className="spinner" aria-hidden="true" />
    <p>{label}</p>
  </div>
);

export const AdminError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="admin-state admin-state-error">
    <p>{message}</p>
    <button type="button" className="outline-btn" onClick={onRetry}>
      Retry
    </button>
  </div>
);

export const EmptyAdminState = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="admin-empty">
    <p className="admin-empty-title">{title}</p>
    {subtitle ? <p className="subtle">{subtitle}</p> : null}
  </div>
);
