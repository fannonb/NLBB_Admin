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
        <p className="eyebrow">Nairobi Lifestyle Booking</p>
        <h1>Everything beauty and wellness, in one place.</h1>
        <p>
          Discover trusted providers, compare services, and manage bookings with a faster, installable web experience.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/signup">
            Get Started
          </Link>
          <Link className="ghost-btn" to="/login">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
};
