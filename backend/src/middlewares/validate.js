const { AppError } = require('../utils/AppError');

function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError('Invalid request payload.', 400, parsed.error.flatten()));
    }
    req.body = parsed.data;
    next();
  };
}

module.exports = { validateBody };
