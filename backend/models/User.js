/* =============================================
   اسم الملف: User.js
   الوظيفة: Schema و Model للمستخدمين في MongoDB
   ملاحظة مهمة: Clerk هو مصدر الحقيقة للهوية (الاسم والإيميل وكلمة المرور)
   هذا المستند يحفظ فقط الحقول الإضافية التي لا يحفظها Clerk
   مثل: رقم الهاتف، المدينة، النبذة، الصورة الشخصية
   ============================================= */

// نستورد mongoose للتعامل مع قاعدة البيانات
const mongoose = require("mongoose");

/**
 * userSchema — يُحدد شكل وقواعد بيانات المستخدم في MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    // معرّف المستخدم في Clerk — مطلوب وفريد (unique) لكل مستخدم
    // يُستخدم لربط بيانات MongoDB مع حساب Clerk
    clerkId: { type: String, required: true, unique: true },

    // اسم المستخدم — يُؤخذ من Clerk لكن يمكن تعديله هنا
    name: String,

    // البريد الإلكتروني — يُؤخذ من Clerk
    email: String,

    // رقم الهاتف — إضافي، لا يحفظه Clerk
    phone: String,

    // دور المستخدم في النظام — المتبرع هو الدور الافتراضي
    // "أدمن" يُعيَّن من لوحة تحكم Clerk مباشرة (publicMetadata)
    role: { type: String, default: "متبرع" },

    // المدينة — إضافية للتحليل الجغرافي
    city: String,

    // نبذة شخصية قصيرة عن المستخدم
    bio: String,

    // رابط الصورة الشخصية (avatar) — مسار الملف المرفوع
    avatar: String,

    // رابط صورة الغلاف (cover photo) — مسار الملف المرفوع
    cover: String,

    // تاريخ الانضمام — يُحفظ كنص للعرض المباشر
    joinDate: String,

    // حالة الحساب — active نشط، inactive محظور
    status:   { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    // timestamps يُضيف createdAt و updatedAt تلقائياً
    timestamps: true,

    // toJSON: نُخصّص شكل البيانات عند إرسالها للفرونتيند
    toJSON: {
      transform(doc, ret) {
        // نُضيف id بدون underscore ليسهل استخدامه في React
        ret.id = ret._id;
        // نحذف الحقول الداخلية لـ MongoDB
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// نُصدّر الـ Model ليُستخدم في userService.js
// "User" → collection "users" في MongoDB
module.exports = mongoose.model("User", userSchema);
