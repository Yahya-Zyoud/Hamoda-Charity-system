// middleware/errorHandler.js
// ─────────────────────────────────────────────────────────────────────────────
// Global error-handling middleware for Express.
// If ANY route throws an error (or calls next(error)), it ends up here
// instead of crashing the server.
//
// Express knows this is an error handler because it has FOUR parameters:
//   (err, req, res, next)  ← the "err" first param is the signal
//
// Registered LAST in server.js (after all routes).
// ─────────────────────────────────────────────────────────────────────────────

function errorHandler(err, req, res, next) {
  // Log the full error in the terminal (useful for debugging)
  console.error('❌ Server Error:', err.stack || err.message);

  // Mongoose validation error (e.g. required field missing at DB level)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: messages,
    });
  }

  // Mongoose duplicate key error (e.g. unique email already exists)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'هذا البريد الإلكتروني مستخدم بالفعل',
    });
  }

  // Mongoose bad ObjectId (e.g. /api/donations/not-a-valid-id)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'معرّف غير صحيح',
    });
  }

  // Default: unknown server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'حدث خطأ في الخادم',
  });
}

module.exports = errorHandler;
