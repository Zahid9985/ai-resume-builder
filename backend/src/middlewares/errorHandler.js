function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) {
    console.error('[API error]', {
      method: req.method,
      path: req.originalUrl,
      statusCode,
      message: error.message
    });
  }
  const payload = {
    success: false,
    error: {
      message: statusCode === 500 ? 'Unexpected server error' : error.message
    }
  };

  if (error.details) payload.error.details = error.details;
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    payload.error.debug = error.message;
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler, notFoundHandler };
