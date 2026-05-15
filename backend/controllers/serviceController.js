const { loadData } = require("../utils/dataLoader");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getServices = (req, res) => {
  try {
    const items = loadData("services");

    if (!items || items.length === 0) {
      logger.warn("No services found");
      return res.sendSuccess([], MESSAGES.NOT_FOUND);
    }

    logger.info("Services retrieved successfully", { count: items.length });
    return res.sendSuccess(items, MESSAGES.SUCCESS);
  } catch (error) {
    logger.error("Error fetching services", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
