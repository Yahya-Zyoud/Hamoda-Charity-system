/* =============================================
   اسم الملف: validateDonation.js
   الوظيفة: middleware يتحقق من صحة بيانات نموذج التبرع
            قبل إرسالها للـ controller وحفظها في قاعدة البيانات
   لماذا Middleware وليس في Controller؟
   لأن الـ middleware يُفصل منطق التحقق عن منطق العمل (Separation of Concerns)
   ============================================= */

// أنواع التبرع المقبولة — يجب أن تكون مطابقة لقيم الـ enum في الـ Schema
const VALID_TYPES    = ["صدقة", "زكاة", "إغاثة", "إسكان", "علاج", "تعليم", "تبرع مشروع"];

// طرق الدفع المقبولة
const VALID_PAYMENTS = ["stripe", "paypal", "cash"];

/**
 * validateDonation — middleware للتحقق من بيانات التبرع
 * يفحص كل حقل ويجمع الأخطاء في كائن errors
 * إذا كان هناك أي خطأ يُعيد 400 مع تفاصيل الأخطاء
 * إذا كانت البيانات صحيحة يُكمل للـ controller
 *
 * @param {Request} req - كائن الطلب (req.body يحتوي بيانات التبرع)
 * @param {Response} res - كائن الرد
 * @param {Function} next - دالة الانتقال للـ controller
 */
module.exports = function validateDonation(req, res, next) {
  // نستخرج كل الحقول من body الطلب
  const { donationType, amount, donorName, donorEmail, donorPhone, paymentMethod } = req.body;

  // نجمع كل الأخطاء هنا بدلاً من الإيقاف عند أول خطأ
  // هذا يُعطي المستخدم كل الأخطاء دفعة واحدة
  const errors = {};

  /* --- التحقق من نوع التبرع --- */
  if (!donationType) {
    // الحقل فارغ تماماً
    errors.donationType = "يرجى اختيار نوع التبرع";
  } else if (!VALID_TYPES.includes(donationType)) {
    // القيمة موجودة لكن ليست من القائمة المسموحة
    errors.donationType = "نوع التبرع غير صحيح";
  }

  /* --- التحقق من المبلغ --- */
  // نحوّل المبلغ لرقم للتحقق من صحته
  const numAmount = Number(amount);
  if (!amount && amount !== 0) {
    // الحقل فارغ (نتحقق من !== 0 لأن 0 قيمة falsy في JavaScript)
    errors.amount = "المبلغ مطلوب";
  } else if (isNaN(numAmount) || numAmount <= 0) {
    // المبلغ ليس رقماً أو صفر أو سالب
    errors.amount = "يرجى إدخال مبلغ صحيح أكبر من صفر";
  }

  /* --- التحقق من اسم المتبرع --- */
  if (!donorName || String(donorName).trim() === "") {
    errors.donorName = "اسم المتبرع مطلوب";
  }

  /* --- التحقق من البريد الإلكتروني --- */
  // Regex بسيط للتحقق من وجود @ ونقطة
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!donorEmail || String(donorEmail).trim() === "") {
    errors.donorEmail = "البريد الإلكتروني مطلوب";
  } else if (!emailRegex.test(donorEmail)) {
    errors.donorEmail = "يرجى إدخال بريد إلكتروني صحيح";
  }

  /* --- التحقق من رقم الهاتف (اختياري) --- */
  // نتحقق من الصيغة فقط إذا أدخل المستخدم رقماً
  if (donorPhone && String(donorPhone).trim() !== "") {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phoneRegex.test(String(donorPhone).trim())) {
      errors.donorPhone = "رقم الهاتف غير صحيح";
    }
  }

  /* --- التحقق من طريقة الدفع --- */
  if (!paymentMethod) {
    errors.paymentMethod = "يرجى اختيار طريقة الدفع";
  } else if (!VALID_PAYMENTS.includes(paymentMethod)) {
    errors.paymentMethod = "طريقة الدفع غير صحيحة";
  }

  /* --- إرسال الأخطاء أو الإكمال --- */
  // إذا كان كائن errors غير فارغ → فيه أخطاء، نُعيد 400
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "بيانات غير صحيحة",
      errors, // نُرسل كل الأخطاء للفرونتيند ليعرضها بجانب كل حقل
    });
  }

  // لا أخطاء → نُكمل للـ controller لإنشاء التبرع
  next();
};
