import React, { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const SignupPage = () => {
  const { type } = useParams();
  const role = useMemo(() => (type === 'provider' ? 'provider' : 'customer'), [type]);
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await signup({
      name,
      email,
      phone,
      password,
      location: location || undefined,
      role,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Unable to create account.');
      return;
    }

    navigate(role === 'provider' ? '/provider/dashboard' : '/customer/home', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-hero-bg" style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1516975080661-46b043ce6a62?q=80&w=1200&auto=format&fit=crop")',
        position: 'absolute', top: 0, left: 0, right: 0, height: '40vh', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2
      }}></div>
      <div className="auth-overlay" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40vh', backgroundColor: 'rgba(15, 31, 56, 0.75)', zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,31,56,0.5) 0%, rgba(15,31,56,1) 100%)'
      }}></div>

      <div style={{ width: '100%', maxWidth: '440px', marginBottom: '1.5rem', marginTop: '1rem', color: '#fff', zIndex: 1, display: 'flex', alignItems: 'center' }}>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
          <span>&larr;</span> Back
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#fff', zIndex: 1 }}>
        <h1 style={{ fontFamily: '"Sora", "Segoe UI", sans-serif', fontSize: '2.2rem', margin: '0 0 0.5rem', fontWeight: 600 }}>Create Account</h1>
        <p style={{ margin: 0, fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}>Join over 10,000 users discovering beauty.</p>
      </div>

      <form className="auth-card" onSubmit={onSubmit} style={{ 
        background: '#15243b', 
        borderColor: '#2a3b55', 
        boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
        color: '#f4f8ff',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', color: '#fff', borderBottom: '1px solid #2a3b55', paddingBottom: '0.8rem' }}>
          {role === 'provider' ? 'Provider Details' : 'Your Details'}
        </h2>

        <label htmlFor="name" style={{ color: '#aab6c8' }}>Full Name</label>
        <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} required style={{ background: '#0a1426', borderColor: '#2a3b55', color: '#fff' }} />

        <label htmlFor="email" style={{ color: '#aab6c8' }}>Email</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required style={{ background: '#0a1426', borderColor: '#2a3b55', color: '#fff' }} />

        <label htmlFor="phone" style={{ color: '#aab6c8' }}>Phone Number</label>
        <input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required placeholder="+254 7XX XXX XXX" style={{ background: '#0a1426', borderColor: '#2a3b55', color: '#fff' }} />

        <label htmlFor="location" style={{ color: '#aab6c8' }}>Location</label>
        <input id="location" type="text" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Kilimani, Nairobi" style={{ background: '#0a1426', borderColor: '#2a3b55', color: '#fff' }} />

        <label htmlFor="password" style={{ color: '#aab6c8' }}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          placeholder="Min. 8 characters"
          style={{ background: '#0a1426', borderColor: '#2a3b55', color: '#fff' }}
        />

        {error ? <p className="error-text" style={{ color: '#f87171' }}>{error}</p> : null}

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#8896aa', marginTop: '0.5rem', lineHeight: 1.5 }}>
          By signing up, you agree to NLBB's <br/>
          <span style={{ color: '#e8af38' }}>Terms of Service</span> and <span style={{ color: '#e8af38' }}>Privacy Policy</span>.
        </p>

        <button type="submit" className="primary-btn" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
          {isSubmitting ? 'Creating account...' : 'Join NLBB'}
        </button>

        <div className="auth-links" style={{ justifyContent: 'center', marginTop: '0.5rem', borderTop: '1px solid #2a3b55', paddingTop: '1.2rem', gap: '1rem' }}>
          <span style={{ color: '#8896aa', fontSize: '0.9rem' }}>Already have an account?</span>
          <Link to="/login" style={{ color: '#e8af38', fontWeight: 600 }}>Sign In</Link>
        </div>

        {role === 'customer' && (
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
             <Link to="/signup/provider" style={{ color: '#e8af38', fontSize: '0.9rem', textDecoration: 'none', background: 'rgba(232, 175, 56, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'inline-block' }}>Register as a Service Provider</Link>
          </div>
        )}
      </form>
    </div>
  );
};
