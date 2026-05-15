const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getAll = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    return res.sendSuccess(notifications);
  } catch (error) {
    logger.error("Error fetching notifications", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.markRead = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(notification);
  } catch (error) {
    logger.error("Error marking notification read", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.markAllRead = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    await Notification.updateMany({ read: false }, { read: true });
    return res.sendSuccess(null, "تم تعيين الكل كمقروء");
  } catch (error) {
    logger.error("Error marking all notifications read", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.deleteOne = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(null, "تم حذف الإشعار");
  } catch (error) {
    logger.error("Error deleting notification", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
