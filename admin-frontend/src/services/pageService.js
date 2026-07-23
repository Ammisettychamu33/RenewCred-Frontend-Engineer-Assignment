import api from './api';

const INITIAL_DEMO_PAGES = [
  {
    _id: 'mock-page-1',
    title: 'Home',
    slug: 'home',
    status: 'published',
    updatedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'RenewCred - Next-Gen Credit Platform',
      metaDescription: 'Enterprise digital management framework.',
      keywords: ['fintech', 'credit'],
    },
    blocks: [
      {
        id: 'block-1',
        type: 'heading',
        order: 0,
        data: { level: 'h1', text: 'Architecting the Future of Credit Infrastructure' },
      },
      {
        id: 'block-2',
        type: 'paragraph',
        order: 1,
        data: {
          text: 'RenewCred is an enterprise-grade digital management framework delivering zero-latency credit decisions.',
        },
      },
    ],
  },
  {
    _id: 'mock-page-2',
    title: 'About',
    slug: 'about',
    status: 'published',
    updatedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'About RenewCred',
      metaDescription: 'Learn about engineering philosophy.',
      keywords: ['about'],
    },
    blocks: [
      {
        id: 'about-1',
        type: 'heading',
        order: 0,
        data: { level: 'h1', text: 'About RenewCred Engineering' },
      },
    ],
  },
];

const getStoredPages = () => {
  const stored = localStorage.getItem('renewcred_demo_pages');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // ignore JSON parse error
    }
  }
  localStorage.setItem('renewcred_demo_pages', JSON.stringify(INITIAL_DEMO_PAGES));
  return INITIAL_DEMO_PAGES;
};

const saveStoredPages = (pages) => {
  localStorage.setItem('renewcred_demo_pages', JSON.stringify(pages));
};

export const fetchPagesApi = async (params = {}) => {
  try {
    return await api.get('/pages', { params });
  } catch (err) {
    console.warn('[Admin CMS] API offline, returning stored pages');
    let pages = getStoredPages();
    if (params.search) {
      const q = params.search.toLowerCase();
      pages = pages.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    if (params.status) {
      pages = pages.filter((p) => p.status === params.status);
    }
    return { success: true, data: pages };
  }
};

export const fetchPageBySlugApi = async (slug) => {
  try {
    return await api.get(`/pages/${slug}`);
  } catch (err) {
    console.warn(`[Admin CMS] API offline, fetching page by slug/id '${slug}'`);
    const pages = getStoredPages();
    const found = pages.find((p) => p.slug === slug || p._id === slug);
    if (found) return { success: true, data: found };
    return { success: true, data: pages[0] };
  }
};

export const createPageApi = async (pageData) => {
  try {
    return await api.post('/pages', pageData);
  } catch (err) {
    console.warn('[Admin CMS] API offline, creating page in localStorage');
    const pages = getStoredPages();
    const newPage = {
      ...pageData,
      _id: 'page-' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    pages.push(newPage);
    saveStoredPages(pages);
    return { success: true, data: newPage };
  }
};

export const updatePageApi = async (id, pageData) => {
  try {
    return await api.put(`/pages/${id}`, pageData);
  } catch (err) {
    console.warn(`[Admin CMS] API offline, updating page '${id}' in localStorage`);
    const pages = getStoredPages();
    const idx = pages.findIndex((p) => p._id === id || p.slug === id);
    if (idx !== -1) {
      pages[idx] = { ...pages[idx], ...pageData, updatedAt: new Date().toISOString() };
      saveStoredPages(pages);
      return { success: true, data: pages[idx] };
    }
    return { success: true, data: pageData };
  }
};

export const deletePageApi = async (id) => {
  try {
    return await api.delete(`/pages/${id}`);
  } catch (err) {
    console.warn(`[Admin CMS] API offline, deleting page '${id}' from localStorage`);
    let pages = getStoredPages();
    pages = pages.filter((p) => p._id !== id && p.slug !== id);
    saveStoredPages(pages);
    return { success: true, data: { id } };
  }
};
