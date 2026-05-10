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

const createData = (dataType) => async (req, res, next) => {
  try {
    const result = await dataService.create(dataType, req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: result.data,
    });
  } catch (error) {
    logger.error(`Error creating ${dataType}`, { error: error.message });
    next(error);
  }
};

const updateData = (dataType) => async (req, res, next) => {
  try {
    const result = await dataService.update(dataType, req.params.id, req.body);
    if (!result.success) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    }
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS, data: result.data });
  } catch (error) {
    logger.error(`Error updating ${dataType}`, { error: error.message });
    next(error);
  }
};

const deleteData = (dataType) => async (req, res, next) => {
  try {
    const result = await dataService.delete(dataType, req.params.id);
    if (!result.success) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    }
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    logger.error(`Error deleting ${dataType}`, { error: error.message });
    next(error);
  }
};

module.exports = {
  getData,
  createData,
  updateData,
  deleteData,
};
