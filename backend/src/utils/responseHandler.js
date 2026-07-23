/**
 * Standardized API Response Utilities
 */

export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
  });
};

export const errorResponse = (res, statusCode = 500, message = 'An error occurred', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
};

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
