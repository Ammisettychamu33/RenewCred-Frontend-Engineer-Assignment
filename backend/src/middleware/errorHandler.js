import { errorResponse } from '../utils/responseHandler.js';

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 404, `Endpoint not found - ${req.originalUrl}`);
};

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Mongoose Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value entered for field '${field}'. Must be unique.`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => val.message);
  }

  return errorResponse(res, statusCode, message, errors);
};
