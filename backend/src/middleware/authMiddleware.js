import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { errorResponse } from '../utils/responseHandler.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 401, 'Unauthorized: Access token is missing or invalid');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'renewcred_production_jwt_secret_key_2026_super_secure');

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return errorResponse(res, 401, 'Unauthorized: Admin user no longer exists');
    }

    req.user = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired, please log in again');
    }
    return errorResponse(res, 401, 'Invalid authentication token');
  }
};
