// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Messages (Arabic)
const MESSAGES = {
  SUCCESS: "تم بنجاح",
  ERROR: "حدث خطأ",
  INVALID_INPUT: "البيانات المدخلة غير صحيحة",
  NOT_FOUND: "لم يتم العثور على البيانات",
  SUBSCRIPTION_SUCCESS: "تم الاشتراك بنجاح! شكراً لاهتمامك.",
  FILE_UPLOAD_SUCCESS: "تم رفع الملف بنجاح",
  FILE_UPLOAD_ERROR: "فشل في رفع الملف",
  INVALID_EMAIL: "البريد الإلكتروني غير صالح",
  UNAUTHORIZED: "غير مصرح",
  FORBIDDEN: "ممنوع الوصول",
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
};
