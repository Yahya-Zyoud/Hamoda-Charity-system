/* =============================================
   اسم الملف: Donation.js
   الوظيفة: Schema و Model لنموذج التبرعات في MongoDB
   الـ Schema هو قالب يُحدد شكل البيانات المحفوظة
   الـ Model هو الواجهة التي نتعامل بها مع مجموعة البيانات (Collection)
   ============================================= */

// نستورد mongoose للتعامل مع قاعدة البيانات MongoDB
const mongoose = require("mongoose");

/**
 * donationSchema — يُحدد شكل وقواعد بيانات التبرع في قاعدة البيانات
 * كل حقل له نوع وقواعد تحقق تُطبَّق تلقائياً عند الحفظ
 */
const donationSchema = new mongoose.Schema(
  {
    // نوع التبرع — مطلوب ويجب أن يكون من القائمة المحددة
    donationType: {
      type: String,
      required: [true, "نوع التبرع مطلوب"],
      // enum يمنع حفظ أي قيمة خارج هذه القائمة
      enum: ["صدقة", "زكاة", "إغاثة", "إسكان", "علاج", "تعليم", "تبرع مشروع"],
    },

    // المبلغ المتبرع به — يجب أن يكون رقماً موجباً (1 على الأقل)
    amount: {
      type: Number,
      required: [true, "المبلغ مطلوب"],
      min: [1, "المبلغ يجب أن يكون أكبر من صفر"],
    },

    // اسم المتبرع — مطلوب، trim يُزيل المسافات الزائدة تلقائياً
    donorName: {
      type: String,
      required: [true, "اسم المتبرع مطلوب"],
      trim: true,
    },

    // بريد المتبرع الإلكتروني — مطلوب، يُحوَّل لأحرف صغيرة تلقائياً
    donorEmail: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      trim: true,
      lowercase: true, // يضمن تخزينه بحروف صغيرة دائماً
      // match يتحقق من صيغة الإيميل باستخدام Regex
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "البريد الإلكتروني غير صحيح"],
    },

    // رقم هاتف المتبرع — اختياري، افتراضيه سلسلة فارغة
    donorPhone: {
      type: String,
      trim: true,
      default: "",
    },

    // مدينة المتبرع — اختياري
    donorCity: {
      type: String,
      trim: true,
      default: "",
    },

    // طريقة الدفع — مطلوبة ومحددة بثلاثة خيارات
    paymentMethod: {
      type: String,
      required: [true, "طريقة الدفع مطلوبة"],
      enum: ["stripe", "paypal", "cash"],
    },

    // حالة التبرع — تبدأ بـ "pending" حتى يراجعها الأدمن ويقبلها أو يرفضها
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // ملاحظة إضافية من المتبرع — اختيارية
    note:            { type: String, default: "" },

    // معرّف المستخدم في Clerk — فارغ إذا تبرع بدون تسجيل دخول
    userId:          { type: String, default: "" },

    // معرّف جلسة Stripe — يُحفظ فقط عند الدفع عبر Stripe
    stripeSessionId: { type: String, default: null },

    // ربط التبرع بمشروع معين — ref يُحدد الـ Model المرتبط
    // ObjectId هو نوع MongoDB الخاص لمعرّفات الوثائق
    projectId:       { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    // عملة التبرع — افتراضية USD، قابل للتغيير مستقبلاً
    currency:        { type: String, default: "USD" },
  },
  {
    // timestamps: true يُضيف createdAt و updatedAt تلقائياً
    timestamps: true,

    // toJSON يُخصّص شكل البيانات عند تحويلها لـ JSON
    toJSON: {
      transform(doc, ret) {
        // نُضيف id (بدون underscore) ليسهل استخدامه في الفرونتيند
        ret.id = ret._id;
        // نحذف _id و __v لأنهما حقول MongoDB الداخلية غير الضرورية للفرونتيند
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// نُصدّر الـ Model ليُستخدم في الـ services والـ controllers
// "Donation" هو اسم الـ Collection في MongoDB (سيُخزَّن كـ "donations")
module.exports = mongoose.model("Donation", donationSchema);
