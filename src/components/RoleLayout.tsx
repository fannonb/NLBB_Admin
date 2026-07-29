import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types';
import { NavIconKey, NavIcons } from './NavIcons';

interface RoleLayoutProps {
  role: UserRole;
}

interface NavItem {
  label: string;
  to: string;
  icon: NavIconKey;
}

const roleLinks: Record<UserRole, NavItem[]> = {
  customer: [
    { label: 'Home', to: '/customer/home', icon: 'home' },
    { label: 'Explore', to: '/customer/explore', icon: 'explore' },
    { label: 'Book', to: '/customer/book', icon: 'book' },
    { label: 'Bookings', to: '/customer/bookings', icon: 'bookings' },
    { label: 'Profile', to: '/customer/profile', icon: 'profile' },
  ],
  provider: [
    { label: 'Dashboard', to: '/provider/dashboard', icon: 'dashboard' },
    { label: 'Appointments', to: '/provider/appointments', icon: 'appointments' },
    { label: 'Services', to: '/provider/services', icon: 'services' },
    { label: 'Reviews', to: '/provider/reviews', icon: 'reviews' },
    { label: 'Profile', to: '/provider/profile', icon: 'profile' },
  ],
  admin: [
    { label: 'Overview', to: '/admin/dashboard', icon: 'overview' },
    { label: 'Providers', to: '/admin/providers', icon: 'providers' },
    { label: 'Categories', to: '/admin/categories', icon: 'categories' },
    { label: 'Users', to: '/admin/users', icon: 'users' },
    { label: 'Revenue', to: '/admin/revenue', icon: 'revenue' },
  ],
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
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          Menu
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
          {links.map((link) => {
            const Icon = NavIcons[link.icon];
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'side-link is-active' : 'side-link')}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="side-link-icon" aria-hidden="true">
                  <Icon />
                </span>
                {link.label}
              </NavLink>
            );
          })}
        </aside>

        <main className="main-panel">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-tab-bar">
        {links.map((link) => {
          const Icon = NavIcons[link.icon];
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'tab-item is-active' : 'tab-item')}
            >
              <span className="tab-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="tab-label">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
