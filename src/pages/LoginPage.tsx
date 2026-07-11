import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="auth-page">
      <div className="auth-hero-bg" style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop")',
        position: 'absolute', top: 0, left: 0, right: 0, height: '55vh', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2
      }}></div>
      <div className="auth-overlay" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '55vh', backgroundColor: 'rgba(15, 31, 56, 0.75)', zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,31,56,0.4) 0%, rgba(15,31,56,1) 100%)'
      }}></div>

      <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '2rem', color: '#fff', zIndex: 1 }}>
        <h1 style={{ fontFamily: '"Sora", "Segoe UI", sans-serif', fontSize: '2.4rem', margin: '0 0 0.5rem', fontWeight: 600 }}>Welcome to NLBB</h1>
        <p style={{ margin: 0, fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}>Discover and book the best stylists near you.</p>
      </div>

      <form className="auth-card" onSubmit={onSubmit} style={{ 
        background: '#15243b', 
        borderColor: '#2a3b55', 
        boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
        color: '#f4f8ff'
      }}>
        <label htmlFor="email" style={{ color: '#aab6c8' }}>Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{ background: '#0a1426', borderColor: '#2a3b55', color: '#fff' }}
        />

        <label htmlFor="password" style={{ color: '#aab6c8' }}>Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{ background: '#0a1426', borderColor: '#2a3b55', color: '#fff' }}
        />

        <div style={{ textAlign: 'right', marginTop: '-0.2rem' }}>
          <a href="#" style={{ color: '#e8af38', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
        </div>

        {error ? <p className="error-text" style={{ color: '#f87171' }}>{error}</p> : null}

        <button type="submit" className="primary-btn" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#8896aa', marginTop: '0.5rem', lineHeight: 1.5 }}>
          By continuing, you agree to NLBB's <br/>
          <span style={{ color: '#e8af38' }}>Terms of Service</span> and <span style={{ color: '#e8af38' }}>Privacy Policy</span>.
        </p>

        <div className="auth-links" style={{ justifyContent: 'center', marginTop: '0.5rem', borderTop: '1px solid #2a3b55', paddingTop: '1.2rem', gap: '1rem' }}>
          <span style={{ color: '#8896aa', fontSize: '0.9rem' }}>Don't have an account?</span>
          <Link to="/signup" style={{ color: '#e8af38', fontWeight: 600 }}>Sign Up</Link>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'auto', paddingBottom: '2rem', maxWidth: '400px', zIndex: 1 }}>
        <h3 style={{ fontFamily: '"Sora", "Segoe UI", sans-serif', margin: '0 0 0.5rem', color: '#fff', fontSize: '1.2rem' }}>Redefine your beauty experience.</h3>
        <p style={{ margin: 0, color: '#8896aa', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Join over 10,000 users discovering professional barbers, salons, and spas in their neighborhood every day.
        </p>
      </div>
    </div>
  );
};
