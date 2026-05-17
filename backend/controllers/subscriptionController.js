// Controller for newsletter email subscriptions
const subscriptionService = require("../services/subscriptionService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.subscribe = async (req, res) => {
  try {
    const result = await subscriptionService.subscribe(req.body.email);
    logger.info("[Newsletter] Subscriber saved", { email: result.email });
    return res.status(HTTP_STATUS.CREATED).sendSuccess(result, MESSAGES.SUBSCRIPTION_SUCCESS);
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key — email already subscribed
      return res.sendError("هذا البريد مسجل مسبقاً", HTTP_STATUS.CONFLICT);
    }
    logger.error("Error subscribing", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
