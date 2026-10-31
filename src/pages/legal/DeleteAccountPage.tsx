import React from 'react';
import { Link } from 'react-router-dom';
import {
  ACCOUNT_DELETION_MAILTO,
  DELETE_ACCOUNT_LAST_UPDATED,
  DELETE_ACCOUNT_SECTIONS,
  LEGAL_CONTACT,
} from '../../constants/legalContent';

export const DeleteAccountPage = () => (
  <div className="legal-page">
    <header className="legal-page__header">
      <Link to="/login" className="legal-page__brand">
        NLBB
      </Link>
      <p className="legal-page__meta">Last updated: {DELETE_ACCOUNT_LAST_UPDATED}</p>
    </header>

    <main className="legal-page__main">
      <h1>Delete your NLBB account</h1>
      <p className="legal-page__lead">
        Never Leave Bros Behind (NLBB) provides this public page so you can request account and
        data deletion without installing or opening the app.
      </p>

      <a className="legal-page__cta" href={ACCOUNT_DELETION_MAILTO}>
        Request account deletion by email
      </a>
      <p className="legal-page__cta-hint">
        Opens your email app to {LEGAL_CONTACT.email} with the subject “NLBB account deletion
        request”. Include the email on the account so we can verify it.
      </p>

      {DELETE_ACCOUNT_SECTIONS.map((section) => (
        <section key={section.title} className="legal-page__section">
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets ? (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <nav className="legal-page__nav" aria-label="Legal documents">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/delete-account">Delete account</Link>
      </nav>

      <footer className="legal-page__footer">
        <p>
          {LEGAL_CONTACT.company}. Contact{' '}
          <a href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>.
        </p>
      </footer>
    </main>
  </div>
);
