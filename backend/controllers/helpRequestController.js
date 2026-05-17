const helpRequestService = require("../services/helpRequestService");
const emailService       = require("../services/emailService");
const { HTTP_STATUS } = require("../config/constants");
const logger = require("../utils/logger");
const { cleanObject } = require("../utils/sanitize");

async function createHelpRequest(req, res) {
  try {
    const clean = cleanObject(req.body) || {};
    const helpRequest = await helpRequestService.createHelpRequest({
      clerkId: req.userId || "",
      ...clean,
      file: req.file,
    });
    emailService.sendHelpRequestConfirmation(helpRequest)
      .catch((err) => logger.warn("Help-request email failed", { error: err.message }));
    res.sendSuccess(helpRequest, "تم إرسال طلب المساعدة بنجاح.", HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error("Create help request error:", error);
    // Mongoose validation and cast failures are caller mistakes — surface as 400.
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.sendError("بيانات الطلب غير صالحة.", HTTP_STATUS.BAD_REQUEST);
    }
    const status = error.status && error.status < 500 ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = status === HTTP_STATUS.INTERNAL_SERVER_ERROR
      ? "حدث خطأ أثناء معالجة الطلب."
      : error.message;
    res.sendError(message, status);
  }
}

async function getAllHelpRequests(req, res) {
  try {
    const requests = await helpRequestService.getAllHelpRequests();
    res.sendSuccess(requests);
  } catch (error) {
    logger.error("Get help requests error:", error);
    res.sendError("حدث خطأ أثناء جلب الطلبات.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function getHelpRequestById(req, res) {
  try {
    const request = await helpRequestService.getHelpRequestById(req.params.id);
    if (!request) return res.sendError("الطلب غير موجود.", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(request);
  } catch (error) {
    logger.error("Get help request error:", error);
    res.sendError("حدث خطأ أثناء جلب الطلب.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function updateHelpRequestStatus(req, res) {
  try {
    const request = await helpRequestService.updateHelpRequestStatus(req.params.id, req.body.status);
    if (!request) return res.sendError("الطلب غير موجود.", HTTP_STATUS.NOT_FOUND);
    emailService.sendHelpRequestStatusUpdate(request)
      .catch((err) => logger.warn("Status email failed", { error: err.message }));
    res.sendSuccess(request, "تم تحديث حالة الطلب بنجاح.");
  } catch (error) {
    logger.error("Update help request status error:", error);
    res.sendError(error.message, error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function deleteHelpRequest(req, res) {
  try {
    const request = await helpRequestService.deleteHelpRequest(req.params.id);
    if (!request) return res.sendError("الطلب غير موجود.", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(null, "تم حذف الطلب بنجاح.");
  } catch (error) {
    logger.error("Delete help request error:", error);
    res.sendError("حدث خطأ أثناء حذف الطلب.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { createHelpRequest, getAllHelpRequests, getHelpRequestById, updateHelpRequestStatus, deleteHelpRequest };
