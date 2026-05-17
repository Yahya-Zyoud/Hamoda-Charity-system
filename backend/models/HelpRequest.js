/* =============================================
   اسم الملف: HelpRequest.js
   الوظيفة: Schema و Model لطلبات المساعدة في MongoDB
   المواطنون يملؤون هذا النموذج للحصول على مساعدة
   ويقوم الأدمن بمراجعتها وقبولها أو رفضها
   ============================================= */

// نستورد mongoose للتعامل مع قاعدة البيانات
const mongoose = require("mongoose");

/**
 * helpRequestSchema — يُحدد شكل وقواعد بيانات طلب المساعدة
 */
const helpRequestSchema = new mongoose.Schema(
  {
    // معرّف المستخدم في Clerk — فارغ إذا قدّم الطلب بدون تسجيل دخول
    clerkId:      { type: String, default: "" },

    // الاسم الكامل لمقدّم الطلب — مطلوب
    fullName:     { type: String, required: true, trim: true },

    // رقم الهوية الوطنية — مطلوب للتحقق من هوية مقدّم الطلب
    nationalId:   { type: String, required: true, trim: true },

    // رقم الهاتف للتواصل مع مقدّم الطلب — مطلوب
    phone:        { type: String, required: true, trim: true },

    // البريد الإلكتروني — اختياري
    email:        { type: String, trim: true, default: "" },

    // المدينة التي يسكن فيها مقدّم الطلب — مطلوبة
    city:         { type: String, required: true, trim: true },

    // نوع المساعدة المطلوبة — يجب أن يكون من القائمة المحددة
    helpType: {
      type: String,
      required: true,
      enum: ["medical", "education", "food", "housing", "financial", "other"],
      // medical=طبي, education=تعليمي, food=غذائي, housing=سكني, financial=مالي, other=أخرى
    },

    // وصف تفصيلي لحالة مقدّم الطلب — مطلوب (20 حرف على الأقل في الـ service)
    description:  { type: String, required: true, trim: true },

    // مسار وثيقة التحقق المرفوعة (PDF أو صورة) — null إذا لم يرفع وثيقة
    documentPath: { type: String, default: null },

    // حالة الطلب — تبدأ بـ pending حتى يراجعها الأدمن
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    // timestamps يُضيف createdAt و updatedAt تلقائياً
    timestamps: true,

    // toJSON: نُخصّص شكل البيانات عند إرسالها للفرونتيند
    toJSON: {
      transform(doc, ret) {
        // نُضيف id بدون underscore ليسهل استخدامه في الفرونتيند
        ret.id = ret._id;
        // نحذف الحقول الداخلية لـ MongoDB
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// نُصدّر الـ Model ليُستخدم في الـ services
// "HelpRequest" → collection "helprequests" في MongoDB
module.exports = mongoose.model("HelpRequest", helpRequestSchema);
