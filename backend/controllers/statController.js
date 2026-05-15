const { loadData } = require("../utils/dataLoader");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getStats = (req, res) => {
  try {
    const items = loadData("stats");

    if (!items || items.length === 0) {
      logger.warn("No statistics found");
      return res.sendSuccess([], MESSAGES.NOT_FOUND);
    }

    logger.info("Statistics retrieved successfully", { count: items.length });
    return res.sendSuccess(items, MESSAGES.SUCCESS);
  } catch (error) {
    logger.error("Error fetching statistics", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
