/**
 * Contact links utility functions for the charity system
 */

// Charity contact information
const CHARITY_EMAIL = "info@hamoda-charity.org"; // Replace with actual email
const CHARITY_PHONE = "+966123456789"; // Replace with actual phone
const WHATSAPP_NUMBER = "966123456789"; // Replace with actual WhatsApp number

/**
 * Opens a donation inquiry email or WhatsApp message
 * @param {string} projectTitle - Optional project title for the inquiry
 */
export function openDonationInquiry(projectTitle = "") {
  const subject = projectTitle
    ? `استفسار عن التبرع للمشروع: ${projectTitle}`
    : "استفسار عن التبرع";

  const body = projectTitle
    ? `السلام عليكم ورحمة الله وبركاته\n\nأود الاستفسار عن التبرع للمشروع: ${projectTitle}\n\nمع خالص التحية`
    : `السلام عليكم ورحمة الله وبركاته\n\nأود الاستفسار عن التبرع للجمعية\n\nمع خالص التحية`;

  // Try to open WhatsApp first, fallback to email
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
  const emailUrl = `mailto:${CHARITY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Try to open WhatsApp, fallback to email if not available
  const whatsappWindow = window.open(whatsappUrl, '_blank');
  if (!whatsappWindow) {
    window.location.href = emailUrl;
  }
}

/**
 * Opens contact email
 */
export function openContactEmail() {
  const subject = "استفسار عام";
  const body = "السلام عليكم ورحمة الله وبركاته\n\nمع خالص التحية";
  window.location.href = `mailto:${CHARITY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Opens phone call
 */
export function openPhoneCall() {
  window.location.href = `tel:${CHARITY_PHONE}`;
}