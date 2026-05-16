const HelpRequest  = require("../models/HelpRequest");
const Notification = require("../models/Notification");
const statsService = require("./statsService");
const logger       = require("../utils/logger");

// Arabic labels used in admin notifications — kept here so the controller
// stays thin and the mapping is co-located with the business logic.
const HELP_TYPE_AR = {
  medical:   "طبي",
  education: "تعليمي",
  food:      "غذائي",
  housing:   "سكني",
  financial: "مالي",
  other:     "أخرى",
};

/**
 * Validates and saves a new help request submitted via the public form.
 *
 * Validation is intentionally duplicated here (frontend also validates) because
 * the backend is the last line of defense — file uploads bypass the React form.
 *
 * documentPath is stored as a URL-safe relative path so the frontend can
 * construct a full URL by prepending the API base URL.
 *
 * Notification is fire-and-forget: a notification failure must not prevent
 * the applicant from receiving their confirmation.
 */
exports.createHelpRequest = async ({ clerkId, fullName, nationalId, phone, email, city, helpType, description, file }) => {
  if (!fullName || !nationalId || !phone || !city || !helpType || !description) {
    throw Object.assign(new Error("يرجى تعبئة جميع الحقول المطلوبة."), { status: 400 });
  }
  if (!/^\d{9}$/.test(nationalId)) {
    throw Object.assign(new Error("رقم الهوية يجب أن يتكون من 9 أرقام."), { status: 400 });
  }
  if (!/^05\d{8}$/.test(phone)) {
    throw Object.assign(new Error("رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."), { status: 400 });
  }
  if (description.trim().length < 20) {
    throw Object.assign(new Error("وصف الحالة يجب أن يكون 20 حرفًا على الأقل."), { status: 400 });
  }

  // file is provided by multer when the user attaches a document; null otherwise
  const documentPath = file ? `/uploads/help-documents/${file.filename}` : null;

  const helpRequest = await HelpRequest.create({
    clerkId, fullName, nationalId, phone, email, city, helpType, description, documentPath,
  });

  Notification.create({
    type:      "request",
    msg:       `طلب مساعدة جديد من ${fullName} (${HELP_TYPE_AR[helpType] || helpType})`,
    relatedId: helpRequest._id,
  }).catch((err) => logger.warn("Failed to create notification", { error: err.message }));

  statsService.invalidateCache();
  return helpRequest;
};

/** Returns all requests sorted newest-first for the admin table. */
exports.getAllHelpRequests = async () =>
  HelpRequest.find().sort({ createdAt: -1 });

exports.getHelpRequestById = async (id) =>
  HelpRequest.findById(id);

/**
 * Updates a request's status.
 * "accepted" is the only value that increments the beneficiaries stat,
 * so the cache must be busted on every status change.
 */
exports.updateHelpRequestStatus = async (id, status) => {
  const allowed = ["pending", "accepted", "rejected"];
  if (!allowed.includes(status)) {
    throw Object.assign(new Error("قيمة الحالة غير صالحة."), { status: 400 });
  }
  const updated = await HelpRequest.findByIdAndUpdate(id, { status }, { new: true });
  statsService.invalidateCache();
  return updated;
};

exports.deleteHelpRequest = async (id) =>
  HelpRequest.findByIdAndDelete(id);
