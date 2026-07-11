import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { RootRedirect } from '../components/RootRedirect';
import { RoleLayout } from '../components/RoleLayout';
import { BootPage } from '../pages/BootPage';
import { LoginPage } from '../pages/LoginPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { SignupPage } from '../pages/SignupPage';
import { RoleHomePage } from '../pages/RoleHomePage';
import { CustomerExplorePage } from '../pages/customer/CustomerExplorePage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProvidersPage } from '../pages/admin/AdminProvidersPage';
import { AdminRevenuePage } from '../pages/admin/AdminRevenuePage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/boot',
    element: <BootPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/signup/:type',
    element: <SignupPage />,
  },

  // ── Customer Routes ──
  {
    element: <ProtectedRoute roles={['customer']} />,
    children: [
      {
        path: '/customer',
        element: <RoleLayout role="customer" />,
        children: [
          { path: 'home', element: <RoleHomePage title="Customer Home" role="customer" /> },
          { path: 'explore', element: <CustomerExplorePage /> },
          { path: 'book', element: <RoleHomePage title="Book a Visit" role="customer" /> },
          { path: 'bookings', element: <RoleHomePage title="My Bookings" role="customer" /> },
          { path: 'profile', element: <RoleHomePage title="Profile" role="customer" /> },
          { path: 'provider/:providerId', element: <RoleHomePage title="Provider Details" role="customer" /> },
          { path: 'provider/:providerId/book', element: <RoleHomePage title="Book Service" role="customer" /> },
          { path: 'booking/:bookingId/confirmation', element: <RoleHomePage title="Booking Confirmed" role="customer" /> },
          { path: 'favorites', element: <RoleHomePage title="Favorites" role="customer" /> },
          { path: 'notifications', element: <RoleHomePage title="Notifications" role="customer" /> },
          { path: 'notifications/settings', element: <RoleHomePage title="Notification Settings" role="customer" /> },
          { path: 'profile/edit', element: <RoleHomePage title="Edit Profile" role="customer" /> },
          { path: 'review/:providerId', element: <RoleHomePage title="Write Review" role="customer" /> },
          { path: 'dark-mode', element: <RoleHomePage title="Appearance" role="customer" /> },
        ],
      },
    ],
  },

  // ── Provider Routes ──
  {
    element: <ProtectedRoute roles={['provider']} />,
    children: [
      {
        path: '/provider',
        element: <RoleLayout role="provider" />,
        children: [
          { path: 'dashboard', element: <RoleHomePage title="Provider Dashboard" role="provider" /> },
          { path: 'appointments', element: <RoleHomePage title="Appointments" role="provider" /> },
          { path: 'appointments/:appointmentId', element: <RoleHomePage title="Appointment Details" role="provider" /> },
          { path: 'services', element: <RoleHomePage title="Services" role="provider" /> },
          { path: 'reviews', element: <RoleHomePage title="Reviews" role="provider" /> },
          { path: 'profile', element: <RoleHomePage title="Provider Profile" role="provider" /> },
          { path: 'subscription', element: <RoleHomePage title="Subscription" role="provider" /> },
          { path: 'notifications', element: <RoleHomePage title="Notifications" role="provider" /> },
          { path: 'analytics', element: <RoleHomePage title="Analytics" role="provider" /> },
        ],
      },
    ],
  },

  // ── Admin Routes ──
  {
    element: <ProtectedRoute roles={['admin']} />,
    children: [
      {
        path: '/admin',
        element: <RoleLayout role="admin" />,
        children: [
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'providers', element: <AdminProvidersPage /> },
          { path: 'revenue', element: <AdminRevenuePage /> },
        ],
      },
    ],
  },
]);
