const HelpRequest = require("../models/HelpRequest");
const Notification = require("../models/Notification");
const { HTTP_STATUS } = require("../config/constants");
const logger = require("../utils/logger");

const HELP_TYPE_AR = {
  medical: "طبي", education: "تعليمي", food: "غذائي",
  housing: "سكني", financial: "مالي", other: "أخرى",
};

async function createHelpRequest(req, res) {
  try {
    const clerkId = req.userId || "";
    const { fullName, nationalId, phone, email, city, helpType, description } = req.body;

    if (!fullName || !nationalId || !phone || !city || !helpType || !description) {
      return res.sendError("يرجى تعبئة جميع الحقول المطلوبة.", HTTP_STATUS.BAD_REQUEST);
    }

    if (!/^\d{9}$/.test(nationalId)) {
      return res.sendError("رقم الهوية يجب أن يتكون من 9 أرقام.", HTTP_STATUS.BAD_REQUEST);
    }

    if (!/^05\d{8}$/.test(phone)) {
      return res.sendError("رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.", HTTP_STATUS.BAD_REQUEST);
    }

    if (description.trim().length < 20) {
      return res.sendError("وصف الحالة يجب أن يكون 20 حرفًا على الأقل.", HTTP_STATUS.BAD_REQUEST);
    }

    const documentPath = req.file ? `/uploads/help-documents/${req.file.filename}` : null;

    const helpRequest = await HelpRequest.create({
      clerkId, fullName, nationalId, phone, email, city, helpType, description, documentPath,
    });

    Notification.create({
      type:      "request",
      msg:       `طلب مساعدة جديد من ${fullName} (${HELP_TYPE_AR[helpType] || helpType})`,
      relatedId: helpRequest._id,
    }).catch((err) => logger.warn("Failed to create notification", { error: err.message }));

    res.sendSuccess(helpRequest, "تم إرسال طلب المساعدة بنجاح.", HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error("Create help request error:", error);
    res.sendError("حدث خطأ أثناء إرسال الطلب.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function getAllHelpRequests(req, res) {
  try {
    const requests = await HelpRequest.find().sort({ createdAt: -1 });
    res.sendSuccess(requests);
  } catch (error) {
    logger.error("Get help requests error:", error);
    res.sendError("حدث خطأ أثناء جلب الطلبات.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function getHelpRequestById(req, res) {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) return res.sendError("الطلب غير موجود.", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(request);
  } catch (error) {
    logger.error("Get help request error:", error);
    res.sendError("حدث خطأ أثناء جلب الطلب.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function updateHelpRequestStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ["pending", "accepted", "rejected"];

    if (!allowed.includes(status)) {
      return res.sendError("قيمة الحالة غير صالحة.", HTTP_STATUS.BAD_REQUEST);
    }

    const request = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) return res.sendError("الطلب غير موجود.", HTTP_STATUS.NOT_FOUND);

    res.sendSuccess(request, "تم تحديث حالة الطلب بنجاح.");
  } catch (error) {
    logger.error("Update help request status error:", error);
    res.sendError("حدث خطأ أثناء تحديث الحالة.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function deleteHelpRequest(req, res) {
  try {
    const request = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.sendError("الطلب غير موجود.", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(null, "تم حذف الطلب بنجاح.");
  } catch (error) {
    logger.error("Delete help request error:", error);
    res.sendError("حدث خطأ أثناء حذف الطلب.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  deleteHelpRequest,
};
