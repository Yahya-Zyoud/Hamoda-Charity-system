// Controller for the public services/offerings list shown on the home page
const Service = require("../models/Service");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getServices = async (req, res) => {
  try {
    const items = await Service.find().sort({ order: 1, createdAt: 1 }); // primary sort by manual order, secondary by insertion date
    logger.info("Services retrieved", { count: items.length });
    return res.sendSuccess(items);
  } catch (error) {
    logger.error("Error fetching services", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
