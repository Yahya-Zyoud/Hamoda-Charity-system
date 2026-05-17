// Opens a pre-filled WhatsApp donation inquiry message to the organisation's fixed phone number.
const PHONE_NUMBER = "972599181853";

function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openDonationInquiry(projectTitle) {
  // Append the project name to the message when one is provided; omit it for generic inquiries.
  const projectText = projectTitle ? ` بخصوص مشروع ${projectTitle}` : "";
  const message = encodeURIComponent(
    `مرحباً، أرغب بالمساهمة${projectText}. هل يمكن مشاركة الخطوات المتاحة؟`
  );

  openLink(`https://wa.me/${PHONE_NUMBER}?text=${message}`);
}
