/* =============================================
   اسم الملف: db.js
   الوظيفة: إنشاء الاتصال بقاعدة بيانات MongoDB عبر Mongoose
   ملاحظة: Mongoose يُخزّن الطلبات (buffer) حتى يتم الاتصال،
           لذا يمكن تشغيل السيرفر قبل اكتمال الاتصال بقاعدة البيانات
   ============================================= */

// dns — مكتبة Node.js لتحليل أسماء النطاقات (DNS lookup)
const dns = require("dns");

// mongoose — المكتبة الرئيسية للتعامل مع MongoDB في Node.js
const mongoose = require("mongoose");

// نستورد الـ logger لتسجيل نجاح أو فشل الاتصال
const logger = require("../utils/logger");

// Node 18+ غيّر ترتيب DNS ليُفضّل IPv6، وهذا يكسر اتصالات Atlas SRV
// نُجبره على استخدام IPv4 أولاً لضمان عمل المشروع على كل الأنظمة
dns.setDefaultResultOrder("ipv4first");

/**
 * connectDB — دالة الاتصال بقاعدة البيانات MongoDB
 *
 * تستخدم MONGO_URI من متغيرات البيئة (.env)
 * إذا لم يكن MONGO_URI موجوداً، تُسجّل تحذيراً وتُكمل البرنامج بدون DB
 * هذا مفيد في بيئات CI/CD أو عند اختبار الكود بدون قاعدة بيانات
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  // نقرأ الرابط من متغيرات البيئة
  const uri = process.env.MONGO_URI;

  // إذا لم يُعرَّف الرابط، نُحذّر ونكمل بدون قاعدة بيانات
  if (!uri) {
    logger.warn("MONGO_URI not set — running without database");
    return;
  }

  try {
    await mongoose.connect(uri, {
      family: 4,                       // نُجبر IPv4 — ضروري للاتصال بـ Atlas SRV على Node 18+
      serverSelectionTimeoutMS: 30000, // ننتظر 30 ثانية قبل التخلي (Atlas قد ينام وتحتاج وقتاً لإيقاظه)
      bufferCommands: true,            // نُخزّن الأوامر في queue حتى يتم الاتصال
    });

    // نخفي كلمة المرور من الرابط قبل طباعته في الـ logs (أمان)
    const safeUri = uri.replace(/\/\/[^@]+@/, "//***@");
    logger.info("MongoDB connected", { uri: safeUri });
  } catch (err) {
    // نسجّل الخطأ لكن لا نُوقف البرنامج هنا — server.js يتولى ذلك
    logger.error("MongoDB connection failed", { error: err.message });
  }
};

// نُصدّر الدالة لاستخدامها في server.js
module.exports = connectDB;
