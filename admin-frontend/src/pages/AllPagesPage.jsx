import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPagesThunk, deletePageThunk, setSearchTerm, setStatusFilter } from '../store/slices/pageSlice';
import { addToast } from '../store/slices/uiSlice';
import ConfirmModal from '../components/ConfirmModal';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiFileText,
} from 'react-icons/fi';

const AllPagesPage = () => {
  const dispatch = useDispatch();
  const { list: pages, loading, searchTerm, statusFilter } = useSelector((state) => state.pages);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pageId: null, pageTitle: '' });
  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    dispatch(getPagesThunk());
  }, [dispatch]);

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (deleteModal.pageId) {
      const result = await dispatch(deletePageThunk(deleteModal.pageId));
      if (deletePageThunk.fulfilled.match(result)) {
        dispatch(
          addToast({
            type: 'success',
            message: `Page "${deleteModal.pageTitle}" deleted successfully.`,
          })
        );
      } else {
        dispatch(
          addToast({
            type: 'error',
            message: result.payload || 'Failed to delete page.',
          })
        );
      }
    }
    setDeleteModal({ isOpen: false, pageId: null, pageTitle: '' });
  };

  const copyPageUrl = (slug) => {
    const url = `http://localhost:3001/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    dispatch(addToast({ type: 'info', message: `Copied URL: ${url}` }));
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Content Pages</h1>
          <p className="text-slate-500 text-xs mt-1">Manage and edit dynamic backend API pages for your public website</p>
        </div>

        <Link
          to="/pages/new"
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/20 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <FiPlus className="w-4 h-4" /> Create Page
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Search by title or slug..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="status-filter-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</label>
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Pages ({pages.length})</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Main Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading pages from database...</div>
        ) : filteredPages.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FiFileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-semibold text-slate-700">No matching pages found</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-6">Page Title</th>
                  <th scope="col" className="py-3.5 px-6">Slug Path</th>
                  <th scope="col" className="py-3.5 px-6">Status</th>
                  <th scope="col" className="py-3.5 px-6">Blocks Count</th>
                  <th scope="col" className="py-3.5 px-6">Last Updated</th>
                  <th scope="col" className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPages.map((page) => (
                  <tr key={page._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{page.title}</td>
                    <td className="py-4 px-6 font-mono text-xs text-brand-600">/{page.slug}</td>
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
                    <td className="py-4 px-6 text-slate-600 font-medium">{page.blocks?.length || 0} blocks</td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {new Date(page.updatedAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyPageUrl(page.slug)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          title="Copy Link"
                          aria-label={`Copy link for ${page.title}`}
                        >
                          {copiedSlug === page.slug ? <FiCheck className="w-4 h-4 text-emerald-600" /> : <FiCopy className="w-4 h-4" />}
                        </button>
                        <a
                          href={`http://localhost:3001/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          title="Open Public Preview"
                          aria-label={`Open public preview for ${page.title}`}
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/pages/edit/${page._id}`}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          title="Edit Page"
                          aria-label={`Edit ${page.title}`}
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteModal({ isOpen: true, pageId: page._id, pageTitle: page.title })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                          title="Delete Page"
                          aria-label={`Delete ${page.title}`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Content Page"
        message={`Are you sure you want to delete "${deleteModal.pageTitle}"? This operation cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, pageId: null, pageTitle: '' })}
      />
    </div>
  );
};

export default AllPagesPage;
