const VALIDATION = require("../config/validation");
const { ValidationError } = require("../utils/errors");

/**
 * Validate user name
 */
const validateName = (name) => {
  if (!name || typeof name !== "string") {
    throw new ValidationError("الاسم مطلوب");
  }
  const str = name.trim();
  if (str.length < VALIDATION.MIN_NAME_LENGTH || str.length > VALIDATION.MAX_NAME_LENGTH) {
    throw new ValidationError(`الاسم يجب أن يكون بين ${VALIDATION.MIN_NAME_LENGTH} و ${VALIDATION.MAX_NAME_LENGTH} أحرف`);
  }
  return str;
};

/**
 * Validate user bio
 */
const validateBio = (bio) => {
  if (!bio) return ""; // Optional field
  if (typeof bio !== "string") {
    throw new ValidationError("السيرة الذاتية يجب أن تكون نصاً");
  }
  const str = bio.trim();
  if (str.length > VALIDATION.MAX_BIO_LENGTH) {
    throw new ValidationError(`السيرة الذاتية يجب ألا تتجاوز ${VALIDATION.MAX_BIO_LENGTH} أحرف`);
  }
  return str;
};

/**
 * Validate phone number
 */
const validatePhone = (phone) => {
  if (!phone || typeof phone !== "string") {
    throw new ValidationError("رقم الهاتف مطلوب");
  }
  if (!VALIDATION.PHONE_REGEX.test(phone.trim())) {
    throw new ValidationError("رقم الهاتف غير صالح");
  }
  return phone.trim();
};

/**
 * Validate profile update request
 */
const validateProfileUpdate = (profileData) => {
  const errors = [];
  
  if (profileData.name) {
    try {
      validateName(profileData.name);
    } catch (error) {
      errors.push(error.message);
    }
  }
  
  if (profileData.phone) {
    try {
      validatePhone(profileData.phone);
    } catch (error) {
      errors.push(error.message);
    }
  }
  
  if (profileData.bio) {
    try {
      validateBio(profileData.bio);
    } catch (error) {
      errors.push(error.message);
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
  
  return {
    name: profileData.name ? validateName(profileData.name) : undefined,
    phone: profileData.phone ? validatePhone(profileData.phone) : undefined,
    bio: profileData.bio ? validateBio(profileData.bio) : undefined,
  };
};

module.exports = {
  validateName,
  validateBio,
  validatePhone,
  validateProfileUpdate,
};
