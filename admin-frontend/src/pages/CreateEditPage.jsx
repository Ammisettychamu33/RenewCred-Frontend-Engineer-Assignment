import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPageThunk,
  updatePageThunk,
  getPagesThunk,
} from '../store/slices/pageSlice';
import { addToast } from '../store/slices/uiSlice';
import BlockEditor from '../components/editor/BlockEditor';
import BlockPreview from '../components/editor/BlockPreview';
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiLayers,
  FiGlobe,
} from 'react-icons/fi';

const CreateEditPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: pages } = useSelector((state) => state.pages);

  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'seo' | 'preview'
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'published',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
    blocks: [],
  });

  useEffect(() => {
    if (isEditMode) {
      if (pages.length === 0) {
        dispatch(getPagesThunk());
      } else {
        const found = pages.find((p) => p._id === id);
        if (found) {
          setFormData({
            title: found.title || '',
            slug: found.slug || '',
            status: found.status || 'published',
            seo: {
              metaTitle: found.seo?.metaTitle || '',
              metaDescription: found.seo?.metaDescription || '',
              keywords: Array.isArray(found.seo?.keywords)
                ? found.seo.keywords.join(', ')
                : found.seo?.keywords || '',
            },
            blocks: found.blocks || [],
          });
        }
      }
    }
  }, [id, isEditMode, pages, dispatch]);

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setFormData((prev) => {
      const autoSlug = !isEditMode && !prev.slug
        ? titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug;
      return { ...prev, title: titleVal, slug: autoSlug };
    });
  };

  const handleSavePage = async () => {
    if (!formData.title.trim()) {
      dispatch(addToast({ type: 'error', message: 'Page Title is required' }));
      return;
    }

    if (!formData.slug.trim()) {
      dispatch(addToast({ type: 'error', message: 'Page Slug is required' }));
      return;
    }

    setSaving(true);

    const payload = {
      ...formData,
      slug: formData.slug.toLowerCase().trim(),
      seo: {
        metaTitle: formData.seo.metaTitle,
        metaDescription: formData.seo.metaDescription,
        keywords: typeof formData.seo.keywords === 'string'
          ? formData.seo.keywords.split(',').map((k) => k.trim()).filter(Boolean)
          : formData.seo.keywords,
      },
    };

    if (isEditMode) {
      const result = await dispatch(updatePageThunk({ id, pageData: payload }));
      setSaving(false);
      if (updatePageThunk.fulfilled.match(result)) {
        dispatch(addToast({ type: 'success', message: 'Page updated successfully!' }));
        navigate('/pages');
      } else {
        dispatch(addToast({ type: 'error', message: result.payload || 'Failed to update page' }));
      }
    } else {
      const result = await dispatch(createPageThunk(payload));
      setSaving(false);
      if (createPageThunk.fulfilled.match(result)) {
        dispatch(addToast({ type: 'success', message: 'New page created successfully!' }));
        navigate('/pages');
      } else {
        dispatch(addToast({ type: 'error', message: result.payload || 'Failed to create page' }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/pages')}
            aria-label="Back to pages list"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEditMode ? `Edit Page: ${formData.title || 'Untitled'}` : 'Create New Page'}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Build structured content blocks and publish dynamically to backend APIs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            aria-label="Select publishing status"
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="published">Status: Published</option>
            <option value="draft">Status: Draft</option>
          </select>

          <button
            type="button"
            onClick={handleSavePage}
            disabled={saving}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/20 flex items-center gap-2 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiSave className="w-4 h-4" /> Save Page
              </>
            )}
          </button>
        </div>
      </div>

      {/* Page Title & Slug Meta Inputs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="page-title-input" className="block text-xs font-semibold text-slate-500 mb-1">Page Title *</label>
          <input
            id="page-title-input"
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g. Enterprise Security Architecture"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="page-slug-input" className="block text-xs font-semibold text-slate-500 mb-1">URL Slug (Path) *</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">/</span>
            <input
              id="page-slug-input"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g. security-architecture"
              className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'editor'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FiLayers className="w-4 h-4" /> Content Blocks ({formData.blocks?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'seo'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FiGlobe className="w-4 h-4" /> SEO & Meta Data
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'preview'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FiEye className="w-4 h-4" /> Live Preview Mode
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'editor' && (
        <BlockEditor
          blocks={formData.blocks}
          onChange={(updatedBlocks) => setFormData((prev) => ({ ...prev, blocks: updatedBlocks }))}
        />
      )}

      {activeTab === 'seo' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
          <div>
            <label htmlFor="meta-title-input" className="block text-xs font-semibold text-slate-500 mb-1">Meta Title</label>
            <input
              id="meta-title-input"
              type="text"
              value={formData.seo.metaTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, metaTitle: e.target.value },
                }))
              }
              placeholder="Custom page title for search engines"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label htmlFor="meta-desc-input" className="block text-xs font-semibold text-slate-500 mb-1">Meta Description</label>
            <textarea
              id="meta-desc-input"
              rows={3}
              value={formData.seo.metaDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, metaDescription: e.target.value },
                }))
              }
              placeholder="Brief summary of page content for search results..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label htmlFor="meta-keywords-input" className="block text-xs font-semibold text-slate-500 mb-1">Keywords (Comma Separated)</label>
            <input
              id="meta-keywords-input"
              type="text"
              value={formData.seo.keywords}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, keywords: e.target.value },
                }))
              }
              placeholder="e.g. credit, fintech, API, docs"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <BlockPreview
          title={formData.title}
          seo={formData.seo}
          blocks={formData.blocks}
        />
      )}
    </div>
  );
};

export default CreateEditPage;
