/* =============================================
   اسم الملف: responseFormatter.js
   الوظيفة: يُضيف دوال مساعدة لكائن res في كل طلب
            حتى يُمكن إرسال ردود موحّدة الشكل من أي controller
   الاستخدام: res.sendSuccess(data) أو res.sendError("رسالة")
   ============================================= */

// نستورد الثوابت لاستخدام الرسائل وأكواد HTTP الموحّدة
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

/**
 * makeSuccessResponse — تُنشئ كائن رد ناجح بشكل موحّد
 * كل الردود الناجحة في التطبيق تبدو بنفس الشكل
 *
 * @param {any} data - البيانات المُرجَعة (مصفوفة، كائن، null)
 * @param {string} message - رسالة نجاح اختيارية
 * @param {number} statusCode - كود HTTP (افتراضي 200)
 * @returns {{ success: true, message: string, data: any }}
 */
const makeSuccessResponse = (data, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
  return {
    success: true,  // يُعلم الفرونتيند أن العملية نجحت
    message,        // رسالة للمستخدم
    data,           // البيانات الفعلية
  };
};

/**
 * makeErrorResponse — تُنشئ كائن رد خطأ بشكل موحّد
 * كل ردود الخطأ في التطبيق تبدو بنفس الشكل
 *
 * @param {string} message - رسالة الخطأ للمستخدم
 * @param {number} statusCode - كود HTTP (افتراضي 500)
 * @returns {{ success: false, message: string, statusCode: number }}
 */
const makeErrorResponse = (message = MESSAGES.ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  return {
    success: false, // يُعلم الفرونتيند أن العملية فشلت
    message,        // رسالة الخطأ للمستخدم
    statusCode,     // الكود المُرسَل (مفيد للـ debugging)
  };
};

/**
 * formatResponse — الـ middleware الرئيسي
 * يُضيف دالتَي sendSuccess و sendError لكائن res في كل طلب
 * يُسجَّل في server.js مرة واحدة ويعمل على كل الـ routes تلقائياً
 *
 * الاستخدام في Controllers:
 *   res.sendSuccess(projects)              → 200 مع البيانات
 *   res.sendSuccess(project, "تم الإنشاء", 201) → 201 مع رسالة مخصصة
 *   res.sendError("لم يُوجد", 404)         → 404 مع رسالة الخطأ
 *
 * @param {Request} request - كائن الطلب
 * @param {Response} response - كائن الرد (سيُضاف له الدوال)
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
const formatResponse = (request, response, next) => {
  /**
   * response.sendSuccess — يُرسل رد نجاح بكود HTTP محدد
   * @param {any} data - البيانات المُرجَعة
   * @param {string} message - رسالة نجاح اختيارية
   * @param {number} statusCode - كود HTTP (افتراضي 200)
   */
  response.sendSuccess = (data, message, statusCode = HTTP_STATUS.OK) => {
    return response.status(statusCode).json(makeSuccessResponse(data, message, statusCode));
  };

  /**
   * response.sendError — يُرسل رد خطأ بكود HTTP محدد
   * @param {string} message - رسالة الخطأ للمستخدم
   * @param {number} statusCode - كود HTTP (افتراضي 500)
   */
  response.sendError = (message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    return response.status(statusCode).json(makeErrorResponse(message, statusCode));
  };

  // ننتقل للـ middleware التالي بعد إضافة الدوال
  next();
};

// نُصدّر الـ middleware والدوال المساعدة
module.exports = {
  responseFormatter: formatResponse,      // الـ middleware — يُستخدم في server.js
  successResponse: makeSuccessResponse,   // الدالة المساعدة — للاستخدام المباشر إن احتجنا
  errorResponse: makeErrorResponse,       // الدالة المساعدة — للاستخدام المباشر إن احتجنا
};
