const dns = require("dns");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Node 18+ changed the default DNS result order to prefer IPv6 (verbatim),
// which breaks Atlas SRV lookups on some systems. Force IPv4-first to match
// the explicit `family: 4` option passed to mongoose.connect below.
dns.setDefaultResultOrder("ipv4first");

/**
 * Connects to MongoDB using MONGO_URI from the environment.
 * Safe to call before the HTTP server starts — Mongoose buffers
 * model operations until the connection is ready.
 *
 * Logs a warning instead of throwing when MONGO_URI is absent so the
 * app can still boot in CI or local runs without a database.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.warn("MONGO_URI not set — running without database");
    return;
  }

  try {
    await mongoose.connect(uri, {
      family: 4,                      // force IPv4 — Atlas SRV requires it on Node 18+
      serverSelectionTimeoutMS: 30000, // give Atlas 30 s to wake from auto-pause
      bufferCommands: true,           // queue model ops until the connection is ready
    });
    const safeUri = uri.replace(/\/\/[^@]+@/, "//***@");
    logger.info("MongoDB connected", { uri: safeUri });
  } catch (err) {
    logger.error("MongoDB connection failed", { error: err.message });
  }
};

module.exports = connectDB;
