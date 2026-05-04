const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const { validateSubscribeEmail, validateProfileUpdate } = require("../validators");
const { ValidationError } = require("../utils/errors");

/**
 * Middleware to validate subscribe email
 */
const validateSubscribeEmailMiddleware = (req, res, next) => {
  try {
    const { email } = req.body;
    validateSubscribeEmail(email);
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_EMAIL,
    });
  }
};

/**
 * Middleware to validate profile update
 */
const validateProfileUpdateMiddleware = (req, res, next) => {
  try {
    validateProfileUpdate(req.body);
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_INPUT,
    });
  }
};

module.exports = {
  validateSubscribeEmail: validateSubscribeEmailMiddleware,
  validateProfileUpdate: validateProfileUpdateMiddleware,
};
