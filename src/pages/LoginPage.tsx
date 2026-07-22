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
    <div className="auth-page auth-page--hero">
      <div
        className="auth-hero-photo"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop")' }}
      />
      <div className="auth-hero-overlay" />

      <div className="auth-hero-text">
        <h1>NLBB Admin</h1>
        <p>Sign in to manage operations, providers, bookings, and payments.</p>
      </div>

      <form className="auth-card auth-card--dark" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <div className="auth-forgot">
          <a href="#">Forgot password?</a>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" className="primary-btn" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="auth-fine-print">
          By continuing, you agree to NLBB's <br />
          <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
        </p>

      </form>

      <div className="auth-footer-note">
        <h3>Operational access only.</h3>
        <p>
          Admin accounts are managed outside this web app. Use your assigned credentials to continue.
        </p>
      </div>
    </div>
  );
};
