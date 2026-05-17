/**
 * Outgoing-email service.
 *
 * Tries Resend if RESEND_API_KEY is set, otherwise no-op (logs and returns).
 * The app keeps working without an email provider — every email call is
 * fire-and-forget so failures never break the user-facing flow.
 */
const logger = require("../utils/logger");

const FROM = process.env.EMAIL_FROM || "Hamoda Charity <onboarding@resend.dev>";
const ENABLED = !!process.env.RESEND_API_KEY;

async function send({ to, subject, html, text }) {
  if (!ENABLED) {
    logger.info("Email (no provider configured)", { to, subject });
    return { skipped: true };
  }
  try {
    // Resend uses a simple HTTPS POST — no SDK dependency needed.
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM, to, subject, html, text }),
    });
    if (!response.ok) {
      const body = await response.text();
      logger.warn("Resend rejected message", { status: response.status, body });
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    logger.warn("Email send failed", { error: err.message });
    return { ok: false, error: err.message };
  }
}

// ── Template helpers ─────────────────────────────────────────────────────────

const baseHtml = (title, body) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="font-family: Tahoma, sans-serif; background:#f8fafc; padding:24px; color:#0f172a;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:14px; padding:32px; box-shadow:0 4px 24px rgba(0,0,0,.06);">
    <h2 style="color:#1856FF; margin:0 0 16px;">جمعية حمودة الخيرية</h2>
    <h3 style="margin:0 0 12px; color:#0f172a;">${title}</h3>
    <div style="line-height:1.7; color:#334155;">${body}</div>
    <hr style="margin:24px 0; border:none; border-top:1px solid #e2e8f0;" />
    <p style="font-size:12px; color:#94a3b8; margin:0;">شكراً لاهتمامك بدعم الجمعية. لأي استفسار، يمكنك الرد على هذه الرسالة.</p>
  </div>
</body>
</html>`;

async function sendHelpRequestConfirmation(helpRequest) {
  if (!helpRequest?.email) return { skipped: true };
  return send({
    to: helpRequest.email,
    subject: "تم استلام طلب المساعدة — جمعية حمودة",
    html: baseHtml(
      "تم استلام طلبك",
      `<p>عزيزي/تي <strong>${helpRequest.fullName}</strong>،</p>
       <p>استلمنا طلب المساعدة الخاص بك بنجاح وسنقوم بمراجعته في أقرب وقت.</p>
       <p>رقم الطلب: <code>${helpRequest._id}</code></p>`
    ),
  });
}

async function sendHelpRequestStatusUpdate(helpRequest) {
  if (!helpRequest?.email) return { skipped: true };
  const statusAr = {
    accepted: "تمت الموافقة",
    rejected: "تم الاعتذار",
    pending:  "قيد المراجعة",
  }[helpRequest.status] || helpRequest.status;
  return send({
    to: helpRequest.email,
    subject: `تحديث حالة طلب المساعدة: ${statusAr}`,
    html: baseHtml(
      `حالة طلبك: ${statusAr}`,
      `<p>عزيزي/تي <strong>${helpRequest.fullName}</strong>،</p>
       <p>تم تحديث حالة طلب المساعدة الخاص بك إلى: <strong>${statusAr}</strong>.</p>
       <p>رقم الطلب: <code>${helpRequest._id}</code></p>`
    ),
  });
}

async function sendDonationConfirmation(donation, project) {
  if (!donation?.donorEmail) return { skipped: true };
  const amount = `$${Number(donation.amount).toLocaleString()}`;
  const projectLine = project
    ? `<p>المشروع: <strong>${project.title}</strong></p>`
    : "";
  return send({
    to: donation.donorEmail,
    subject: "شكراً لتبرعك — جمعية حمودة",
    html: baseHtml(
      "شكراً لتبرعك الكريم",
      `<p>عزيزي/تي <strong>${donation.donorName}</strong>،</p>
       <p>استلمنا تبرعك بقيمة <strong>${amount}</strong> (${donation.donationType}).</p>
       ${projectLine}
       <p>رقم العملية: <code>${donation._id}</code></p>
       <p>سيتواصل معك فريقنا قريباً لإتمام التحويل إن لزم الأمر.</p>`
    ),
  });
}

module.exports = {
  isEnabled: () => ENABLED,
  send,
  sendHelpRequestConfirmation,
  sendHelpRequestStatusUpdate,
  sendDonationConfirmation,
};
