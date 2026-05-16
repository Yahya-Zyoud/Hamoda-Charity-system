/* =============================================
   اسم الملف: Team.js
   الوظيفة: Schema و Model لأعضاء فريق الجمعية في MongoDB
   يُستخدم لعرض أعضاء الفريق في صفحة "فريق العمل"
   ويمكن للأدمن إضافة أعضاء جدد أو تعديلهم من لوحة التحكم
   ============================================= */

// نستورد mongoose للتعامل مع قاعدة البيانات
const mongoose = require("mongoose");

/**
 * teamSchema — يُحدد شكل وقواعد بيانات عضو الفريق
 */
const teamSchema = new mongoose.Schema(
  {
    // اسم عضو الفريق — مطلوب
    name:        { type: String, required: true, trim: true },

    // اللقب أو المسمى الوظيفي (مثل: "مدير المشاريع") — مطلوب
    title:       { type: String, required: true, trim: true },

    // الدور في الجمعية (مثل: "متطوع", "موظف") — مطلوب
    role:        { type: String, required: true, trim: true },

    // نبذة مختصرة عن العضو — اختيارية
    description: { type: String, default: "", trim: true },

    // بريد العضو الإلكتروني للتواصل — اختياري
    email:       { type: String, default: "", trim: true },

    // رقم هاتف العضو — اختياري
    phone:       { type: String, default: "", trim: true },

    // الأحرف الأولى من الاسم لعرضها كـ avatar نصي عند عدم وجود صورة
    // مثال: "م.أ" لـ "محمد أحمد"
    initials:    { type: String, default: "" },

    // رابط أو مسار صورة العضو — null إذا لم تُرفع صورة
    image:       { type: String, default: null },

    // رقم الترتيب في القائمة — الأصغر يظهر أولاً (sort by order ascending)
    order:       { type: Number, default: 0 },
  },
  // timestamps يُضيف createdAt و updatedAt تلقائياً
  { timestamps: true }
);

// نُصدّر الـ Model ليُستخدم في teamService.js
// "Team" → collection "teams" في MongoDB
module.exports = mongoose.model("Team", teamSchema);
