/* =============================================
   اسم الملف: Project.js
   الوظيفة: Schema و Model للمشاريع الخيرية في MongoDB
   كل مشروع له هدف مالي (goal) ومبلغ جُمع (raised)
   ونسبة التقدم تُحسب تلقائياً عبر Virtual field
   ============================================= */

// نستورد mongoose للتعامل مع قاعدة البيانات
const mongoose = require("mongoose");

/**
 * projectSchema — يُحدد شكل وقواعد بيانات المشروع في قاعدة البيانات
 */
const projectSchema = new mongoose.Schema(
  {
    // عنوان المشروع — مطلوب، trim يُزيل المسافات الزائدة
    title: {
      type: String,
      required: [true, "عنوان المشروع مطلوب"],
      trim: true,
    },

    // وصف مختصر للمشروع — مطلوب
    description: {
      type: String,
      required: [true, "وصف المشروع مطلوب"],
    },

    // تفاصيل أطول للمشروع — اختيارية
    details: { type: String },

    // تصنيف المشروع — من قائمة محددة مسبقاً
    category: {
      type: String,
      enum: ["صحة", "تعليم", "إغاثة", "بنية تحتية", "دعم نفسي", "غذاء", "مياه", "رعاية", "أضاحي", "إسكان", "أخرى"],
      default: "أخرى",
    },

    // حالة المشروع — نشط يعني قيد التنفيذ، مكتمل يعني انتهى، معلق يعني متوقف
    status: {
      type: String,
      enum: ["نشط", "مكتمل", "معلق"],
      default: "نشط",
    },

    // الهدف المالي للمشروع — كم نريد جمعه؟ مطلوب ولا يمكن أن يكون سالباً
    goal: { type: Number, required: true, min: 0 },

    // المبلغ المجموع فعلياً — يزداد عند قبول التبرعات المرتبطة بالمشروع
    raised: { type: Number, default: 0, min: 0 },

    // عدد المستفيدين من المشروع
    beneficiaries: { type: Number, default: 0 },

    // رابط صورة المشروع — يُخزَّن كمسار نسبي أو URL
    image: { type: String, default: "" },

    // نوع الشعار (للعرض في الفرونتيند عند عدم وجود صورة)
    logoType: { type: String },

    // موقع تنفيذ المشروع (مدينة أو منطقة)
    location: { type: String, default: "" },

    // تاريخ بداية المشروع
    startDate: { type: Date },

    // تاريخ نهاية المشروع المتوقعة
    endDate: { type: Date },

    // وسوم للبحث والتصفية — مصفوفة من النصوص
    tags: [String],

    // اسم مدير المشروع
    manager: { type: String, default: "" },
  },
  {
    // timestamps يُضيف createdAt و updatedAt تلقائياً
    timestamps: true,

    // toJSON: نُخصّص شكل البيانات عند إرسالها للفرونتيند
    toJSON: {
      virtuals: true, // نُضمّن الـ Virtual fields (مثل progress) في الـ JSON
      transform(doc, ret) {
        // نتأكد من وجود id (بعض الاستعلامات قد لا تُولّده)
        if (ret.id == null) ret.id = ret._id;
        // نحذف __v لأنه حقل MongoDB الداخلي غير الضروري
        delete ret.__v;
        return ret;
      },
    },
  }
);

/* --- Virtual Fields (حقول محسوبة لا تُخزَّن في قاعدة البيانات) --- */

/**
 * progress — يحسب نسبة التقدم المئوية للمشروع
 * نسبة الجمع = (المبلغ المجموع / الهدف) × 100
 * تُحسب عند كل قراءة ولا تُخزَّن لأنها تتغير مع كل تبرع
 *
 * مثال: raised=500, goal=1000 → progress=50 (أي 50%)
 *
 * @returns {number} - نسبة من 0 إلى 100
 */
projectSchema.virtual("progress").get(function () {
  // إذا كان الهدف صفراً نُعيد 0 لتجنب القسمة على صفر
  if (!this.goal || this.goal === 0) return 0;
  // Math.round للتقريب، Math.min لضمان عدم تجاوز 100%
  return Math.min(Math.round((this.raised / this.goal) * 100), 100);
});

// نُصدّر الـ Model ليُستخدم في الـ services
// "Project" → collection "projects" في MongoDB
module.exports = mongoose.model("Project", projectSchema);
