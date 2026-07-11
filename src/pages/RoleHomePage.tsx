import React from 'react';
import type { UserRole } from '../types';

interface RoleHomePageProps {
  title: string;
  role: UserRole;
}

export const RoleHomePage = ({ title, role }: RoleHomePageProps) => {
  return (
    <section className="page-stack">
      <h1>{title}</h1>
      <p className="subtle">
        This route is now live in the React PWA shell and mapped from the mobile app. Detailed screen parity is in
        active migration.
      </p>
      <div className="stat-grid">
        <article className="stat-card">
          <p className="stat-label">Role</p>
          <p className="stat-value">{role}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Stage</p>
          <p className="stat-value">Phase 1</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Status</p>
          <p className="stat-value">Route Migrated</p>
        </article>
      </div>
    </section>
  );
};
