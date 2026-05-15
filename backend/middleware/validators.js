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
      message: "الاسم يجب أن يكون بين 2 و 100 حرف",
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
      message: "رقم الهاتف غير صحيح",
    });
  }

  if (bio && !checkBio(bio)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "النبذة يجب أن تكون بين 10 و 500 حرف",
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
