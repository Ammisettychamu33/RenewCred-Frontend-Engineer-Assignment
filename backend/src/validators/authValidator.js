import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseHandler.js';

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        400,
        'Validation failed',
        errors.array().map((err) => err.msg)
      );
    }
    next();
  },
];
