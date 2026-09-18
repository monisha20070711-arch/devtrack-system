/**
 * DevTrack - Centralized Error & 404 Handling Middleware
 */

// 404 Handler for undefined routes
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

// Global Express Error Handler
function errorHandler(err, req, res, next) {
  console.error('[Server Error]', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = { notFoundHandler, errorHandler };
