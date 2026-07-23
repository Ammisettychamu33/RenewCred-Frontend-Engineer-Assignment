import Page from '../models/Page.js';
import { ApiError } from '../utils/responseHandler.js';

export const getAllPages = async (query = {}) => {
  const { status, search } = query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  return await Page.find(filter).sort({ updatedAt: -1 });
};

export const getPageBySlug = async (slug, publicOnly = false) => {
  const filter = { slug: slug.toLowerCase() };
  if (publicOnly) {
    filter.status = 'published';
  }
  const page = await Page.findOne(filter);
  if (!page) {
    throw new ApiError(404, 'Page not found');
  }
  return page;
};

export const createPage = async (pageData) => {
  const existing = await Page.findOne({ slug: pageData.slug.toLowerCase() });
  if (existing) {
    throw new ApiError(409, `A page with slug '${pageData.slug}' already exists.`);
  }

  // Ensure block order
  if (pageData.blocks && Array.isArray(pageData.blocks)) {
    pageData.blocks = pageData.blocks.map((block, index) => ({
      ...block,
      order: index,
    }));
  }

  const page = new Page(pageData);
  return await page.save();
};

export const updatePage = async (id, pageData) => {
  const existing = await Page.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Page not found');
  }

  if (pageData.slug && pageData.slug.toLowerCase() !== existing.slug) {
    const slugConflict = await Page.findOne({
      slug: pageData.slug.toLowerCase(),
      _id: { $ne: id },
    });
    if (slugConflict) {
      throw new ApiError(409, `Slug '${pageData.slug}' is already in use by another page.`);
    }
  }

  if (pageData.blocks && Array.isArray(pageData.blocks)) {
    pageData.blocks = pageData.blocks.map((block, index) => ({
      ...block,
      order: index,
    }));
  }

  return await Page.findByIdAndUpdate(id, pageData, { new: true, runValidators: true });
};

export const deletePage = async (id) => {
  const page = await Page.findByIdAndDelete(id);
  if (!page) {
    throw new ApiError(404, 'Page not found');
  }
  return page;
};
