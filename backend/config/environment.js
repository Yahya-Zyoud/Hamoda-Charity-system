const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || "development";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const logLevel = process.env.LOG_LEVEL || "info";

module.exports = {
  PORT: port,
  NODE_ENV: env,
  API_PREFIX: "/api",
  CORS_ORIGIN: corsOrigin,
  LOG_LEVEL: logLevel,
  UPLOAD_DIR: "public/uploads",
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};
