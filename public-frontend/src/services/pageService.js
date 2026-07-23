import api from './api';

const FALLBACK_PAGES = [
  {
    _id: 'mock-page-1',
    title: 'Home',
    slug: 'home',
    status: 'published',
    seo: {
      metaTitle: 'RenewCred - Next-Gen Credit & Enterprise Platform',
      metaDescription: 'Building resilient, high-speed financial engineering solutions.',
      keywords: ['fintech', 'credit', 'cms', 'express', 'react'],
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
          text: 'RenewCred is an enterprise-grade digital management framework delivering zero-latency credit decisions, real-time risk scoring, and automated compliance pipelines.',
        },
      },
      {
        id: 'block-3',
        type: 'quote',
        order: 2,
        data: {
          text: 'Simplicity is precondition for reliability. We build software that scales effortlessly.',
          author: 'Senior Systems Architect',
        },
      },
      {
        id: 'block-4',
        type: 'heading',
        order: 3,
        data: { level: 'h2', text: 'Mathematical Valuation Model' },
      },
      {
        id: 'block-5',
        type: 'paragraph',
        order: 4,
        data: { text: 'Our risk scoring engine computes continuous probability distribution metrics using KaTeX LaTeX formulations:' },
      },
      {
        id: 'block-6',
        type: 'equation',
        order: 5,
        data: {
          expression: 'P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}',
          caption: 'Binomial Probability Distribution for Credit Default Risk',
        },
      },
      {
        id: 'block-7',
        type: 'heading',
        order: 6,
        data: { level: 'h2', text: 'Key Architectural Pillars' },
      },
      {
        id: 'block-8',
        type: 'list',
        order: 7,
        data: {
          style: 'bullet',
          items: [
            'Micro-service decoupling between CMS and presentation layers',
            'Strict Schema-Driven JSON block rendering pipeline',
            'Sub-millisecond dynamic routing and content delivery',
            'JWT-backed stateful & stateless security assertion',
          ],
        },
      },
      {
        id: 'block-9',
        type: 'heading',
        order: 8,
        data: { level: 'h2', text: 'Performance Benchmark Comparison' },
      },
      {
        id: 'block-10',
        type: 'table',
        order: 9,
        data: {
          headers: ['Metric', 'RenewCred CMS', 'Traditional Monolith', 'Static Generator'],
          rows: [
            ['Time to First Byte (TTFB)', '28ms', '240ms', '15ms'],
            ['Content Update Latency', 'Instant (API)', 'Manual Build', 'CI/CD Pipeline (5m)'],
            ['Block Editor Flexibility', 'Full Custom Schema', 'WSIWYG Rich Text', 'Markdown Only'],
          ],
        },
      },
      {
        id: 'block-11',
        type: 'divider',
        order: 10,
        data: {},
      },
      {
        id: 'block-12',
        type: 'heading',
        order: 11,
        data: { level: 'h2', text: 'Integration Snippet' },
      },
      {
        id: 'block-13',
        type: 'code',
        order: 12,
        data: {
          language: 'javascript',
          code: `import { createClient } from '@renewcred/sdk';\n\nconst client = createClient({\n  endpoint: 'https://api.renewcred.com',\n  apiKey: process.env.RENEWCRED_API_KEY\n});\n\nconst page = await client.pages.getBySlug('home');\nconsole.log('Dynamic Blocks:', page.blocks);`,
        },
      },
    ],
  },
  {
    _id: 'mock-page-2',
    title: 'About',
    slug: 'about',
    status: 'published',
    seo: {
      metaTitle: 'About RenewCred Platform',
      metaDescription: 'Learn about the engineering philosophy behind RenewCred.',
      keywords: ['about', 'engineering', 'platform'],
    },
    blocks: [
      {
        id: 'about-1',
        type: 'heading',
        order: 0,
        data: { level: 'h1', text: 'About RenewCred Engineering' },
      },
      {
        id: 'about-2',
        type: 'paragraph',
        order: 1,
        data: {
          text: 'Designed specifically for high-growth tech platforms, RenewCred decouples content management from front-end presentation. This allows marketing teams to publish dynamic structured blocks while engineers maintain complete layout control.',
        },
      },
      {
        id: 'about-3',
        type: 'nestedList',
        order: 2,
        data: {
          items: [
            {
              text: 'Backend Architecture',
              children: [
                { text: 'Express.js RESTful API endpoint mapping' },
                { text: 'MongoDB Mongoose Document validation schemas' },
                { text: 'Helmet security headers & Rate Limiting protection' },
              ],
            },
            {
              text: 'Admin CMS Dashboard',
              children: [
                { text: 'Redux Toolkit centralized state tree' },
                { text: 'Independent block-level CRUD state controls' },
                { text: 'Real-time KaTeX LaTeX equation rendering' },
              ],
            },
          ],
        },
      },
    ],
  },
];

export const fetchPublishedPagesApi = async () => {
  try {
    return await api.get('/pages', { params: { status: 'published' } });
  } catch (err) {
    console.warn('[Public Frontend] API unreachable, using offline fallback data:', err.message);
    return { success: true, data: FALLBACK_PAGES };
  }
};

export const fetchPageBySlugApi = async (slug) => {
  try {
    return await api.get(`/pages/${slug}`);
  } catch (err) {
    console.warn(`[Public Frontend] API unreachable for slug '${slug}', using offline fallback data:`, err.message);
    const found = FALLBACK_PAGES.find((p) => p.slug === slug);
    if (found) {
      return { success: true, data: found };
    }
    return { success: true, data: FALLBACK_PAGES[0] };
  }
};
