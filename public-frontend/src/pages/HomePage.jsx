import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPageBySlugThunk, getNavPagesThunk } from '../store/slices/pageSlice';
import BlockRenderer from '../components/BlockRenderer';
import PageSkeleton from '../components/PageSkeleton';
import SEOHead from '../components/SEOHead';

const HomePage = () => {
  const dispatch = useDispatch();
  const { currentPage: page, navPages, loading } = useSelector((state) => state.publicPages);

  // ── Initial data fetch ────────────────────────────────────
  useEffect(() => {
    dispatch(getPageBySlugThunk('home'));
    dispatch(getNavPagesThunk());
  }, [dispatch]);

  // ── Fallback: first published page if 'home' slug absent ──
  useEffect(() => {
    if (!page && !loading && navPages && navPages.length > 0) {
      dispatch(getPageBySlugThunk(navPages[0].slug));
    }
  }, [page, loading, navPages, dispatch]);

  if (loading || !page) {
    return <PageSkeleton />;
  }

  return (
    <>
      <SEOHead
        title={page.seo?.metaTitle || 'RenewCred Enterprise Platform'}
        description={page.seo?.metaDescription || ''}
        keywords={page.seo?.keywords || ''}
      />

      <article className="space-y-8 animate-fade-in">
        <header className="border-b border-slate-200/80 pb-6 mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {page.title}
          </h1>
          {page.seo?.metaDescription && (
            <p className="text-slate-600 text-lg mt-3">{page.seo.metaDescription}</p>
          )}
        </header>

        <main>
          <BlockRenderer blocks={page.blocks} />
        </main>
      </article>
    </>
  );
};

export default HomePage;
