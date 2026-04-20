const { HTTP_STATUS, MESSAGES } = require("../config/constants");

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
  console.error("Error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "حجم الملف كبير جداً",
    });
  }

  if (err.name === "MulterError") {
    return handleFileUploadError(err, req, res, next);
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.ERROR,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
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
