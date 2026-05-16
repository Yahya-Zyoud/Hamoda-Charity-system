const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || "development";

// Support a comma-separated list of origins, a single origin, or "*"
// Defaults to the common Vite dev ports (5173 with 5174/5175 as fallbacks
// when an earlier port is already in use).
const DEFAULT_DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

function parseCorsOrigin(raw) {
  if (!raw) return DEFAULT_DEV_ORIGINS;
  const trimmed = raw.trim();
  if (trimmed === "*") return "*";
  if (trimmed.includes(",")) return trimmed.split(",").map((s) => s.trim());
  return trimmed;
}

module.exports = {
  PORT: port,
  NODE_ENV: env,
  API_PREFIX: "/api",
  CORS_ORIGIN: parseCorsOrigin(process.env.CORS_ORIGIN),
  MONGODB_URI: process.env.MONGODB_URI || "",
  UPLOAD_DIR: "public/uploads",
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
