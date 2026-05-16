const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const handleValidationError = (error, req, res, next) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: MESSAGES.INVALID_INPUT,
    error: error.message,
  });
};

const handleFileUploadError = (error, req, res, next) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: MESSAGES.FILE_UPLOAD_ERROR,
    error: error.message,
  });
};

const handleAllErrors = (err, req, res, next) => {
  logger.error("Unhandled error", { message: err.message, path: req.path, method: req.method });

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "حجم الملف كبير جداً (الحد الأقصى 5 ميغابايت)",
    });
  }

  if (err.name === "MulterError") {
    return handleFileUploadError(err, req, res, next);
  }

  // Mongoose CastError — invalid ObjectId (e.g. GET /api/donations/not-an-id)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "معرّف غير صالح",
    });
  }

  // Mongoose ValidationError — schema validation failure
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message).join("، ");
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: messages || MESSAGES.INVALID_INPUT,
    });
  }

  // Mongoose duplicate key (unique index violation)
  if (err.code === 11000) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: "البيانات موجودة مسبقاً",
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || MESSAGES.ERROR,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const handleNotFound = (req, res) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: MESSAGES.NOT_FOUND,
  });
};

module.exports = {
  errorHandler: handleAllErrors,
  notFoundHandler: handleNotFound,
  handleValidationError,
  handleFileUploadError,
};
