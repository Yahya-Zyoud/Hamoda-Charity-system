const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.warn("MONGO_URI not set — running without database (JSON fallback active)");
    return;
  }

  try {
    await mongoose.connect(uri);
    const safeUri = uri.replace(/\/\/[^@]+@/, "//***@");
    logger.info("MongoDB connected", { uri: safeUri });
  } catch (err) {
    logger.error("MongoDB connection failed — running with JSON fallback", { error: err.message });
    // Don't exit; controllers will fall back to JSON files when isDBReady() returns false
  }
};

module.exports = connectDB;
