import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPagesThunk } from '../store/slices/pageSlice';
import {
  FiFileText,
  FiCheckCircle,
  FiEdit3,
  FiLayers,
  FiPlus,
  FiArrowRight,
  FiExternalLink,
  FiZap,
} from 'react-icons/fi';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { list: pages, loading } = useSelector((state) => state.pages);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getPagesThunk());
  }, [dispatch]);

  const totalPages = pages.length;
  const publishedPages = pages.filter((p) => p.status === 'published').length;
  const draftPages = pages.filter((p) => p.status === 'draft').length;
  const totalBlocks = pages.reduce((acc, p) => acc + (p.blocks?.length || 0), 0);

  const stats = [
    { title: 'Total Pages', count: totalPages, icon: FiFileText, color: 'text-brand-600 bg-brand-50 border-brand-200' },
    { title: 'Published Pages', count: publishedPages, icon: FiCheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: 'Draft Pages', count: draftPages, icon: FiEdit3, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Content Blocks', count: totalBlocks, icon: FiLayers, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-3">
            <FiZap className="w-3.5 h-3.5" /> Enterprise CMS Operational
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Architect'}!
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Manage your dynamic backend API pages, block structures, LaTeX equations, and public rendering engines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/pages/new"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <FiPlus className="w-4 h-4" /> Create New Page
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 transition-all hover:shadow-md"
            >
              <div className={`p-3.5 rounded-2xl border ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{loading ? '...' : stat.count}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Content Pages</h2>
            <p className="text-xs text-slate-500">Overview of all pages fetched from Express REST API</p>
          </div>
          <Link
            to="/pages"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          >
            View All Pages <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading CMS content pages...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No pages found. Create your first page!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-6">Title</th>
                  <th scope="col" className="py-3.5 px-6">Slug</th>
                  <th scope="col" className="py-3.5 px-6">Status</th>
                  <th scope="col" className="py-3.5 px-6">Blocks</th>
                  <th scope="col" className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.slice(0, 5).map((page) => (
                  <tr key={page._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{page.title}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">/{page.slug}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          page.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{page.blocks?.length || 0} blocks</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/pages/edit/${page._id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                          Edit Page
                        </Link>
                        <a
                          href={`http://localhost:3001/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          title="View on Public Website"
                          aria-label={`View ${page.title} on public website`}
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
