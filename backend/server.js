/* =============================================
   اسم الملف: server.js
   الوظيفة: نقطة الدخول الرئيسية للباكيند — يقوم بتشغيل سيرفر Express
            ويربطه بقاعدة البيانات MongoDB
   المطور: فريق جمعية حمودة الخيرية
   ============================================= */

// نحمّل متغيرات البيئة من ملف .env (مثل PORT و MONGO_URI)
// يجب أن يكون هذا أول سطر في الملف قبل أي require آخر
require("dotenv").config();

// connectDB — دالة تتصل بقاعدة بيانات MongoDB
const connectDB = require("./config/db");

// clerkSetup — إعداد نظام المصادقة Clerk
const { clerkSetup } = require("./middleware/auth");

// express — الإطار الرئيسي لبناء السيرفر
const express = require("express");

// cors — يسمح للفرونتيند على بورت مختلف بالتحدث مع الباكيند
const cors = require("cors");

// helmet — يضيف headers أمنية لحماية التطبيق
const helmet = require("helmet");

// rateLimit — يحدد عدد الطلبات المسموحة خلال فترة زمنية (لمنع الإساءة)
const rateLimit = require("express-rate-limit");

// path — لبناء مسارات الملفات بشكل صحيح على أي نظام تشغيل
const path = require("path");

// نستورد إعدادات التطبيق (PORT، CORS_ORIGIN، إلخ)
const config = require("./config/environment");

// responseFormatter — middleware يضيف دوال res.sendSuccess و res.sendError
const { responseFormatter: formatResponse } = require("./middleware/responseFormatter");

// errorHandler — معالج الأخطاء العام، notFoundHandler — معالج المسارات غير الموجودة
const { errorHandler: handleAllErrors, notFoundHandler: handleNotFound } = require("./middleware/errorHandler");

// ensureUploadDir — تتأكد أن مجلد الرفع موجود
const { ensureUploadDir } = require("./utils/fileHandler");

// logger — أداة تسجيل الأحداث بدلاً من console.log المباشر
const logger = require("./utils/logger");

// كل الـ routes مجمّعة في ملف واحد
const apiRoutes = require("./routes");

// ننشئ تطبيق Express الرئيسي
const app = express();

/* --- إعداد الـ Middleware الأساسية --- */

// نسمح للفرونتيند بالتواصل مع الباكيند (Cross-Origin Resource Sharing)
// credentials: true — ضروري لإرسال الكوكيز مع الطلبات
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}));

// نضيف حماية أمنية عبر HTTP headers
app.use(helmet());

// نجعل Express يفهم JSON القادم في body الطلبات
app.use(express.json());

// نجعل Express يفهم البيانات المرسلة من HTML forms
app.use(express.urlencoded({ extended: true }));

// نجعل مجلد الـ uploads متاحاً للعامة (يعني يمكن الوصول للصور برابط مباشر)
app.use("/uploads", express.static(config.UPLOAD_DIR));

// نتأكد أن مجلد الرفع موجود، وإن لم يكن موجوداً نُنشئه
ensureUploadDir();

/* --- إعداد نظام المصادقة Clerk --- */

// نُعدّ Clerk JWT verification قبل أي route
// إذا CLERK_SECRET_KEY غير موجود يرجع null ولا يُضاف
const clerkMw = clerkSetup();
if (clerkMw) app.use(clerkMw);

// نضيف الـ middleware الذي يُضيف res.sendSuccess و res.sendError لكل الطلبات
app.use(formatResponse);

/* --- Rate Limiting لحماية من الإساءة --- */

// نحدد 5 محاولات اشتراك كل 15 دقيقة من نفس الـ IP
// هذا لمنع Spam Bots من ملء قاعدة البيانات بإيميلات وهمية
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة بالميلي ثانية
  max: 5,                    // أقصى عدد طلبات مسموحة
  message: { success: false, message: "Too many subscribe requests" },
});
app.use(`${config.API_PREFIX}/subscribe`, subscribeLimiter);

/* --- تسجيل كل الـ Routes --- */

// كل الـ routes تبدأ بـ /api (مثلاً: /api/projects، /api/donations)
app.use(config.API_PREFIX, apiRoutes);

/* --- Health Check Endpoint --- */

// مسار بسيط للتأكد أن السيرفر يعمل — مفيد للـ deployment
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

/* --- معالجة الأخطاء (يجب أن تكون في النهاية دائماً) --- */

// إذا لم يطابق الطلب أي route → يُعيد 404
app.use(handleNotFound);

// إذا حدث خطأ في أي route → يُعيد رسالة خطأ مناسبة
app.use(handleAllErrors);

/* --- تشغيل السيرفر --- */

const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

// نتحقق هل الملف يُشغَّل مباشرة (node server.js) أم يُستورد كـ module
// في بيئة Vercel (serverless) لا نستدعي listen()
if (require.main === module) {
  // نبدأ السيرفر فوراً حتى لا ينتظر الفرونتيند اتصال MongoDB
  // Mongoose يُخزّن الطلبات في queue حتى يتصل بقاعدة البيانات
  const server = app.listen(PORT, () => {
    logger.info("Server running", {
      port: PORT,
      environment: NODE_ENV,
      url: `http://localhost:${PORT}`,
    });
  });

  // نحاول الاتصال بـ MongoDB بعد تشغيل السيرفر (بالتوازي)
  connectDB().catch((err) => {
    logger.error("MongoDB connection failed — DB routes will return errors until resolved", {
      error: err.message,
      hint: "Run: docker compose up -d", // حل سريع في بيئة التطوير
    });
  });

  /**
   * gracefulShutdown — دالة إيقاف التشغيل بشكل نظيف
   * تُغلق السيرفر أولاً، ثم تُغلق اتصال MongoDB، ثم تُخرج من البرنامج
   * هذا أفضل من إيقاف السيرفر فجأة لأنه يُكمل الطلبات الجارية أولاً
   *
   * @param {string} signal - اسم الإشارة المُستلمة (SIGTERM أو SIGINT)
   */
  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info("HTTP server closed");
      const mongoose = require("mongoose");
      // نُغلق اتصال MongoDB بشكل نظيف
      mongoose.connection.close(false).then(() => {
        logger.info("MongoDB connection closed");
        process.exit(0); // خروج ناجح
      }).catch(() => process.exit(1)); // خروج بخطأ
    });
    // إذا مرت 10 ثوان ولم يُغلق السيرفر، نُجبره على الإغلاق
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  // نستمع لإشارات الإيقاف من نظام التشغيل
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // إشارة الإيقاف من Docker/Heroku
  process.on("SIGINT",  () => gracefulShutdown("SIGINT"));  // Ctrl+C في الـ Terminal
} else {
  // بيئة Serverless (مثل Vercel): نبدأ الاتصال بقاعدة البيانات فقط بدون listen
  connectDB().catch((err) => {
    logger.error("MongoDB connection failed (serverless)", { error: err.message });
  });
}

/* --- معالجة الأخطاء غير المتوقعة --- */

// Promise لم يُعالَج خطؤها — نسجّل الخطأ بدلاً من الصمت
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

// خطأ غير متوقع في البرنامج — نسجّله ونوقف البرنامج (لأنه في حالة غير مستقرة)
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.message });
  process.exit(1);
});

// نُصدّر التطبيق ليُستخدم في بيئات Serverless أو الاختبارات
module.exports = app;
