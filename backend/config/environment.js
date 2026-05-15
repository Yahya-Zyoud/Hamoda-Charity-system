const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || "development";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

module.exports = {
  PORT: port,
  NODE_ENV: env,
  API_PREFIX: "/api",
  CORS_ORIGIN: corsOrigin,
  MONGO_URI: process.env.MONGO_URI || "",
  UPLOAD_DIR: "public/uploads",
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
