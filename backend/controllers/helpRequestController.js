// Controller for citizen help requests — create, read, status update, and delete
const helpRequestService = require("../services/helpRequestService");
const { HTTP_STATUS } = require("../config/constants");
const logger = require("../utils/logger");

async function createHelpRequest(req, res) {
  try {
    const helpRequest = await helpRequestService.createHelpRequest({
      clerkId: req.userId || "",
      ...req.body,
      file: req.file,
    });
    res.sendSuccess(helpRequest, "تم إرسال طلب المساعدة بنجاح.", HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error("Create help request error:", error);
    res.sendError(error.message, error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);
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
    res.sendSuccess(request, "تم تحديث حالة الطلب بنجاح.");
  } catch (error) {
    logger.error("Update help request status error:", error);
    const status = error.status || (error.name === "CastError" ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.INTERNAL_SERVER_ERROR);
    res.sendError(error.message, status);
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
