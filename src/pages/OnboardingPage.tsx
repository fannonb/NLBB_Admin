import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.role === 'provider') {
      navigate('/provider/dashboard', { replace: true });
      return;
    }
    if (user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    navigate('/customer/home', { replace: true });
  }, [navigate, user]);

  return (
    <div className="onboarding">
      <section className="hero-panel">
        <p className="eyebrow">NLBB Admin</p>
        <h1>Manage providers, bookings, and revenue from one console.</h1>
        <p>
          Sign in to review marketplace activity, verify providers, and track payment performance.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/login">
            Admin Login
          </Link>
        </div>
      </section>
    </div>
  );
};
