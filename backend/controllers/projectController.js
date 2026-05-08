const { loadData } = require("../utils/dataLoader");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getProjects = (req, res) => {
  try {
    const items = loadData("projects");

    if (!items || items.length === 0) {
      logger.warn("No projects found");
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.NOT_FOUND,
        data: [],
      });
    }

    logger.info("Projects retrieved successfully", { count: items.length });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: items,
    });
  } catch (error) {
    logger.error("Error fetching projects", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR,
    });
  }
};
