/* =============================================
   اسم الملف: validators.js
   الوظيفة: يحتوي على دوال التحقق من البيانات العامة
            ومعالجات middleware للنماذج المختلفة
   الفرق عن validateDonation.js: هذا الملف يحتوي على
   دوال تحقق عامة (email, phone, name) ومعالج نموذج الملف الشخصي
   ============================================= */

// نستورد الثوابت للوصول لقواعد التحقق وأكواد HTTP والرسائل
const { VALIDATION, MESSAGES, HTTP_STATUS } = require("../config/constants");

/* --- دوال التحقق المساعدة --- */
// هذه الدوال تُعيد true أو false فقط، لا تُرسل ردوداً

/**
 * checkEmail — يتحقق من صحة صيغة البريد الإلكتروني
 * يستخدم EMAIL_REGEX المُعرَّف في constants.js
 *
 * @param {string} email - الإيميل المُراد التحقق منه
 * @returns {boolean} - true إذا كانت الصيغة صحيحة
 */
const checkEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email.trim());
};

/**
 * checkPhone — يتحقق من صحة صيغة رقم الهاتف
 * يقبل أرقاماً ومسافات وشرطات وأقواس، 7 خانات على الأقل
 *
 * @param {string} phone - رقم الهاتف المُراد التحقق منه
 * @returns {boolean} - true إذا كانت الصيغة صحيحة
 */
const checkPhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone.trim());
};

/**
 * checkName — يتحقق من طول الاسم
 * يجب أن يكون بين MIN_NAME_LENGTH (2) و MAX_NAME_LENGTH (100) حرف
 *
 * @param {string} name - الاسم المُراد التحقق منه
 * @returns {boolean} - true إذا كان الطول مقبولاً
 */
const checkName = (name) => {
  const str = name.trim();
  return str.length >= VALIDATION.MIN_NAME_LENGTH &&
         str.length <= VALIDATION.MAX_NAME_LENGTH;
};

/**
 * checkBio — يتحقق من طول النبذة الشخصية
 * يمكن أن تكون فارغة (MIN = 0) لكن لا تتجاوز 500 حرف
 *
 * @param {string} bio - النبذة الشخصية المُراد التحقق منها
 * @returns {boolean} - true إذا كان الطول مقبولاً
 */
const checkBio = (bio) => {
  const str = bio.trim();
  return str.length >= VALIDATION.MIN_BIO_LENGTH &&
         str.length <= VALIDATION.MAX_BIO_LENGTH;
};

/* --- Middleware للتحقق من نموذج الاشتراك --- */

/**
 * checkSubscribeEmail — middleware يتحقق من إيميل نموذج الاشتراك
 * يُستخدم في route POST /api/subscribe
 * يُعيد 400 إذا كان الإيميل مفقوداً أو بصيغة خاطئة
 *
 * @param {Request} request - كائن الطلب
 * @param {Response} response - كائن الرد
 * @param {Function} next - دالة الانتقال للـ controller
 */
const checkSubscribeEmail = (request, response, next) => {
  const { email } = request.body;

  // نتحقق أن الإيميل موجود ومن نوع string
  if (!email || typeof email !== "string") {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_EMAIL,
    });
  }

  // نتحقق من صحة صيغة الإيميل
  if (!checkEmail(email)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_EMAIL,
    });
  }

  // الإيميل صحيح → نُكمل للـ controller
  next();
};

/* --- Middleware للتحقق من نموذج تعديل الملف الشخصي --- */

/**
 * checkProfileUpdate — middleware يتحقق من بيانات تعديل الملف الشخصي
 * الحقول كلها اختيارية — نتحقق فقط من الحقول التي أرسلها المستخدم
 * يُستخدم في route PUT /api/user/profile
 *
 * @param {Request} request - كائن الطلب (request.body يحتوي بيانات التعديل)
 * @param {Response} response - كائن الرد
 * @param {Function} next - دالة الانتقال للـ controller
 */
const checkProfileUpdate = (request, response, next) => {
  const { name, email, phone, bio } = request.body;

  // نتحقق من الاسم فقط إذا أرسله المستخدم
  if (name && !checkName(name)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "الاسم يجب أن يكون بين 2 و 100 حرف",
    });
  }

  // نتحقق من الإيميل فقط إذا أرسله المستخدم
  if (email && !checkEmail(email)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_EMAIL,
    });
  }

  // نتحقق من الهاتف فقط إذا أرسله المستخدم
  if (phone && !checkPhone(phone)) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "رقم الهاتف غير صحيح",
    });
  }

  // نتحقق من النبذة فقط إذا أرسلها المستخدم وكانت طويلة جداً
  if (bio && bio.trim().length > VALIDATION.MAX_BIO_LENGTH) {
    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `النبذة يجب أن تكون أقل من ${VALIDATION.MAX_BIO_LENGTH} حرف`,
    });
  }

  // كل البيانات صحيحة → نُكمل للـ controller
  next();
};

// نُصدّر الدوال بأسماء واضحة ومعبّرة
module.exports = {
  validateEmail: checkEmail,                    // للاستخدام المباشر في أي مكان
  validatePhone: checkPhone,                    // للاستخدام المباشر في أي مكان
  validateName: checkName,                      // للاستخدام المباشر في أي مكان
  validateBio: checkBio,                        // للاستخدام المباشر في أي مكان
  validateSubscribeEmail: checkSubscribeEmail,  // middleware للاشتراك
  validateProfileUpdate: checkProfileUpdate,    // middleware لتعديل الملف الشخصي
};
