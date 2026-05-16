const dns = require("dns");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.warn("MONGO_URI not set — running without database");
    return;
  }

  try {
    await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 30000,
      bufferCommands: true,
    });
    const safeUri = uri.replace(/\/\/[^@]+@/, "//***@");
    logger.info("MongoDB connected", { uri: safeUri });
  } catch (err) {
    logger.error("MongoDB connection failed", { error: err.message });
  }
};

module.exports = connectDB;