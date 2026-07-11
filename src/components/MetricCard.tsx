import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon?: string;
}

export const MetricCard = ({ label, value, change, changePositive, icon }: MetricCardProps) => {
  return (
    <article className="metric-card">
      {icon ? <span className="metric-icon" aria-hidden="true">{icon}</span> : null}
      <div className="metric-body">
        <p className="metric-label">{label}</p>
        <p className="metric-value">{value}</p>
        {change ? (
          <p className={`metric-change ${changePositive !== undefined ? (changePositive ? 'positive' : 'negative') : ''}`}>
            {change}
          </p>
        ) : null}
      </div>
    </article>
  );
};
