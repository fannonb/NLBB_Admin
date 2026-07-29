import React, { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../components/Modal';
import { showToast } from '../../components/Toast';
import { adminApi, AdminUserRecord, AdminUserRole, AdminUserStatus } from '../../lib/api/admin';
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  EmptyAdminState,
  StatusBadge,
  formatDateTime,
  toErrorMessage,
} from './AdminShared';

type UserAction = {
  user: AdminUserRecord;
  status?: AdminUserStatus;
  delete?: boolean;
};

const ROLE_FILTERS: Array<{ label: string; value: 'all' | AdminUserRole | 'disabled' }> = [
  { label: 'All', value: 'all' },
  { label: 'Customers', value: 'customer' },
  { label: 'Providers', value: 'provider' },
  { label: 'Admins', value: 'admin' },
  { label: 'Disabled', value: 'disabled' },
];

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | AdminUserRole | 'disabled'>('all');
  const [pendingAction, setPendingAction] = useState<UserAction | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await adminApi.listUsers());
    } catch (err) {
      setError(toErrorMessage(err, 'Could not load users.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'disabled' ? user.status === 'disabled' : user.role === filter);
      const matchesQuery =
        !normalized ||
        [user.name, user.email, user.phone, user.location].join(' ').toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, users]);

  const runAction = async () => {
    if (!pendingAction) return;
    const { user, status } = pendingAction;
    setActioningId(user.id);
    try {
      if (pendingAction.delete) {
        await adminApi.deleteUser(user.id);
        setUsers((current) => current.filter((item) => item.id !== user.id));
        showToast('User permanently deleted.', 'success');
      } else if (status) {
        const updated = await adminApi.updateUserStatus(user.id, status);
        setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, ...updated, status } : item)));
        showToast(`User ${status}.`, 'success');
      }
    } catch (err) {
      showToast(toErrorMessage(err, 'User action failed.'), 'error');
    } finally {
      setPendingAction(null);
      setActioningId(null);
    }
  };

  if (loading && users.length === 0) return <AdminLoading label="Loading users..." />;
  if (error && users.length === 0) return <AdminError message={error} onRetry={loadUsers} />;

  const actionLabel = pendingAction?.delete
    ? 'Delete forever'
    : pendingAction?.status === 'active'
      ? 'Enable'
      : 'Disable';

  return (
    <section className="page-stack admin-page">
      <AdminPageHeader
        title="Users"
        subtitle="Search accounts, disable access temporarily, or permanently delete an account."
        action={<button type="button" className="outline-btn" onClick={loadUsers}>Refresh</button>}
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." />
        <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          {ROLE_FILTERS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        {filtered.length === 0 ? (
          <EmptyAdminState title="No users found" subtitle="Try a different search or role filter." />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Bookings</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-entity">
                      <img src={user.avatar} alt="" />
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                        <span>{user.phone} - {user.location}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="admin-badge admin-badge-neutral">{user.role}</span></td>
                  <td><StatusBadge status={user.status} /></td>
                  <td>{user.bookingsCount}</td>
                  <td>{formatDateTime(user.joinedAt)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="outline-btn"
                        disabled={actioningId === user.id}
                        onClick={() => setPendingAction({ user, status: user.status === 'active' ? 'disabled' : 'active' })}
                      >
                        {user.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        className="ghost-btn danger-link"
                        disabled={actioningId === user.id}
                        onClick={() => setPendingAction({ user, delete: true })}
                      >
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
        title={`${actionLabel} User`}
        message={
          pendingAction?.delete
            ? `Permanently delete ${pendingAction.user.name}? This wipes the account and related data. This cannot be undone.`
            : `${actionLabel} ${pendingAction?.user.name}?`
        }
        confirmLabel={actionLabel}
        destructive={pendingAction?.delete || pendingAction?.status === 'disabled'}
        onDismiss={() => setPendingAction(null)}
        onConfirm={runAction}
      />
    </section>
  );
};
