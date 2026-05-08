const { loadData } = require("../utils/dataLoader");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getStats = (req, res) => {
  try {
    const items = loadData("stats");

    if (!items || items.length === 0) {
      logger.warn("No statistics found");
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.NOT_FOUND,
        data: [],
      });
    }

    logger.info("Statistics retrieved successfully", { count: items.length });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: items,
    });
  } catch (error) {
    logger.error("Error fetching statistics", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR,
    });
  }
};
