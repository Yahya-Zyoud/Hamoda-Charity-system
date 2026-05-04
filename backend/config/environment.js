const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const port       = process.env.PORT       || 5000;
const env        = process.env.NODE_ENV   || "development";
const corsOrigin = process.env.CORS_ORIGIN || "*";
const logLevel   = process.env.LOG_LEVEL  || "INFO";
const mongoUri   = process.env.MONGO_URI  || null; 

module.exports = {
  PORT:               port,
  NODE_ENV:           env,
  API_PREFIX:         "/api",
  CORS_ORIGIN:        corsOrigin,
  UPLOAD_DIR:         "public/uploads",
  MAX_FILE_SIZE:      5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  LOG_LEVEL:          logLevel,
  MONGO_URI:          mongoUri,
};

