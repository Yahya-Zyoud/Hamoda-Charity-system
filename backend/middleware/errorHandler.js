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
      message: "File size too large",
    });
  }

  if (err.name === "MulterError") {
    return handleFileUploadError(err, req, res, next);
  }

  // Mongoose validation errors and CastErrors are caller mistakes (400),
  // not server failures. We surface a safe message and avoid leaking the
  // model/field names from the raw mongoose error.
  if (err.name === "ValidationError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_INPUT,
      errors: Object.fromEntries(
        Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
      ),
    });
  }

  if (err.name === "CastError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_INPUT,
    });
  }

  if (err.status && Number.isInteger(err.status) && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      message: err.message || MESSAGES.ERROR,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.ERROR,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack, detail: err.message }),
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
