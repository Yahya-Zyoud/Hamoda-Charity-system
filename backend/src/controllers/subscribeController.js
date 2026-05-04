const subscribeService = require("../services/subscribeService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

/**
 * Subscribe controller
 */
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await subscribeService.subscribe(email);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUBSCRIPTION_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    logger.error("Error subscribing to newsletter", { error: error.message });
    next(error);
  }
};

/**
 * Unsubscribe controller
 */
const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await subscribeService.unsubscribe(email);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Error unsubscribing from newsletter", { error: error.message });
    next(error);
  }
};

module.exports = {
  subscribe,
  unsubscribe,
};
