import React, { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../components/Modal';
import { showToast } from '../../components/Toast';
import { adminApi, AdminProviderRecord, AdminProviderStatus } from '../../lib/api/admin';
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  EmptyAdminState,
  StatusBadge,
  formatDateTime,
  toErrorMessage,
} from './AdminShared';

type ProviderAction = {
  provider: AdminProviderRecord;
  status?: AdminProviderStatus;
  delete?: boolean;
  pauseSubscription?: boolean;
  resumeSubscription?: boolean;
};

const FILTERS: Array<{ label: string; value: 'all' | AdminProviderStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Suspended', value: 'suspended' },
];

export const AdminProvidersPage = () => {
  const [providers, setProviders] = useState<AdminProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | AdminProviderStatus>('all');
  const [pendingAction, setPendingAction] = useState<ProviderAction | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      setProviders(await adminApi.listProviders());
    } catch (err) {
      setError(toErrorMessage(err, 'Could not load providers.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProviders();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return providers.filter((provider) => {
      const matchesStatus = filter === 'all' || provider.status === filter;
      const matchesQuery =
        !normalized ||
        [provider.name, provider.category, provider.location, provider.email, provider.phone]
          .join(' ')
          .toLowerCase()
          .includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [filter, providers, query]);

  const runAction = async () => {
    if (!pendingAction) return;
    const { provider, status } = pendingAction;
    setActioningId(provider.id);
    try {
      if (pendingAction.delete) {
        await adminApi.deleteProvider(provider.id);
        setProviders((current) => current.filter((item) => item.id !== provider.id));
        showToast('Provider permanently deleted.', 'success');
      } else if (pendingAction.pauseSubscription) {
        await adminApi.pauseProviderSubscription(provider.id);
        await loadProviders();
        showToast('Payments paused. This provider has complimentary premium access.', 'success');
      } else if (pendingAction.resumeSubscription) {
        await adminApi.resumeProviderSubscription(provider.id);
        await loadProviders();
        showToast('Payments required again. Remaining paid days are restored.', 'success');
      } else if (status) {
        const updated = await adminApi.updateProviderStatus(provider.id, status);
        setProviders((current) => current.map((item) => (item.id === provider.id ? { ...item, ...updated, status } : item)));
        showToast(`Provider ${status}.`, 'success');
      }
    } catch (err) {
      showToast(toErrorMessage(err, 'Provider action failed.'), 'error');
    } finally {
      setPendingAction(null);
      setActioningId(null);
    }
  };

  if (loading && providers.length === 0) return <AdminLoading label="Loading providers..." />;
  if (error && providers.length === 0) return <AdminError message={error} onRetry={loadProviders} />;

  const actionLabel = pendingAction?.delete
    ? 'Delete forever'
    : pendingAction?.pauseSubscription
      ? 'Grant free access'
      : pendingAction?.resumeSubscription
        ? 'Require payment'
        : pendingAction?.status === 'approved'
          ? 'Approve'
          : pendingAction?.status === 'suspended'
            ? 'Suspend'
            : 'Update';

  return (
    <section className="page-stack admin-page">
      <AdminPageHeader
        title="Providers"
        subtitle="Review applications, grant complimentary premium access without charging, or suspend a listing."
        action={<button type="button" className="outline-btn" onClick={loadProviders}>Refresh</button>}
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search providers..." />
        <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          {FILTERS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        {filtered.length === 0 ? (
          <EmptyAdminState title="No providers found" subtitle="Try a different search or status filter." />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Status</th>
                <th>Subscription</th>
                <th>Bookings</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((provider) => (
                <tr key={provider.id}>
                  <td>
                    <div className="admin-entity">
                      <img src={provider.avatar} alt="" />
                      <div>
                        <strong>{provider.name}</strong>
                        <span>{provider.category} - {provider.location}</span>
                        <span>{provider.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={provider.status} /></td>
                  <td>
                    <StatusBadge status={provider.subscriptionStatus} />
                    {provider.subscriptionStatus === 'complimentary' && (provider.remainingDays ?? 0) > 0 ? (
                      <span className="admin-sub-meta">{provider.remainingDays} day{provider.remainingDays === 1 ? '' : 's'} remaining</span>
                    ) : null}
                  </td>
                  <td>{provider.bookingsCount}</td>
                  <td>{formatDateTime(provider.appliedAt)}</td>
                  <td>
                    <div className="admin-row-actions">
                      {provider.status !== 'approved' ? (
                        <button type="button" className="outline-btn" disabled={actioningId === provider.id} onClick={() => setPendingAction({ provider, status: 'approved' })}>
                          Approve
                        </button>
                      ) : null}
                      {provider.status !== 'suspended' ? (
                        <button type="button" className="ghost-btn" disabled={actioningId === provider.id} onClick={() => setPendingAction({ provider, status: 'suspended' })}>
                          Suspend
                        </button>
                      ) : null}
                      {provider.subscriptionPauseScope === 'account' || provider.subscriptionPauseScope === 'both' ? (
                        <button type="button" className="outline-btn" disabled={actioningId === provider.id} onClick={() => setPendingAction({ provider, resumeSubscription: true })}>
                          Require payment
                        </button>
                      ) : (
                        <button type="button" className="ghost-btn" disabled={actioningId === provider.id} onClick={() => setPendingAction({ provider, pauseSubscription: true })}>
                          Grant free access
                        </button>
                      )}
                      <button type="button" className="ghost-btn danger-link" disabled={actioningId === provider.id} onClick={() => setPendingAction({ provider, delete: true })}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        visible={!!pendingAction}
        title={`${actionLabel} Provider`}
        message={
          pendingAction?.delete
            ? `Permanently delete ${pendingAction.provider.name}? This wipes the provider listing and the linked owner account. This cannot be undone.`
            : pendingAction?.pauseSubscription
              ? `Pause payments for ${pendingAction.provider.name}? They keep premium access without paying. Remaining paid days stay frozen until you require payment again.`
              : pendingAction?.resumeSubscription
                ? `Require payment again for ${pendingAction.provider.name}? Remaining paid days start counting from now. If none remain, premium access ends.`
                : `${actionLabel} ${pendingAction?.provider.name}?`
        }
        confirmLabel={actionLabel}
        destructive={pendingAction?.delete || pendingAction?.status === 'suspended' || pendingAction?.resumeSubscription}
        onDismiss={() => setPendingAction(null)}
        onConfirm={runAction}
      />
    </section>
  );
};
