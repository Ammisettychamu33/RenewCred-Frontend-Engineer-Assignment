import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { ApiError } from '../utils/responseHandler.js';

export const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'renewcred_production_jwt_secret_key_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return {
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};
