// Controller for admin-only endpoints — currently exposes aggregated dashboard statistics
const adminService = require("../services/adminService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getAdminStats = async (req, res) => {
  try {
    const stats = await adminService.getAdminStats();
    return res.sendSuccess(stats);
  } catch (error) {
    logger.error("Error fetching admin stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
