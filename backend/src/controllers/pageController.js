import {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} from '../services/pageService.js';
import { successResponse } from '../utils/responseHandler.js';

export const handleGetPages = async (req, res, next) => {
  try {
    const pages = await getAllPages(req.query);
    return successResponse(res, 200, 'Pages retrieved successfully', pages);
  } catch (error) {
    next(error);
  }
};

export const handleGetPageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    // If request comes from unauthenticated user, require status=published
    const publicOnly = !req.user;
    const page = await getPageBySlug(slug, publicOnly);
    return successResponse(res, 200, 'Page retrieved successfully', page);
  } catch (error) {
    next(error);
  }
};

export const handleCreatePage = async (req, res, next) => {
  try {
    const page = await createPage(req.body);
    return successResponse(res, 201, 'Page created successfully', page);
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updatePage(id, req.body);
    return successResponse(res, 200, 'Page updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const handleDeletePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deletePage(id);
    return successResponse(res, 200, 'Page deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};
