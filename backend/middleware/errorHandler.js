/* =============================================
   اسم الملف: errorHandler.js
   الوظيفة: middleware مركزي لمعالجة جميع الأخطاء في التطبيق
            يُفرّق بين أنواع الأخطاء ويُعيد رسائل مناسبة
   كيف يعمل؟ يُسجَّل في آخر server.js ويلتقط كل خطأ يُرسَل عبر next(err)
   ============================================= */

// نستورد الثوابت لاستخدام أكواد HTTP ورسائل الخطأ الموحّدة
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

// نستورد الـ logger لتسجيل الأخطاء بدلاً من console.error المباشر
const logger = require("../utils/logger");

/**
 * handleValidationError — معالج أخطاء التحقق من البيانات
 * يُعيد 400 مع رسالة توضح أن البيانات المُدخلة غير صحيحة
 *
 * @param {Error} error - كائن الخطأ
 * @param {Request} req - كائن الطلب
 * @param {Response} res - كائن الرد
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
const handleValidationError = (error, req, res, next) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: MESSAGES.INVALID_INPUT,
    error: error.message,
  });
};

/**
 * handleFileUploadError — معالج أخطاء رفع الملفات
 * يُعيد 400 عند فشل رفع ملف (مثل: حجم كبير، نوع غير مدعوم)
 *
 * @param {Error} error - كائن الخطأ من multer
 * @param {Request} req - كائن الطلب
 * @param {Response} res - كائن الرد
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
const handleFileUploadError = (error, req, res, next) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: MESSAGES.FILE_UPLOAD_ERROR,
    error: error.message,
  });
};

/**
 * handleAllErrors — معالج الأخطاء العام (Global Error Handler)
 * يلتقط كل الأخطاء التي تُمرَّر عبر next(err) في أي route
 * يُفرّق بين أنواع الأخطاء ويُعيد رسائل مناسبة بالعربية
 *
 * ملاحظة: Express يعرف أن هذه middleware معالجة للأخطاء لأن لها 4 parameters
 *
 * @param {Error} err - كائن الخطأ
 * @param {Request} req - كائن الطلب
 * @param {Response} res - كائن الرد
 * @param {Function} next - دالة الانتقال (لا تُستخدم لكن ضرورية للتوقيع)
 */
const handleAllErrors = (err, req, res, next) => {
  // نسجّل كل الأخطاء مع معلومات الطلب لتسهيل تتبعها
  logger.error("Unhandled error", { message: err.message, path: req.path, method: req.method });

  // خطأ multer: تجاوز حجم الملف الأقصى المسموح (5MB)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "حجم الملف كبير جداً (الحد الأقصى 5 ميغابايت)",
    });
  }

  // أي خطأ آخر من multer (مثل: نوع ملف غير مدعوم)
  if (err.name === "MulterError") {
    return handleFileUploadError(err, req, res, next);
  }

  // Mongoose CastError — يحدث عند إرسال ID غير صالح (مثل: /api/donations/abc)
  // ObjectId يجب أن يكون بصيغة محددة مثل: 507f1f77bcf86cd799439011
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "معرّف غير صالح",
    });
  }

  // Mongoose ValidationError — يحدث عند محاولة حفظ بيانات تخالف قواعد الـ Schema
  // مثل: حقل required فارغ، أو قيمة خارج الـ enum
  if (err.name === "ValidationError") {
    // نجمع كل رسائل الخطأ من كل الحقول في جملة واحدة
    const messages = Object.values(err.errors).map((e) => e.message).join("، ");
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: messages || MESSAGES.INVALID_INPUT,
    });
  }

  // Mongoose duplicate key — يحدث عند محاولة إدخال قيمة موجودة في حقل unique
  // مثل: إيميل مسجّل مسبقاً في الـ subscriptions
  if (err.code === 11000) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: "البيانات موجودة مسبقاً",
    });
  }

  // أي خطأ آخر غير متوقع → نُعيد 500
  // في بيئة التطوير نُرسل الـ stack trace لتسهيل تتبع الخطأ
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || MESSAGES.ERROR,
    // نُضيف الـ stack trace فقط في التطوير (لا نكشفه للمستخدمين في الإنتاج)
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * handleNotFound — معالج المسارات غير الموجودة
 * يُعيد 404 عند طلب route غير معرَّفة في التطبيق
 * يُسجَّل في آخر server.js قبل handleAllErrors
 *
 * @param {Request} req - كائن الطلب
 * @param {Response} res - كائن الرد
 */
const handleNotFound = (req, res) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: MESSAGES.NOT_FOUND,
  });
};

// نُصدّر كل المعالجات تحت أسماء واضحة
module.exports = {
  errorHandler: handleAllErrors,           // المعالج العام — يُسجَّل آخراً في server.js
  notFoundHandler: handleNotFound,         // معالج 404 — يُسجَّل قبل errorHandler
  handleValidationError,                   // للاستخدام المباشر في controllers
  handleFileUploadError,                   // للاستخدام المباشر في routes الرفع
};
