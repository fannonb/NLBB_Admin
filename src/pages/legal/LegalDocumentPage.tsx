import React from 'react';
import { Link } from 'react-router-dom';
import {
  LEGAL_CONTACT,
  LegalSection,
  PRIVACY_LAST_UPDATED,
  PRIVACY_POLICY_SECTIONS,
  TERMS_LAST_UPDATED,
  TERMS_OF_SERVICE_SECTIONS,
} from '../../constants/legalContent';

const LegalNav = () => (
  <nav className="legal-page__nav" aria-label="Legal documents">
    <Link to="/privacy">Privacy Policy</Link>
    <Link to="/terms">Terms of Service</Link>
    <Link to="/delete-account">Delete account</Link>
  </nav>
);

type LegalDocumentPageProps = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

const LegalDocumentPage = ({ title, lastUpdated, sections }: LegalDocumentPageProps) => (
  <div className="legal-page">
    <header className="legal-page__header">
      <Link to="/login" className="legal-page__brand">
        NLBB
      </Link>
      <p className="legal-page__meta">Last updated: {lastUpdated}</p>
    </header>

    <main className="legal-page__main">
      <h1>{title}</h1>
      {sections.map((section) => (
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
      <footer className="legal-page__footer">
        <p>
          Questions? Contact <a href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a> or visit{' '}
          <a href={LEGAL_CONTACT.website}>{LEGAL_CONTACT.website}</a>.
        </p>
      </footer>
      <LegalNav />
    </main>
  </div>
);

export const PrivacyPolicyPage = () => (
  <LegalDocumentPage
    title="Privacy Policy"
    lastUpdated={PRIVACY_LAST_UPDATED}
    sections={PRIVACY_POLICY_SECTIONS}
  />
);

export const TermsOfServicePage = () => (
  <LegalDocumentPage
    title="Terms of Service"
    lastUpdated={TERMS_LAST_UPDATED}
    sections={TERMS_OF_SERVICE_SECTIONS}
  />
);
