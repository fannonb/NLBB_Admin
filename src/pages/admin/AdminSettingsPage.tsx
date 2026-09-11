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
      showToast(
        pendingPause
          ? 'Subscription payments paused. Every provider now has complimentary premium access.'
          : 'Payments are required again. Remaining paid days have been restored.',
        'success'
      );
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
        title="Subscription payments"
        subtitle="Pause charging without cutting access. Every new and existing provider stays on premium until you require payment again."
        action={<button type="button" className="outline-btn" onClick={loadSettings}>Refresh</button>}
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className={`admin-callout ${settings.subscriptionsPaused ? 'is-paused' : ''}`}>
        <h2>{settings.subscriptionsPaused ? 'Payments are paused — all providers have complimentary access' : 'Payments are required'}</h2>
        <p>
          {settings.subscriptionsPaused
            ? `Listings stay live and bookings stay open. Paid time is frozen. ${settings.frozenPaidCount} provider${settings.frozenPaidCount === 1 ? '' : 's'} still have remaining days that resume when you switch payments back on.${settings.pausedAt ? ` Paused ${formatDateTime(settings.pausedAt)}.` : ''}`
            : 'Providers need an active paid plan to stay visible and accept bookings. You can still grant complimentary access to one account from the Providers page.'}
        </p>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-header">
          <h2>All accounts</h2>
          <span>{settings.pausedAccountCount} individually complimentary</span>
        </div>
        <div className="admin-settings-form">
          <label>
            Reason (optional)
            <textarea
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Shown in admin logs, for example launch promo or billing hold"
            />
          </label>
          {settings.subscriptionsPaused ? (
            <button type="button" className="outline-btn" disabled={saving} onClick={() => setPendingPause(false)}>
              Require payments again
            </button>
          ) : (
            <button type="button" className="ghost-btn" disabled={saving} onClick={() => setPendingPause(true)}>
              Pause all subscription payments
            </button>
          )}
        </div>
      </article>

      <ConfirmModal
        visible={pendingPause !== null}
        title={pendingPause ? 'Pause subscription payments?' : 'Require payments again?'}
        message={
          pendingPause
            ? 'Every provider — new and existing — gets complimentary premium access. Paid remaining days freeze and do not burn while this is on.'
            : 'Providers with remaining paid days stay active from this moment. Anyone without remaining days loses premium access. Accounts you granted free access to individually stay complimentary until you require payment on the Providers page.'
        }
        confirmLabel={pendingPause ? 'Pause payments' : 'Require payments'}
        destructive={pendingPause === false}
        onDismiss={() => setPendingPause(null)}
        onConfirm={runToggle}
      />
    </section>
  );
};
