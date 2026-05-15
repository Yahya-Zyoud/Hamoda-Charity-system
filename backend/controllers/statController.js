const Stat = require("../models/Stat");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getStats = async (req, res) => {
  try {
    const items = await Stat.find().sort({ order: 1, createdAt: 1 });
    logger.info("Stats retrieved", { count: items.length });
    return res.sendSuccess(items);
  } catch (error) {
    logger.error("Error fetching stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
