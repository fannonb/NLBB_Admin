import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types';

const routeByRole = (role: UserRole | null) => {
  if (role === 'provider') {
    return '/provider/dashboard';
  }
  if (role === 'admin') {
    return '/admin/dashboard';
  }
  return '/customer/home';
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Login failed.');
      return;
    }

    navigate(routeByRole(result.role), { replace: true });
  };

  return (
    <div className="auth-page auth-page--admin">
      <div className="auth-admin-backdrop" aria-hidden="true" />

      <div className="auth-admin-shell">
        <header className="auth-admin-header">
          <p className="auth-admin-brand">NLBB</p>
          <p className="auth-admin-lead">
            Manage providers, bookings, categories, and payments from one console.
          </p>
        </header>

        <form className="auth-admin-card" onSubmit={onSubmit}>
          <div className="auth-admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@nlbb.ke"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="auth-admin-actions">
            <button type="submit" className="primary-btn auth-admin-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </div>

          {error ? <p className="error-text auth-admin-error">{error}</p> : null}

          <div className="auth-admin-notice" role="note">
            <p className="auth-admin-notice-title">Operational access only</p>
            <p className="auth-admin-notice-copy">
              Admin accounts are provisioned by NLBB. Use the credentials assigned to your team
              member account.
            </p>
          </div>

          <p className="auth-admin-fine-print">
            By continuing, you agree to NLBB&apos;s{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};
