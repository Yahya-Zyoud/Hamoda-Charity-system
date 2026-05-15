// utils/validation.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure validation functions used by Home.jsx before form submission.
// Each function returns an error object. If the object is empty → form is valid.
// Keeping these in a separate file makes them easy to test and reuse.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the entire donation form.
 * @param {object} formData - All form field values
 * @returns {object} errors - Key/value pairs of field → Arabic error message
 */
export function validateDonationForm(formData) {
  const {
    donationType,
    selectedAmount,
    customAmountText,
    donorName,
    donorEmail,
    donorPhone,
    paymentMethod,
  } = formData;

  const errors = {};

  // 1. Donation type is required
  if (!donationType) {
    errors.donationType = "يرجى اختيار نوع التبرع";
  }

  // 2. Amount must be a positive number (preset OR custom)
  const effectiveAmount = selectedAmount ?? parseFloat(customAmountText);
  if (!effectiveAmount || isNaN(effectiveAmount) || effectiveAmount <= 0) {
    errors.amount = "يرجى إدخال مبلغ صحيح أكبر من صفر";
  }

  // 3. Full name is required
  if (!donorName || donorName.trim() === "") {
    errors.donorName = "الاسم الكامل مطلوب";
  }

  // 4. Email must be present and valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!donorEmail || donorEmail.trim() === "") {
    errors.donorEmail = "البريد الإلكتروني مطلوب";
  } else if (!emailRegex.test(donorEmail)) {
    errors.donorEmail = "يرجى إدخال بريد إلكتروني صحيح";
  }

  // 5. Phone number is required
  if (!donorPhone || donorPhone.trim() === "") {
    errors.donorPhone = "رقم الهاتف مطلوب";
  }

  // 6. Payment method must be selected
  if (!paymentMethod) {
    errors.paymentMethod = "يرجى اختيار طريقة الدفع";
  }

  return errors; // empty object = no errors = form is valid
}
