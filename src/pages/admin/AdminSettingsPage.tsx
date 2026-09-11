import React, { useEffect, useState } from 'react';
import { ConfirmModal } from '../../components/Modal';
import { showToast } from '../../components/Toast';
import { adminApi, AdminSubscriptionSettings } from '../../lib/api/admin';
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  formatDateTime,
  toErrorMessage,
} from './AdminShared';

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<AdminSubscriptionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [pendingPause, setPendingPause] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getSettings();
      setSettings(data);
      setReason(data.pauseReason ?? '');
    } catch (err) {
      setError(toErrorMessage(err, 'Could not load subscription settings.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const runToggle = async () => {
    if (pendingPause === null) return;
    setSaving(true);
    try {
      const data = await adminApi.setSubscriptionsPaused(pendingPause, reason);
      setSettings(data);
      setReason(data.pauseReason ?? '');
      showToast(pendingPause ? 'All subscriptions paused. Remaining days are frozen.' : 'Subscriptions reinstated with remaining days restored.', 'success');
    } catch (err) {
      showToast(toErrorMessage(err, 'Could not update subscriptions.'), 'error');
    } finally {
      setPendingPause(null);
      setSaving(false);
    }
  };

  if (loading && !settings) return <AdminLoading label="Loading subscription settings..." />;
  if (error && !settings) return <AdminError message={error} onRetry={loadSettings} />;
  if (!settings) return null;

  return (
    <section className="page-stack admin-page">
      <AdminPageHeader
        title="Subscription controls"
        subtitle="Pause every provider subscription at once, or reinstate them with the remaining paid days restored."
        action={<button type="button" className="outline-btn" onClick={loadSettings}>Refresh</button>}
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className={`admin-callout ${settings.subscriptionsPaused ? 'is-paused' : ''}`}>
        <h2>{settings.subscriptionsPaused ? 'Subscriptions are paused for all providers' : 'Subscriptions are running'}</h2>
        <p>
          {settings.subscriptionsPaused
            ? `Paid time is frozen. ${settings.frozenPaidCount} provider${settings.frozenPaidCount === 1 ? '' : 's'} still have remaining days that will resume on reinstatement.${settings.pausedAt ? ` Paused ${formatDateTime(settings.pausedAt)}.` : ''}`
            : 'Providers with an active plan stay visible and can accept bookings. Individual account pauses still apply from the Providers page.'}
        </p>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-header">
          <h2>All accounts</h2>
          <span>{settings.pausedAccountCount} individually paused</span>
        </div>
        <div className="admin-settings-form">
          <label>
            Reason (optional)
            <textarea
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Shown in admin logs, for example maintenance or billing review"
            />
          </label>
          {settings.subscriptionsPaused ? (
            <button type="button" className="outline-btn" disabled={saving} onClick={() => setPendingPause(false)}>
              Reinstate all subscriptions
            </button>
          ) : (
            <button type="button" className="ghost-btn" disabled={saving} onClick={() => setPendingPause(true)}>
              Pause all subscriptions
            </button>
          )}
        </div>
      </article>

      <ConfirmModal
        visible={pendingPause !== null}
        title={pendingPause ? 'Pause all subscriptions?' : 'Reinstate all subscriptions?'}
        message={
          pendingPause
            ? 'Providers will be hidden from customer booking until you reinstate. Remaining paid days are frozen and restored when this is turned off.'
            : 'Providers with remaining paid days become active again from this moment. Individually paused accounts stay paused until you resume them on the Providers page.'
        }
        confirmLabel={pendingPause ? 'Pause all' : 'Reinstate'}
        destructive={pendingPause === true}
        onDismiss={() => setPendingPause(null)}
        onConfirm={runToggle}
      />
    </section>
  );
};
