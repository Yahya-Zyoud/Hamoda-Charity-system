const { VALIDATION, MESSAGES, HTTP_STATUS } = require("../config/constants");

const checkEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email.trim());
};

const checkPhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone.trim());
};

const checkName = (name) => {
  const str = name.trim();
  return str.length >= VALIDATION.MIN_NAME_LENGTH &&
         str.length <= VALIDATION.MAX_NAME_LENGTH;
};

const checkBio = (bio) => {
  const str = bio.trim();
  return str.length >= VALIDATION.MIN_BIO_LENGTH &&
         str.length <= VALIDATION.MAX_BIO_LENGTH;
};

const checkSubscribeEmail = (request, response, next) => {
  const { email } = request.body;

  if (!email || typeof email !== "string") {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_EMAIL,
    });
  }

  if (!checkEmail(email)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_EMAIL,
    });
  }

  next();
};

const checkProfileUpdate = (request, response, next) => {
  const { name, email, phone, bio } = request.body;

  if (name && !checkName(name)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Name must be between ${VALIDATION.MIN_NAME_LENGTH} and ${VALIDATION.MAX_NAME_LENGTH} characters`,
    });
  }

  if (email && !checkEmail(email)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_EMAIL,
    });
  }

  if (phone && !checkPhone(phone)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Invalid phone number",
    });
  }

  if (bio && bio.trim().length > VALIDATION.MAX_BIO_LENGTH) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Bio must be less than ${VALIDATION.MAX_BIO_LENGTH} characters`,
    });
  }

  next();
};

module.exports = {
  validateEmail: checkEmail,
  validatePhone: checkPhone,
  validateName: checkName,
  validateBio: checkBio,
  validateSubscribeEmail: checkSubscribeEmail,
  validateProfileUpdate: checkProfileUpdate,
};
