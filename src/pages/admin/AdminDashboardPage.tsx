import React, { useEffect, useState } from 'react';
import { MetricCard } from '../../components/MetricCard';
import { adminApi, AdminDashboardData } from '../../lib/api/admin';
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  EmptyAdminState,
  StatusBadge,
  formatNumber,
  toErrorMessage,
} from './AdminShared';

export const AdminDashboardPage = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await adminApi.getDashboard());
    } catch (err) {
      setError(toErrorMessage(err, 'Could not load admin dashboard.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (loading && !data) return <AdminLoading />;
  if (error && !data) return <AdminError message={error} onRetry={loadDashboard} />;
  if (!data) return null;

  const maxRevenue = Math.max(1, ...data.monthlyRevenue.map((item) => item.amount));
  const maxSignups = Math.max(1, ...data.weeklySignups.map((item) => item.customers + item.providers));

  return (
    <section className="page-stack admin-page">
      <AdminPageHeader
        title="Overview"
        subtitle="Live operational snapshot for provider approvals, customer growth, bookings, and subscription revenue."
        action={
          <button type="button" className="outline-btn" onClick={loadDashboard}>
            Refresh
          </button>
        }
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className="stat-grid admin-metrics-grid">
        <MetricCard label="Customers" value={formatNumber(data.metrics.totalUsers)} />
        <MetricCard label="Active Providers" value={formatNumber(data.metrics.activeProviders)} />
        <MetricCard label="This Month" value={data.metrics.monthlyRevenue} change={data.metrics.revenueTrendNote} />
        <MetricCard label="Bookings" value={formatNumber(data.metrics.totalBookings)} />
        <MetricCard label="Pending Providers" value={formatNumber(data.metrics.pendingProviders)} />
        <MetricCard label="Subscriptions" value={formatNumber(data.metrics.activeSubscriptions)} change={data.metrics.subscriptionBadge} />
      </div>

      <div className="admin-grid-two">
        <article className="admin-panel">
          <div className="admin-panel-header">
            <h2>Revenue Trend</h2>
            <span>{data.metrics.ytdRevenue ?? 'Year to date'}</span>
          </div>
          <div className="admin-chart">
            {data.monthlyRevenue.map((item) => (
              <div className="admin-chart-item" key={`${item.year ?? 'y'}-${item.month}`}>
                <div className="admin-chart-track">
                  <span style={{ height: `${Math.max(8, (item.amount / maxRevenue) * 100)}%` }} />
                </div>
                <small>{item.monthShort ?? item.month}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-header">
            <h2>Signups</h2>
            <span>Customers and providers</span>
          </div>
          <div className="admin-list">
            {data.weeklySignups.map((item) => {
              const total = item.customers + item.providers;
              return (
                <div className="admin-progress-row" key={item.day}>
                  <div>
                    <strong>{item.day}</strong>
                    <span>{total} total</span>
                  </div>
                  <div className="admin-progress-track">
                    <span style={{ width: `${Math.max(4, (total / maxSignups) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      <div className="admin-grid-two">
        <article className="admin-panel">
          <div className="admin-panel-header">
            <h2>Pending Providers</h2>
            <span>{data.pendingProviders.length} waiting</span>
          </div>
          {data.pendingProviders.length === 0 ? (
            <EmptyAdminState title="No pending providers" subtitle="New applications will appear here." />
          ) : (
            <div className="admin-list">
              {data.pendingProviders.slice(0, 6).map((provider) => (
                <div className="admin-list-row" key={provider.id}>
                  <div>
                    <strong>{provider.name}</strong>
                    <span>{provider.category} - {provider.location}</span>
                  </div>
                  <StatusBadge status={provider.status} />
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-panel">
          <div className="admin-panel-header">
            <h2>Activity</h2>
            <span>Recent platform events</span>
          </div>
          {data.activity.length === 0 ? (
            <EmptyAdminState title="No recent activity" />
          ) : (
            <div className="admin-timeline">
              {data.activity.map((event) => (
                <div className="admin-timeline-item" key={event.id}>
                  <span className="admin-timeline-dot" style={{ backgroundColor: event.color }} />
                  <div>
                    <strong>{event.text}</strong>
                    <span>{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
};
