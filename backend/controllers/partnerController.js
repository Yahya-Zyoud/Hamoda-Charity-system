const Partner = require("../models/Partner");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getPartners = async (req, res) => {
  try {
    const items = await Partner.find().sort({ order: 1, createdAt: 1 });
    logger.info("Partners retrieved", { count: items.length });
    return res.sendSuccess(items);
  } catch (error) {
    logger.error("Error fetching partners", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
