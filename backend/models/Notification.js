/* =============================================
   اسم الملف: Notification.js
   الوظيفة: Schema و Model للإشعارات في MongoDB
   الإشعارات تُنشأ تلقائياً عند وصول تبرع جديد أو طلب مساعدة جديد
   ويراها الأدمن في لوحة التحكم
   ============================================= */

// نستورد mongoose للتعامل مع قاعدة البيانات
const mongoose = require("mongoose");

/**
 * notificationSchema — يُحدد شكل وقواعد بيانات الإشعار
 */
const notificationSchema = new mongoose.Schema(
  {
    // نوع الإشعار — يُحدد الأيقونة والتنسيق في الفرونتيند
    // request = طلب مساعدة جديد
    // donation = تبرع جديد
    // system  = إشعار نظام عام
    type:      { type: String, enum: ["request", "donation", "system"], default: "system" },

    // نص الإشعار الذي يراه الأدمن — مطلوب
    // مثال: "تبرع جديد بمبلغ $100 من محمد أحمد"
    msg:       { type: String, required: true, trim: true },

    // هل قرأ الأدمن الإشعار؟ false = لم يُقرأ بعد (يظهر كـ نقطة حمراء)
    read:      { type: Boolean, default: false },

    // معرّف العنصر المرتبط بالإشعار (التبرع أو الطلب)
    // يُستخدم للتنقل المباشر للعنصر عند النقر على الإشعار
    relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  {
    // timestamps يُضيف createdAt و updatedAt تلقائياً
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

// نُصدّر الـ Model ليُستخدم في notificationService.js وفي الـ services الأخرى
// "Notification" → collection "notifications" في MongoDB
module.exports = mongoose.model("Notification", notificationSchema);
