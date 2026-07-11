import React, { useEffect, useMemo, useState } from 'react';
import { MetricCard } from '../../components/MetricCard';
import { adminApi, AdminRevenueReport, PaymentStatus } from '../../lib/api/admin';
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  EmptyAdminState,
  StatusBadge,
  formatDateTime,
  toErrorMessage,
} from './AdminShared';

const PAYMENT_FILTERS: Array<{ label: string; value: 'all' | PaymentStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Success', value: 'success' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
];

export const AdminRevenuePage = () => {
  const [report, setReport] = useState<AdminRevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');

  const loadRevenue = async () => {
    setLoading(true);
    setError(null);
    try {
      setReport(await adminApi.getRevenue());
    } catch (err) {
      setError(toErrorMessage(err, 'Could not load revenue report.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRevenue();
  }, []);

  const payments = useMemo(() => {
    if (!report) return [];
    return filter === 'all' ? report.payments : report.payments.filter((payment) => payment.status === filter);
  }, [filter, report]);

  if (loading && !report) return <AdminLoading label="Loading revenue..." />;
  if (error && !report) return <AdminError message={error} onRetry={loadRevenue} />;
  if (!report) return null;

  const maxRevenue = Math.max(1, ...report.monthlyRevenue.map((item) => item.amount));

  return (
    <section className="page-stack admin-page">
      <AdminPageHeader
        title="Revenue"
        subtitle="Monitor subscription collections, failed payments, pending transactions, and plan performance."
        action={<button type="button" className="outline-btn" onClick={loadRevenue}>Refresh</button>}
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className="stat-grid admin-metrics-grid">
        <MetricCard label="Total Revenue" value={report.summary.totalRevenue} />
        <MetricCard label="This Month" value={report.summary.thisMonth} change={report.summary.monthOverMonthNote} />
        <MetricCard label="Active Subscribers" value={report.summary.activeSubscribers} />
        <MetricCard label="Pending" value={report.summary.pendingAmount} />
        <MetricCard label="Failed" value={report.summary.failedAmount} />
      </div>

      <div className="admin-grid-two">
        <article className="admin-panel">
          <div className="admin-panel-header">
            <h2>Monthly Revenue</h2>
            <span>Last 6 months</span>
          </div>
          <div className="admin-chart">
            {report.monthlyRevenue.map((item) => (
              <div className="admin-chart-item" key={item.month}>
                <div className="admin-chart-track">
                  <span style={{ height: `${Math.max(8, (item.amount / maxRevenue) * 100)}%` }} />
                </div>
                <small>{item.month}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-header">
            <h2>Plans</h2>
            <span>Subscription mix</span>
          </div>
          <div className="admin-list">
            {report.plans.length === 0 ? (
              <EmptyAdminState title="No plan revenue yet" />
            ) : (
              report.plans.map((plan) => (
                <div className="admin-progress-row" key={plan.name}>
                  <div>
                    <strong>{plan.name}</strong>
                    <span>{plan.count} payments - {plan.revenue}</span>
                  </div>
                  <div className="admin-progress-track">
                    <span style={{ width: `${Math.max(4, plan.percent)}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-header">
          <h2>Payment History</h2>
          <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
            {PAYMENT_FILTERS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="admin-table-wrap">
          {payments.length === 0 ? (
            <EmptyAdminState title="No payments found" subtitle="Try a different payment filter." />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td><strong>{payment.provider}</strong></td>
                    <td>{payment.plan}</td>
                    <td>{payment.amount}</td>
                    <td><StatusBadge status={payment.status} /></td>
                    <td>{formatDateTime(payment.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>
    </section>
  );
};
