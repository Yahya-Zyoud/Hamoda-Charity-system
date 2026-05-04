const VALIDATION = require("../config/validation");
const { ValidationError } = require("../utils/errors");

/**
 * Email validation
 */
const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    throw new ValidationError("البريد الإلكتروني مطلوب");
  }
  if (!VALIDATION.EMAIL_REGEX.test(email.trim())) {
    throw new ValidationError("البريد الإلكتروني غير صالح");
  }
  return email.trim().toLowerCase();
};

/**
 * Subscribe email validation
 */
const validateSubscribeEmail = (email) => {
  return validateEmail(email);
};

module.exports = {
  validateEmail,
  validateSubscribeEmail,
};
