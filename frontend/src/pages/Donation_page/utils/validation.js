export function validateDonationForm({ donationMode, donationType, selectedProject, amount, donorInfo }) {
  const errors = {};

  if (!donationMode) {
    errors.donationMode = "يرجى اختيار طريقة التبرع";
  } else if (donationMode === "project" && !selectedProject) {
    errors.project = "يرجى اختيار مشروع لتدعمه";
  } else if (donationMode === "general" && !donationType) {
    errors.donationType = "يرجى اختيار نوع التبرع";
  }

  if (!amount || Number(amount) < 1) {
    errors.amount = "يرجى إدخال مبلغ تبرع صحيح (1$ على الأقل)";
  }

  if (!donorInfo.donorName || donorInfo.donorName.trim().length < 3) {
    errors.donorName = "الاسم يجب أن يكون 3 أحرف على الأقل";
  }

  if (!donorInfo.donorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorInfo.donorEmail)) {
    errors.donorEmail = "يرجى إدخال بريد إلكتروني صحيح";
  }

  if (donorInfo.donorPhone && !/^05\d{8}$/.test(donorInfo.donorPhone)) {
    errors.donorPhone = "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
