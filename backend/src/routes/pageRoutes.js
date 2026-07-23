import express from 'express';
import {
  handleGetPages,
  handleGetPageBySlug,
  handleCreatePage,
  handleUpdatePage,
  handleDeletePage,
} from '../controllers/pageController.js';
import { validatePage } from '../validators/pageValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', handleGetPages);
router.get('/:slug', handleGetPageBySlug);

// Protected Admin routes
router.post('/', protect, validatePage, handleCreatePage);
router.put('/:id', protect, validatePage, handleUpdatePage);
router.delete('/:id', protect, handleDeletePage);

export default router;
