import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const routeByRole = (role: 'customer' | 'provider' | 'admin') => {
  if (role === 'provider') {
    return '/provider/dashboard';
  }
  if (role === 'admin') {
    return '/admin/dashboard';
  }
  return '/customer/home';
};

export const RootRedirect = () => {
  const isReady = useAuthStore((state) => state.isReady);
  const user = useAuthStore((state) => state.user);

  if (!isReady) {
    return <Navigate to="/boot" replace />;
  }

  if (!user) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to={routeByRole(user.role)} replace />;
};
