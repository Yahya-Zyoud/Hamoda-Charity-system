const HelpRequest  = require("../models/HelpRequest");
const Notification = require("../models/Notification");
const statsService = require("./statsService");
const logger       = require("../utils/logger");

const HELP_TYPE_AR = {
  medical:   "طبي",
  education: "تعليمي",
  food:      "غذائي",
  housing:   "سكني",
  financial: "مالي",
  other:     "أخرى",
};

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

exports.getAllHelpRequests = async () => {
  return HelpRequest.find().sort({ createdAt: -1 });
};

exports.getHelpRequestById = async (id) => {
  return HelpRequest.findById(id);
};

exports.updateHelpRequestStatus = async (id, status) => {
  const allowed = ["pending", "accepted", "rejected"];
  if (!allowed.includes(status)) {
    throw Object.assign(new Error("قيمة الحالة غير صالحة."), { status: 400 });
  }
  const updated = await HelpRequest.findByIdAndUpdate(id, { status }, { new: true });
  statsService.invalidateCache();
  return updated;
};

exports.deleteHelpRequest = async (id) => {
  return HelpRequest.findByIdAndDelete(id);
};
