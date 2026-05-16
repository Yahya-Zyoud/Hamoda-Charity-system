/* =============================================
   اسم الملف: environment.js
   الوظيفة: يقرأ متغيرات البيئة من process.env ويُصدّرها
            بشكل موحّد لبقية التطبيق
   لماذا نستخدمه؟ بدلاً من كتابة process.env.PORT في كل ملف،
   نقرأها مرة واحدة هنا وتُستورد من مكان واحد
   ============================================= */

// نقرأ رقم البورت من متغيرات البيئة، وإن لم يُحدَّد نستخدم 5000 كافتراضي
const port = process.env.PORT || 5000;

// نقرأ بيئة التشغيل: "development" أثناء التطوير، "production" عند النشر
const env = process.env.NODE_ENV || "development";

/**
 * parseCorsOrigin — دالة تحليل إعداد CORS
 * تدعم ثلاثة أشكال:
 *  1. قيمة واحدة: "http://localhost:5173"
 *  2. قائمة مفصولة بفاصلة: "http://localhost:5173,https://mysite.com"
 *  3. النجمة "*" للسماح لكل الأصول (خطر في الإنتاج!)
 *
 * @param {string} raw - القيمة الخام من متغير البيئة CORS_ORIGIN
 * @returns {string|string[]} - أصل واحد أو مصفوفة أصول
 */
function parseCorsOrigin(raw) {
  // إذا لم يُحدَّد CORS_ORIGIN، نسمح للفرونتيند المحلي فقط
  if (!raw) return "http://localhost:5173";

  const trimmed = raw.trim();

  // النجمة تعني السماح لجميع الأصول — لا تستخدمها في الإنتاج
  if (trimmed === "*") return "*";

  // إذا كانت قائمة مفصولة بفاصلة، نحوّلها لمصفوفة
  if (trimmed.includes(",")) return trimmed.split(",").map((s) => s.trim());

  // قيمة واحدة — نُعيدها كما هي بعد إزالة المسافات
  return trimmed;
}

// نُصدّر كل الإعدادات كـ object واحد
module.exports = {
  // رقم البورت الذي يستمع عليه السيرفر
  PORT: port,

  // بيئة التشغيل — تؤثر على تفاصيل رسائل الخطأ
  NODE_ENV: env,

  // بادئة كل الـ API routes (كل طلب يبدأ بـ /api)
  API_PREFIX: "/api",

  // الأصول المسموح لها بإرسال طلبات للباكيند
  CORS_ORIGIN: parseCorsOrigin(process.env.CORS_ORIGIN),

  // رابط الاتصال بقاعدة البيانات MongoDB
  MONGO_URI: process.env.MONGO_URI || "",

  // مجلد تخزين الملفات المرفوعة (الصور والوثائق)
  UPLOAD_DIR: "public/uploads",

  // الحد الأقصى لحجم الملف المرفوع: 5 ميغابايت
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  // أنواع الصور المسموح برفعها فقط
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],

  // مفتاح Clerk السري — ضروري للتحقق من JWT tokens
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",

  // مفتاح Stripe السري — للدفع الإلكتروني (لم يُطبَّق بعد)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",

  // رابط الفرونتيند — يُستخدم في رسائل البريد الإلكتروني وغيرها
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
