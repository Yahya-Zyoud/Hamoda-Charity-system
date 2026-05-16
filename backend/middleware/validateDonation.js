// middleware/validateDonation.js
// ─────────────────────────────────────────────────────────────────────────────
// Express middleware that validates the donation request body BEFORE it reaches
// the controller. If anything is wrong, it immediately sends a 400 error
// with clear Arabic messages so the frontend can display them to the user.
//
// Middleware = a function that runs between the request arriving and the
// controller handling it. It receives (req, res, next):
//   - Call next()        → pass the request to the next step (controller)
//   - Call res.json()    → stop here and send a response (validation failed)
// ─────────────────────────────────────────────────────────────────────────────

const VALID_TYPES    = ['صدقة', 'زكاة', 'إغاثة', 'إسكان', 'علاج', 'تعليم'];
const VALID_PAYMENTS = ['stripe', 'paypal', 'cash'];

function validateDonation(req, res, next) {
  const {
    donationType,
    amount,
    donorName,
    donorEmail,
    donorPhone,
    paymentMethod,
  } = req.body;

  const errors = {};

  // 1. Donation type
  if (!donationType) {
    errors.donationType = 'يرجى اختيار نوع التبرع';
  } else if (!VALID_TYPES.includes(donationType)) {
    errors.donationType = 'نوع التبرع غير صحيح';
  }

  // 2. Amount
  const numAmount = Number(amount);
  if (!amount && amount !== 0) {
    errors.amount = 'المبلغ مطلوب';
  } else if (isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'يرجى إدخال مبلغ صحيح أكبر من صفر';
  }

  // 3. Donor name
  if (!donorName || String(donorName).trim() === '') {
    errors.donorName = 'اسم المتبرع مطلوب';
  }

  // 4. Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!donorEmail || String(donorEmail).trim() === '') {
    errors.donorEmail = 'البريد الإلكتروني مطلوب';
  } else if (!emailRegex.test(donorEmail)) {
    errors.donorEmail = 'يرجى إدخال بريد إلكتروني صحيح';
  }

  // 5. Phone
  if (!donorPhone || String(donorPhone).trim() === '') {
    errors.donorPhone = 'رقم الهاتف مطلوب';
  }

  // 6. Payment method
  if (!paymentMethod) {
    errors.paymentMethod = 'يرجى اختيار طريقة الدفع';
  } else if (!VALID_PAYMENTS.includes(paymentMethod)) {
    errors.paymentMethod = 'طريقة الدفع غير صحيحة';
  }

  // If there are any errors — stop here and send 400 Bad Request
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة',
      errors,
    });
  }

  // No errors — let the request continue to the controller
  next();
}

module.exports = validateDonation;
