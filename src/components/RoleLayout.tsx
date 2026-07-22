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
  token: string;
}

const roleLinks: Record<UserRole, NavItem[]> = {
  customer: [
    { label: 'Home', to: '/customer/home', token: 'HM' },
    { label: 'Explore', to: '/customer/explore', token: 'EX' },
    { label: 'Book', to: '/customer/book', token: 'BK' },
    { label: 'Bookings', to: '/customer/bookings', token: 'MY' },
    { label: 'Profile', to: '/customer/profile', token: 'ME' },
  ],
  provider: [
    { label: 'Dashboard', to: '/provider/dashboard', token: 'DB' },
    { label: 'Appointments', to: '/provider/appointments', token: 'AP' },
    { label: 'Services', to: '/provider/services', token: 'SV' },
    { label: 'Reviews', to: '/provider/reviews', token: 'RV' },
    { label: 'Profile', to: '/provider/profile', token: 'ME' },
  ],
  admin: [
    { label: 'Overview', to: '/admin/dashboard', token: 'OV' },
    { label: 'Providers', to: '/admin/providers', token: 'PR' },
    { label: 'Categories', to: '/admin/categories', token: 'CT' },
    { label: 'Users', to: '/admin/users', token: 'US' },
    { label: 'Revenue', to: '/admin/revenue', token: 'RV' },
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
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'side-link is-active' : 'side-link')}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="side-link-icon" aria-hidden="true">
                {link.token}
              </span>
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
            <span className="tab-icon" aria-hidden="true">
              {link.token}
            </span>
            <span className="tab-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
