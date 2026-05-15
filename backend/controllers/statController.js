const statsService = require("../services/statsService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getStats = async (req, res) => {
  try {
    const stats = await statsService.getLiveStats();
    logger.info("Live stats served", stats);
    return res.sendSuccess(stats);
  } catch (error) {
    logger.error("Error computing live stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
