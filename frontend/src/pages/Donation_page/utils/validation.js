// utils/validation.js
// Pure validation functions — no React, just logic.
// Called by Home.jsx before the form is submitted.
// Returns an object: empty {} means valid, otherwise { field: "Arabic error" }

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

  // 1. Donation type required
  if (!donationType) {
    errors.donationType = "يرجى اختيار نوع التبرع";
  }

  // 2. Amount must be a positive number (preset OR custom)
  const effectiveAmount = selectedAmount ?? parseFloat(customAmountText);
  if (!effectiveAmount || isNaN(effectiveAmount) || effectiveAmount <= 0) {
    errors.amount = "يرجى إدخال مبلغ صحيح أكبر من صفر";
  }

  // 3. Full name required
  if (!donorName || donorName.trim() === "") {
    errors.donorName = "الاسم الكامل مطلوب";
  }

  // 4. Email required + format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!donorEmail || donorEmail.trim() === "") {
    errors.donorEmail = "البريد الإلكتروني مطلوب";
  } else if (!emailRegex.test(donorEmail)) {
    errors.donorEmail = "يرجى إدخال بريد إلكتروني صحيح";
  }

  // 5. Phone required
  if (!donorPhone || donorPhone.trim() === "") {
    errors.donorPhone = "رقم الهاتف مطلوب";
  }

  // 6. Payment method required
  if (!paymentMethod) {
    errors.paymentMethod = "يرجى اختيار طريقة الدفع";
  }

  return errors;
}
