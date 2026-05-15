const notificationService = require("../services/notificationService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getAll = async (req, res) => {
  try {
    const notifications = await notificationService.getAll();
    return res.sendSuccess(notifications);
  } catch (error) {
    logger.error("Error fetching notifications", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await notificationService.markRead(req.params.id);
    if (!notification) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(notification);
  } catch (error) {
    logger.error("Error marking notification read", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await notificationService.markAllRead();
    return res.sendSuccess(null, "تم تعيين الكل كمقروء");
  } catch (error) {
    logger.error("Error marking all notifications read", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const notification = await notificationService.deleteOne(req.params.id);
    if (!notification) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(null, "تم حذف الإشعار");
  } catch (error) {
    logger.error("Error deleting notification", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
