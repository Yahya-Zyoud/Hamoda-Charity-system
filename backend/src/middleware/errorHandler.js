const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");
const { ValidationError, FileUploadError } = require("../utils/errors");

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error("Error handler caught:", { 
    message: err.message, 
    name: err.name,
    statusCode: err.statusCode,
  });

  // Handle file size limit errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "حجم الملف كبير جداً",
    });
  }

  // Handle multer errors
  if (err.name === "MulterError") {
    logger.warn("Multer error:", { error: err.message });
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.FILE_UPLOAD_ERROR,
      error: err.message,
    });
  }

  // Handle validation errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle file upload errors
  if (err instanceof FileUploadError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle operational errors
  if (err.isOperational) {
    return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || MESSAGES.ERROR,
    });
  }

  // Handle unexpected errors
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.ERROR,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  logger.warn("404 Not Found:", { path: req.path, method: req.method });
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: MESSAGES.NOT_FOUND,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
