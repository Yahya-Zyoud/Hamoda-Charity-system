const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    if (!isDBReady()) {
      logger.info("[Newsletter] DB not connected — subscriber logged only", { email: cleanEmail });
      return res.status(HTTP_STATUS.CREATED).sendSuccess({ email: cleanEmail }, MESSAGES.SUBSCRIPTION_SUCCESS);
    }

    await Subscription.create({ email: cleanEmail });
    logger.info("[Newsletter] New subscriber saved", { email: cleanEmail });
    return res.status(HTTP_STATUS.CREATED).sendSuccess({ email: cleanEmail }, MESSAGES.SUBSCRIPTION_SUCCESS);
  } catch (error) {
    if (error.code === 11000) {
      return res.sendError("هذا البريد مسجل مسبقاً", HTTP_STATUS.CONFLICT);
    }
    logger.error("Error subscribing", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
