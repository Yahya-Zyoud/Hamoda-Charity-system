const Subscription = require("../models/Subscription");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.subscribe = async (req, res, next) => {
  try {
    const cleanEmail = req.body.email.trim().toLowerCase();
    await Subscription.create({ email: cleanEmail });
    logger.info("[Newsletter] Subscriber saved", { email: cleanEmail });
    return res.status(HTTP_STATUS.CREATED).sendSuccess({ email: cleanEmail }, MESSAGES.SUBSCRIPTION_SUCCESS);
  } catch (error) {
    if (error.code === 11000) {
      return res.sendError("Email already subscribed", HTTP_STATUS.CONFLICT);
    }
    next(error);
  }
};
