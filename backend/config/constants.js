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
  SUCCESS: "تم بنجاح",
  ERROR: "حدث خطأ",
  INVALID_INPUT: "البيانات المدخلة غير صحيحة",
  NOT_FOUND: "لم يتم العثور على البيانات",
  SUBSCRIPTION_SUCCESS: "تم الاشتراك بنجاح! شكراً لاهتمامك.",
  FILE_UPLOAD_SUCCESS: "تم رفع الملف بنجاح",
  FILE_UPLOAD_ERROR: "فشل في رفع الملف",
  INVALID_EMAIL: "البريد الإلكتروني غير صالح",
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
