import express from 'express';
import { handleLogin, handleLogout, handleGetMe } from '../controllers/authController.js';
import { validateLogin } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', validateLogin, handleLogin);
router.post('/logout', handleLogout);
router.get('/me', protect, handleGetMe);

export default router;
