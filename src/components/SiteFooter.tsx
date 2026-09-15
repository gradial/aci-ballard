/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, type FormEvent } from 'react';
import type { ContentProps } from '@/cms/contracts/components/siteFooter.contract';

export function SiteFooter({
  brandLogo,
  brandHref,
  brandName,
  statement,
  newsletterLabel,
  newsletterDescription,
  newsletterPlaceholder,
  newsletterSubmitLabel,
  newsletterSuccessMessage,
  columns,
  legalLinks,
  countryLabel,
  copyright,
}: ContentProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email) setIsSubscribed(true);
  }

  return (
    <footer className="site-footer">
      <div className="container-x site-footer__main">
        <div className="site-footer__brand-column">
          <a className="site-footer__brand source-brand" href={brandHref} aria-label={`${brandName} home`}>
            <img src={brandLogo} alt="" />
            <span className="wordmark site-footer__wordmark">{brandName}</span>
          </a>
          <p className="site-footer__statement">{statement}</p>
          <form className="site-footer__newsletter" onSubmit={submitNewsletter}>
            <label htmlFor="footer-newsletter-email">{newsletterLabel}</label>
            <p>{newsletterDescription}</p>
            {isSubscribed ? (
              <p className="site-footer__newsletter-success" role="status">{newsletterSuccessMessage}</p>
            ) : (
              <div className="site-footer__newsletter-row">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={newsletterPlaceholder}
                />
                <button type="submit">{newsletterSubmitLabel}</button>
              </div>
            )}
          </form>
        </div>
        {columns.map((column) => (
          <div className="site-footer__column" key={column.id}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((link) => <li key={link.id}><a href={link.href}>{link.label}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer__base-wrap">
        <div className="container-x site-footer__base">
          <p>{copyright}</p>
          <ul>
            {legalLinks.map((link) => <li key={link.id}><a href={link.href}>{link.label}</a></li>)}
            <li><span>{countryLabel}</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
