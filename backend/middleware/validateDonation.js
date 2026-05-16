const VALID_TYPES    = ["صدقة", "زكاة", "إغاثة", "إسكان", "علاج", "تعليم", "تبرع مشروع"];
const VALID_PAYMENTS = ["stripe", "paypal", "cash"];

module.exports = function validateDonation(req, res, next) {
  const { donationType, amount, donorName, donorEmail, donorPhone, paymentMethod } = req.body;

  const errors = {};

  if (!donationType) {
    errors.donationType = "يرجى اختيار نوع التبرع";
  } else if (!VALID_TYPES.includes(donationType)) {
    errors.donationType = "نوع التبرع غير صحيح";
  }

  const numAmount = Number(amount);
  if (!amount && amount !== 0) {
    errors.amount = "المبلغ مطلوب";
  } else if (isNaN(numAmount) || numAmount <= 0) {
    errors.amount = "يرجى إدخال مبلغ صحيح أكبر من صفر";
  }

  if (!donorName || String(donorName).trim() === "") {
    errors.donorName = "اسم المتبرع مطلوب";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!donorEmail || String(donorEmail).trim() === "") {
    errors.donorEmail = "البريد الإلكتروني مطلوب";
  } else if (!emailRegex.test(donorEmail)) {
    errors.donorEmail = "يرجى إدخال بريد إلكتروني صحيح";
  }

  // phone is optional — only validate format when provided
  if (donorPhone && String(donorPhone).trim() !== "") {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phoneRegex.test(String(donorPhone).trim())) {
      errors.donorPhone = "رقم الهاتف غير صحيح";
    }
  }

  if (!paymentMethod) {
    errors.paymentMethod = "يرجى اختيار طريقة الدفع";
  } else if (!VALID_PAYMENTS.includes(paymentMethod)) {
    errors.paymentMethod = "طريقة الدفع غير صحيحة";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "بيانات غير صحيحة",
      errors,
    });
  }

  next();
};
