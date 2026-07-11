import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon = '📭', title, subtitle, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <p className="empty-state-title">{title}</p>
      {subtitle ? <p className="empty-state-subtitle">{subtitle}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className="primary-btn" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};
