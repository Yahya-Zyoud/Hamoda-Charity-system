/**
 * Opens a donation inquiry dialog or redirects to contact form
 * @param {string} projectTitle - Optional project title for context
 */
export const openDonationInquiry = (projectTitle) => {
  // Create a message with project context if provided
  const message = projectTitle
    ? `I'd like to inquire about donating to: ${projectTitle}`
    : `I'd like to inquire about making a donation`;

  // Try to open a mailto link as fallback
  const subject = projectTitle
    ? `Donation Inquiry - ${projectTitle}`
    : "Donation Inquiry";

  window.location.href = `mailto:contact@hamoda-charity.org?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(message)}`;

  // TODO: Replace with actual modal/form component when contact form is implemented
};
