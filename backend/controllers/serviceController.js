const mongoose = require("mongoose");
const Service = require("../models/Service");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getServices = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const items = await Service.find().sort({ order: 1, createdAt: 1 });
    logger.info("Services retrieved", { count: items.length });
    return res.sendSuccess(items);
  } catch (error) {
    logger.error("Error fetching services", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
