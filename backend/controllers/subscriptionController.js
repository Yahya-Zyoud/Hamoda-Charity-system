const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.subscribe = (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    logger.info("[Newsletter] New subscriber", { email: cleanEmail });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUBSCRIPTION_SUCCESS,
      data: { email: cleanEmail },
    });
  } catch (error) {
    logger.error("Error subscribing to newsletter", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR,
    });
  }
};
