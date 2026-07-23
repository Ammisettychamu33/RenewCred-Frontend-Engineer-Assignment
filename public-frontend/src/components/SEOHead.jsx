import { useEffect } from 'react';

/**
 * SEOHead — headless utility component that manages all document head metadata.
 *
 * Manages:
 *  - document.title
 *  - <meta name="description">
 *  - <meta name="keywords">
 *  - Open Graph (og:title, og:description, og:type, og:url)
 *  - Twitter Card (twitter:card, twitter:title, twitter:description)
 *
 * Usage:
 *   <SEOHead
 *     title="My Page | RenewCred"
 *     description="This page is about..."
 *     keywords="renewcred, cms, platform"
 *   />
 *
 * Renders nothing to the DOM — all effects are on the <head>.
 */
const SEOHead = ({
  title,
  description = '',
  keywords = '',
  ogType = 'website',
  ogUrl = typeof window !== 'undefined' ? window.location.href : '',
  twitterCard = 'summary',
}) => {
  useEffect(() => {
    // ── Title ─────────────────────────────────────────────
    if (title) {
      document.title = title;
    }

    // ── Helper: upsert a <meta> tag by attribute key/value ──
    const setMeta = (attr, attrValue, contentValue) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // ── Standard meta ─────────────────────────────────────
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);

    // ── Open Graph ────────────────────────────────────────
    setMeta('property', 'og:title',       title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type',        ogType);
    setMeta('property', 'og:url',         ogUrl);

    // ── Twitter Card ──────────────────────────────────────
    setMeta('name', 'twitter:card',        twitterCard);
    setMeta('name', 'twitter:title',       title);
    setMeta('name', 'twitter:description', description);
  }, [title, description, keywords, ogType, ogUrl, twitterCard]);

  // Headless — renders nothing
  return null;
};

export default SEOHead;
