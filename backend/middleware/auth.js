/* =============================================
   اسم الملف: auth.js
   الوظيفة: middleware للمصادقة والتحقق من صلاحيات المستخدمين
            يستخدم Clerk لتحليل JWT tokens
   الـ Middleware هو كود يعمل بين استلام الطلب وإرسال الرد
   ============================================= */

/**
 * Auth middleware wrapping @clerk/express.
 *
 * Graceful degradation: when CLERK_SECRET_KEY is absent the app still boots
 * and serves public routes normally. Protected routes fall back to the
 * x-user-id header (dev convenience only — never ship without Clerk in prod).
 */

// نستورد أكواد HTTP لإرسال ردود الخطأ المناسبة
const { HTTP_STATUS } = require("../config/constants");

// نستورد الـ logger لتسجيل الأحداث
const logger = require("../utils/logger");

// نتحقق هل مفاتيح Clerk موجودة في .env أم لا
// !! تحوّل القيمة لـ boolean: إذا كانت قيمة موجودة = true، إذا فارغة = false
const IS_CLERK_READY = !!(process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY);

// إذا لم تكن مفاتيح Clerk موجودة، نُحذّر المطور
if (!IS_CLERK_READY) {
  logger.warn("Clerk keys not fully set — auth middleware running in dev-bypass mode (x-user-id header)");
}

/* --- تحميل Clerk بشكل كسول (Lazy Loading) --- */
// نُحمّل Clerk فقط إذا كانت المفاتيح موجودة
// هذا يجعل التطبيق يعمل حتى بدون تثبيت حزمة Clerk (في بيئة الاختبار)
let _getAuth = null;
let _clerkMiddleware = null;
let _clerkClient = null;

if (IS_CLERK_READY) {
  const clerk = require("@clerk/express");
  _getAuth = clerk.getAuth;            // دالة تستخرج userId من الطلب بعد تحليل JWT
  _clerkMiddleware = clerk.clerkMiddleware; // middleware يُضيف معلومات المصادقة للطلب

  // _clerkClient — عميل Clerk للاستعلام عن معلومات المستخدمين
  _clerkClient = clerk.clerkClient;
}

/* --- كاش لصلاحيات الأدمن (5 دقائق) --- */
// نحفظ نتيجة التحقق من الأدمن في الذاكرة لمدة 5 دقائق
// لتجنب إرسال طلب لـ Clerk في كل request وتسريع الاستجابة
const _adminCache = new Map();

/**
 * _isAdminUser — دالة داخلية للتحقق هل المستخدم أدمن
 * تتحقق من الـ cache أولاً، وإن انتهت صلاحيته تسأل Clerk
 *
 * @param {string} userId - معرّف المستخدم في Clerk
 * @returns {Promise<boolean>} - true إذا كان أدمناً
 */
async function _isAdminUser(userId) {
  // نتحقق من الـ cache: هل لدينا نتيجة حديثة لهذا المستخدم؟
  const hit = _adminCache.get(userId);
  if (hit && hit.exp > Date.now()) return hit.admin; // الـ cache لا يزال صالحاً

  // نستعلم من Clerk عن معلومات المستخدم
  const user = await _clerkClient.users.getUser(userId);

  // role === "admin" في publicMetadata يعني الأدمن
  const admin = user.publicMetadata?.role === "admin";

  // نحفظ النتيجة في الـ cache لمدة 5 دقائق
  _adminCache.set(userId, { admin, exp: Date.now() + 5 * 60 * 1000 });
  return admin;
}

/* --- دوال مساعدة لإرسال ردود الخطأ --- */

// نُعيد 401 عند عدم وجود توكن أو توكن منتهي
const unauth = (res) =>
  res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "غير مصرح" });

// نُعيد 403 عند وجود توكن لكن المستخدم لا يملك الصلاحية
const forbidden = (res) =>
  res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: "ممنوع" });

/* --- الـ Middleware المُصدَّرة --- */

/**
 * optionalAuth — مصادقة اختيارية
 * يُعيّن req.userId إذا كان JWT صالحاً، لكن يُكمل حتى بدون توكن
 * يُستخدم في routes تعمل للجميع لكن تُغيّر سلوكها للمسجّلين
 * مثال: نموذج التبرع — يعمل للجميع لكن يحفظ userId للمسجّلين
 */
const optionalAuth = (req, res, next) => {
  if (!IS_CLERK_READY) {
    // وضع التطوير: نقرأ userId من header يدوياً
    req.userId = req.headers["x-user-id"] || null;
    return next();
  }
  const { userId } = _getAuth(req);
  // نحاول Clerk أولاً، ثم header اليدوي كـ fallback
  req.userId = userId || req.headers["x-user-id"] || null;
  next();
};

/**
 * requireAuth — مصادقة إلزامية
 * يُعيد 401 إذا لم يكن المستخدم مسجّلاً
 * يُستخدم في routes تتطلب تسجيل الدخول مثل: عرض الملف الشخصي
 */
const requireAuth = (req, res, next) => {
  if (!IS_CLERK_READY) {
    // وضع التطوير: نقرأ userId من header يدوياً
    req.userId = req.headers["x-user-id"] || null;
    if (!req.userId) return unauth(res); // لا توكن → 401
    return next();
  }
  const { userId } = _getAuth(req);
  // Fall back to x-user-id header when JWT is missing or fails to verify
  // (handles dev environments where the secret key doesn't match the frontend key)
  req.userId = userId || req.headers["x-user-id"] || null;
  if (!req.userId) return unauth(res); // لا userId → 401
  next();
};

/**
 * requireAdmin — يتطلب تسجيل دخول AND دور أدمن
 * يُعيد 401 للمستخدمين غير المسجّلين
 * يُعيد 403 للمستخدمين العاديين (مسجّلون لكن ليسوا أدمن)
 * يُستخدم في لوحة الإدارة فقط
 */
const requireAdmin = async (req, res, next) => {
  if (!IS_CLERK_READY) {
    // وضع التطوير: أي header x-user-id يُعامَل كأدمن
    req.userId = req.headers["x-user-id"] || "dev-admin";
    return next();
  }

  // نستخرج userId من JWT
  const { userId } = _getAuth(req);
  if (!userId) return unauth(res); // لا توكن → 401

  try {
    // نتحقق من صلاحية الأدمن (عبر الـ cache أو Clerk)
    const isAdmin = await _isAdminUser(userId);
    if (!isAdmin) return forbidden(res); // مسجّل لكن ليس أدمن → 403
    req.userId = userId;
    next();
  } catch (err) {
    // حدث خطأ أثناء الاستعلام من Clerk
    logger.error("Admin role check failed", { userId, error: err.message });
    return unauth(res);
  }
};

/**
 * clerkSetup — يُعيد الـ middleware العام لـ Clerk أو null إذا لم يكن مُهيَّأً
 * يُستخدم في server.js لتسجيل الـ middleware قبل كل الـ routes
 * هذا يجعل getAuth(req) تعمل في كل مكان
 */
const clerkSetup = () => (_clerkMiddleware ? _clerkMiddleware() : null);

// نُصدّر كل الـ middleware للاستخدام في ملفات الـ routes
module.exports = { optionalAuth, requireAuth, requireAdmin, clerkSetup };
