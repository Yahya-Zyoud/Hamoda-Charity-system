const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Environment configuration
module.exports = {
  PORT:               process.env.PORT       || 5000,
  NODE_ENV:           process.env.NODE_ENV   || "development",
  API_PREFIX:         "/api",
  CORS_ORIGIN:        process.env.CORS_ORIGIN || "*",
  UPLOAD_DIR:         "public/uploads",
  MAX_FILE_SIZE:      5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  LOG_LEVEL:          process.env.LOG_LEVEL  || "INFO",
  MONGO_URI:          process.env.MONGO_URI  || null,
};
