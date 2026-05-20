const statusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const msgs = {
  SUCCESS: "Success",
  ERROR: "An error occurred",
  INVALID_INPUT: "Invalid input data",
  NOT_FOUND: "Resource not found",
  SUBSCRIPTION_SUCCESS: "Subscribed successfully! Thank you for your interest.",
  FILE_UPLOAD_SUCCESS: "File uploaded successfully",
  FILE_UPLOAD_ERROR: "File upload failed",
  INVALID_EMAIL: "Invalid email address",
};

const rules = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]{7,}$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_BIO_LENGTH: 10,
  MAX_BIO_LENGTH: 500,
};

module.exports = {
  HTTP_STATUS: statusCodes,
  MESSAGES: msgs,
  VALIDATION: rules,
};
