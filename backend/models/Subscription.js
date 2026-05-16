/* =============================================
   اسم الملف: Subscription.js
   الوظيفة: Schema و Model للاشتراك في النشرة البريدية
   الزوار يُدخلون إيميلاتهم للاشتراك في أخبار الجمعية
   unique: true يمنع تسجيل نفس الإيميل مرتين
   ============================================= */

// نستورد mongoose للتعامل مع قاعدة البيانات
const mongoose = require("mongoose");

/**
 * subscriptionSchema — يُحدد شكل وقواعد بيانات الاشتراك
 * بسيط جداً: حقل واحد فقط هو الإيميل
 */
const subscriptionSchema = new mongoose.Schema(
  {
    // البريد الإلكتروني للمشترك
    // required: يجب إدخاله
    // unique: لا يمكن تسجيل نفس الإيميل مرتين (يُعيد خطأ 11000 عند التكرار)
    // lowercase: يُحوَّل لأحرف صغيرة تلقائياً (a@b.com = A@B.COM)
    // trim: تُزال المسافات الزائدة تلقائياً
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  {
    // timestamps يُضيف createdAt و updatedAt تلقائياً
    // createdAt مفيد لمعرفة متى اشترك كل شخص
    timestamps: true,

    // toJSON: نُخصّص شكل البيانات عند إرسالها للفرونتيند
    toJSON: {
      transform(doc, ret) {
        // نُضيف id بدون underscore
        ret.id = ret._id;
        // نحذف الحقول الداخلية لـ MongoDB
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// نُصدّر الـ Model ليُستخدم في subscriptionRoutes.js
// "Subscription" → collection "subscriptions" في MongoDB
module.exports = mongoose.model("Subscription", subscriptionSchema);
