/* eslint-disable no-unused-vars */
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const { ENV } = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Invalid or expired authentication token';
  }

  const response = {
    code: statusCode,
    message,
  };

  if (ENV.nodeEnv === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(statusCode).json(response);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Resource not found'));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

