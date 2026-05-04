const dataService = require("../services/dataService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

/**
 * Get data controller factory
 * Creates a controller for specific data types
 */
const getData = (dataType) => async (req, res, next) => {
  try {
    const result = await dataService.getAll(dataType);

    if (!result.success || result.data.length === 0) {
      logger.warn(`No ${dataType} found`);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.NOT_FOUND,
        data: [],
        count: 0,
      });
    }

    logger.info(`${dataType} retrieved successfully`, { count: result.count });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    logger.error(`Error fetching ${dataType}`, { error: error.message });
    next(error);
  }
};

module.exports = {
  getData,
};
