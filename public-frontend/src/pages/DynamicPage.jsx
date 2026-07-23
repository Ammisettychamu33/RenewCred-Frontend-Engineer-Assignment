import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPageBySlugThunk, clearCurrentPage } from '../store/slices/pageSlice';
import BlockRenderer from '../components/BlockRenderer';
import PageSkeleton from '../components/PageSkeleton';
import SEOHead from '../components/SEOHead';
import { FiClock, FiFileText, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const DynamicPage = () => {
  const { slug }    = useParams();
  const dispatch    = useDispatch();
  const { currentPage: page, loading, error } = useSelector((state) => state.publicPages);

  // ── Fetch page on slug change, clear on unmount ───────────
  useEffect(() => {
    if (slug) {
      dispatch(getPageBySlugThunk(slug));
    }
    return () => {
      dispatch(clearCurrentPage());
    };
  }, [slug, dispatch]);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return <PageSkeleton />;
  }

  // ── Error / not found state ───────────────────────────────
  if (error || !page) {
    return (
      <>
        <SEOHead title="Page Not Found | RenewCred Platform" />
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            404 - Page Not Found
          </h1>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            The requested page slug{' '}
            <span className="font-mono text-brand-600">/{slug}</span> does not exist
            or has not been published.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <FiArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Home Page
          </Link>
        </div>
      </>
    );
  }

  // ── Estimated reading time ────────────────────────────────
  const textLength         = page.blocks?.reduce((acc, b) => acc + (b.data?.text?.length || 0), 0) || 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(textLength / 800));

  return (
    <>
      <SEOHead
        title={page.seo?.metaTitle || `${page.title} | RenewCred Platform`}
        description={page.seo?.metaDescription || ''}
        keywords={page.seo?.keywords || ''}
      />

      <article className="space-y-8 animate-fade-in">
        {/* Article Header Meta */}
        <header className="border-b border-slate-200/80 pb-8">
          <div className="flex items-center gap-3 text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
            <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200">
              Dynamic API Content
            </span>
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <FiClock className="w-3.5 h-3.5" aria-hidden="true" />
              {readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {page.title}
          </h1>

          {page.seo?.metaDescription && (
            <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
              {page.seo.metaDescription}
            </p>
          )}
        </header>

        {/* Main Dynamic Block Content */}
        <main>
          <BlockRenderer blocks={page.blocks} />
        </main>
      </article>
    </>
  );
};

export default DynamicPage;
