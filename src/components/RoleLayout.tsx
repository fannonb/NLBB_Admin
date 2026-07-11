import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types';

interface RoleLayoutProps {
  role: UserRole;
}

interface NavItem {
  label: string;
  to: string;
}

const roleLinks: Record<UserRole, NavItem[]> = {
  customer: [
    { label: 'Home', to: '/customer/home' },
    { label: 'Explore', to: '/customer/explore' },
    { label: 'Book', to: '/customer/book' },
    { label: 'Bookings', to: '/customer/bookings' },
    { label: 'Profile', to: '/customer/profile' },
  ],
  provider: [
    { label: 'Dashboard', to: '/provider/dashboard' },
    { label: 'Appointments', to: '/provider/appointments' },
    { label: 'Services', to: '/provider/services' },
    { label: 'Reviews', to: '/provider/reviews' },
    { label: 'Profile', to: '/provider/profile' },
  ],
  admin: [
    { label: 'Overview', to: '/admin/dashboard' },
    { label: 'Providers', to: '/admin/providers' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Revenue', to: '/admin/revenue' },
  ],
};

const tabIcons: Record<string, string> = {
  Home: '🏠',
  Explore: '🔍',
  Book: '➕',
  Bookings: '📅',
  Profile: '👤',
  Dashboard: '📊',
  Appointments: '📋',
  Services: '💈',
  Reviews: '⭐',
  Users: '👥',
  Providers: '🏪',
  Revenue: '💰',
  Subscription: '💳',
};

export const RoleLayout = ({ role }: RoleLayoutProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const links = roleLinks[role];

  return (
    <div className="app-frame">
      <header className="topbar">
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <Link to="/" className="brand">
          NLBB
        </Link>
        <div className="topbar-actions">
          <span className="user-chip">{user?.name ?? 'Account'}</span>
          <button type="button" className="ghost-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className={`sidebar-overlay ${sidebarOpen ? 'is-open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="content-grid">
        <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
          <p className="sidebar-title">{role.toUpperCase()}</p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'side-link is-active' : 'side-link')}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="side-link-icon">{tabIcons[link.label] ?? '•'}</span>
              {link.label}
            </NavLink>
          ))}
        </aside>

        <main className="main-panel">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-tab-bar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'tab-item is-active' : 'tab-item')}
          >
            <span className="tab-icon">{tabIcons[link.label] ?? '•'}</span>
            <span className="tab-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
