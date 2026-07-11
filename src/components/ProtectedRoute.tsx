import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  roles?: UserRole[];
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const isReady = useAuthStore((state) => state.isReady);

  if (!isReady) {
    return <div className="boot-screen">Checking session...</div>;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === 'provider' ? '/provider/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/customer/home';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};
