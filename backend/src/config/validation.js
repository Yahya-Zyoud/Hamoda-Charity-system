// Validation Rules - Centralized validation patterns and constraints
const VALIDATION = {
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Phone validation
  PHONE_REGEX: /^[\d\s\-\+\(\)]{7,}$/,
  
  // Name constraints
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  
  // Bio constraints
  MIN_BIO_LENGTH: 10,
  MAX_BIO_LENGTH: 500,
  
  // Password constraints (for future use)
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  // File upload constraints
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/webp"],
  
  // Social media patterns
  SOCIAL_MEDIA_URLS: {
    TWITTER: /^https?:\/\/(?:www\.)?twitter\.com\//,
    FACEBOOK: /^https?:\/\/(?:www\.)?facebook\.com\//,
    LINKEDIN: /^https?:\/\/(?:www\.)?linkedin\.com\//,
    INSTAGRAM: /^https?:\/\/(?:www\.)?instagram\.com\//,
  },
};

module.exports = VALIDATION;
