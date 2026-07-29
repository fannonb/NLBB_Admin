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
    <div className="auth-page auth-page--hero">
      <div
        className="auth-hero-photo"
        style={{
          height: '38vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1516975080661-46b043ce6a62?q=80&w=1200&auto=format&fit=crop")',
        }}
      />
      <div className="auth-hero-overlay" style={{ height: '38vh' }} />

      <Link to="/login" className="auth-hero-back">
        <span>&larr;</span> Back
      </Link>

      <div className="auth-hero-text">
        <h1>Create Account</h1>
        <p>Join over 10,000 users discovering beauty.</p>
      </div>

      <form className="auth-card auth-card--dark" onSubmit={onSubmit}>
        <h2>{role === 'provider' ? 'Provider Details' : 'Your Details'}</h2>

        <label htmlFor="name">Full Name</label>
        <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          placeholder="+254 7XX XXX XXX"
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="e.g. Kilimani, Nairobi"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          placeholder="Min. 8 characters"
        />

        {error ? <p className="error-text">{error}</p> : null}

        <p className="auth-fine-print">
          By signing up, you agree to NLBB's <br />
          <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
        </p>

        <button type="submit" className="primary-btn" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
          {isSubmitting ? 'Creating account...' : 'Join NLBB'}
        </button>

        <div className="auth-links">
          <span>Already have an account?</span>
          <Link to="/login">Sign In</Link>
        </div>

        {role === 'customer' && (
          <div className="auth-role-cta">
            <Link to="/signup/provider">Register as a Service Provider</Link>
          </div>
        )}
      </form>
    </div>
  );
};
