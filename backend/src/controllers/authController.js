import { loginAdmin } from '../services/authService.js';
import { successResponse } from '../utils/responseHandler.js';

export const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (req, res) => {
  return successResponse(res, 200, 'Logged out successfully', null);
};

export const handleGetMe = async (req, res) => {
  return successResponse(res, 200, 'User profile retrieved', { user: req.user });
};
