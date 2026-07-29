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

type MonthKey = {
  year: number;
  monthIndex: number;
};

type MonthLike = {
  year?: number;
  monthIndex?: number;
  createdAt?: string;
  date?: string;
};

const formatKes = (amount: number) =>
  `Ksh ${Math.round(amount).toLocaleString('en-KE')}`;

const getMonthKey = (item: MonthLike): MonthKey | null => {
  if (typeof item.year === 'number' && typeof item.monthIndex === 'number') {
    return { year: item.year, monthIndex: item.monthIndex };
  }

  const raw = item.createdAt ?? item.date;
  if (!raw || raw === '-') return null;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  return {
    year: parsed.getUTCFullYear(),
    monthIndex: parsed.getUTCMonth(),
  };
};

const monthKeyOf = (item: MonthLike) => {
  const key = getMonthKey(item);
  return key ? `${key.year}-${key.monthIndex}` : null;
};

const sameMonth = (a: MonthKey | null, b: MonthLike) => {
  if (!a) return false;
  const bKey = getMonthKey(b);
  return !!bKey && a.year === bKey.year && a.monthIndex === bKey.monthIndex;
};

export const AdminRevenuePage = () => {
  const [report, setReport] = useState<AdminRevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<MonthKey | null>(null);

  const loadRevenue = async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await adminApi.getRevenue();
      setReport(next);
      const years = Array.from(
        new Set(next.monthlyRevenue.map((item) => item.year).filter((year): year is number => typeof year === 'number'))
      ).sort((a, b) => b - a);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }

      const latestWithRevenue = [...next.monthlyRevenue]
        .reverse()
        .find((item) => item.amount > 0);
      const latestMonth = latestWithRevenue ? getMonthKey(latestWithRevenue) : null;
      setSelectedMonth(latestMonth);
    } catch (err) {
      setError(toErrorMessage(err, 'Could not load revenue report.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRevenue();
  }, []);

  const yearOptions = useMemo(() => {
    if (!report) return [] as number[];
    return Array.from(
      new Set(report.monthlyRevenue.map((item) => item.year).filter((year): year is number => typeof year === 'number'))
    ).sort((a, b) => b - a);
  }, [report]);

  const monthlyRows = useMemo(() => {
    if (!report) return [];
    if (selectedYear === 'all') return report.monthlyRevenue;
    return report.monthlyRevenue.filter((item) => item.year === selectedYear);
  }, [report, selectedYear]);

  const monthlyTotal = useMemo(
    () => monthlyRows.reduce((sum, item) => sum + item.amount, 0),
    [monthlyRows]
  );

  const selectedMonthRow = useMemo(() => {
    if (!report || !selectedMonth) return null;
    return report.monthlyRevenue.find((item) => sameMonth(selectedMonth, item)) ?? null;
  }, [report, selectedMonth]);

  const monthPayments = useMemo(() => {
    if (!report || !selectedMonth) return [];
    return report.payments.filter((payment) => sameMonth(selectedMonth, payment));
  }, [report, selectedMonth]);

  const monthPaymentStats = useMemo(() => {
    const success = monthPayments.filter((payment) => payment.status === 'success');
    const pending = monthPayments.filter((payment) => payment.status === 'pending');
    const failed = monthPayments.filter((payment) => payment.status === 'failed');
    return {
      successCount: success.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      successTotal: success.reduce((sum, payment) => sum + payment.amountRaw, 0),
      pendingTotal: pending.reduce((sum, payment) => sum + payment.amountRaw, 0),
      failedTotal: failed.reduce((sum, payment) => sum + payment.amountRaw, 0),
    };
  }, [monthPayments]);

  const payments = useMemo(() => {
    const source = selectedMonth ? monthPayments : report?.payments ?? [];
    return filter === 'all' ? source : source.filter((payment) => payment.status === filter);
  }, [filter, monthPayments, report, selectedMonth]);

  const selectMonth = (item: AdminRevenueReport['monthlyRevenue'][number]) => {
    const next = getMonthKey(item);
    if (!next) return;
    setSelectedMonth((current) =>
      current && current.year === next.year && current.monthIndex === next.monthIndex ? null : next
    );
  };

  if (loading && !report) return <AdminLoading label="Loading revenue..." />;
  if (error && !report) return <AdminError message={error} onRetry={loadRevenue} />;
  if (!report) return null;

  const maxRevenue = Math.max(1, ...monthlyRows.map((item) => item.amount));

  return (
    <section className="page-stack admin-page">
      <AdminPageHeader
        title="Revenue"
        subtitle="Click any month to inspect that month’s revenue total and payment particulars."
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
            <div>
              <h2>Monthly Revenue</h2>
              <span>
                {selectedYear === 'all'
                  ? 'Last 12 months · click a month for details'
                  : `Year ${selectedYear} · click a month for details`}
              </span>
            </div>
            <div className="admin-panel-controls">
              <select
                value={selectedYear === 'all' ? 'all' : String(selectedYear)}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedYear(value === 'all' ? 'all' : Number(value));
                  setSelectedMonth(null);
                }}
                aria-label="Select revenue year"
              >
                <option value="all">All months</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="admin-segmented" role="group" aria-label="Monthly revenue view">
                <button
                  type="button"
                  className={viewMode === 'chart' ? 'is-active' : undefined}
                  onClick={() => setViewMode('chart')}
                >
                  Chart
                </button>
                <button
                  type="button"
                  className={viewMode === 'table' ? 'is-active' : undefined}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {monthlyRows.length === 0 ? (
            <EmptyAdminState title="No monthly revenue yet" />
          ) : viewMode === 'chart' ? (
            <div className="admin-chart">
              {monthlyRows.map((item) => {
                const active = sameMonth(selectedMonth, item);
                return (
                  <button
                    type="button"
                    className={`admin-chart-item admin-chart-item-btn${active ? ' is-selected' : ''}`}
                    key={monthKeyOf(item) ?? item.month}
                    onClick={() => selectMonth(item)}
                    aria-pressed={active}
                    title={`View ${item.month} details`}
                  >
                    <div className="admin-chart-track">
                      <span style={{ height: `${Math.max(8, (item.amount / maxRevenue) * 100)}%` }} />
                    </div>
                    <small>{item.monthShort ?? item.month}</small>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <table className="admin-monthly-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...monthlyRows].reverse().map((item) => {
                    const active = sameMonth(selectedMonth, item);
                    return (
                      <tr
                        key={`${monthKeyOf(item) ?? item.month}-row`}
                        className={active ? 'is-selected' : undefined}
                      >
                        <td>{item.month}</td>
                        <td><strong>{item.amountFormatted ?? formatKes(item.amount)}</strong></td>
                        <td>
                          <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => selectMonth(item)}
                          >
                            {active ? 'Selected' : 'View'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="admin-monthly-total">
                <span>Period total</span>
                <span>{formatKes(monthlyTotal)}</span>
              </div>
            </>
          )}
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

      {selectedMonthRow ? (
        <article className="admin-panel admin-month-detail">
          <div className="admin-panel-header">
            <div>
              <h2>{selectedMonthRow.month} particulars</h2>
              <span>
                {monthPayments.length} payment{monthPayments.length === 1 ? '' : 's'} in this month
              </span>
            </div>
            <button type="button" className="outline-btn" onClick={() => setSelectedMonth(null)}>
              Clear month
            </button>
          </div>

          <div className="stat-grid admin-metrics-grid admin-month-metrics">
            <MetricCard
              label="Month revenue"
              value={selectedMonthRow.amountFormatted ?? formatKes(selectedMonthRow.amount)}
            />
            <MetricCard
              label="Successful"
              value={formatKes(monthPaymentStats.successTotal)}
              change={`${monthPaymentStats.successCount} payments`}
              changePositive
            />
            <MetricCard
              label="Pending"
              value={formatKes(monthPaymentStats.pendingTotal)}
              change={`${monthPaymentStats.pendingCount} payments`}
            />
            <MetricCard
              label="Failed"
              value={formatKes(monthPaymentStats.failedTotal)}
              change={`${monthPaymentStats.failedCount} payments`}
              changePositive={false}
            />
          </div>
        </article>
      ) : null}

      <article className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>{selectedMonthRow ? `${selectedMonthRow.month} payments` : 'Payment History'}</h2>
            <span>
              {selectedMonthRow
                ? 'Particulars for the selected month'
                : 'Select a month above to focus this list'}
            </span>
          </div>
          <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
            {PAYMENT_FILTERS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="admin-table-wrap">
          {payments.length === 0 ? (
            <EmptyAdminState
              title="No payments found"
              subtitle={selectedMonthRow ? 'No payments recorded for this month.' : 'Try a different payment filter.'}
            />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>M-Pesa</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.provider}</strong>
                      {payment.phoneNumber ? <div className="admin-table-sub">{payment.phoneNumber}</div> : null}
                    </td>
                    <td>{payment.plan}</td>
                    <td>{payment.amount}</td>
                    <td><StatusBadge status={payment.status} /></td>
                    <td>
                      {payment.mpesaReceiptNumber || payment.method || '—'}
                    </td>
                    <td>{formatDateTime(payment.createdAt ?? payment.date)}</td>
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
