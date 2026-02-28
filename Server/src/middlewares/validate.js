const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    return next();
  } catch (err) {
    if (err.name === 'ZodError') {
      const message = err.issues?.map((i) => i.message).join(', ') || 'Validation error';
      return next(new ApiError(StatusCodes.BAD_REQUEST, message));
    }
    return next(err);
  }
};

module.exports = validate;

