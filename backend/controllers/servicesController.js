const { loadData } = require("../utils/dataLoader");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getServices = (req, res) => {
  try {
    const items = loadData("services");

    if (!items || items.length === 0) {
      logger.warn("No services found");
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.NOT_FOUND,
        data: [],
      });
    }

    logger.info("Services retrieved successfully", { count: items.length });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: items,
    });
  } catch (error) {
    logger.error("Error fetching services", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR,
    });
  }
};
