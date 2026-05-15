require("dotenv").config();

const connectDB = require("./config/db");
const { clerkSetup } = require("./middleware/auth");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const config = require("./config/environment");

const { responseFormatter: formatResponse } = require("./middleware/responseFormatter");
const { errorHandler: handleAllErrors, notFoundHandler: handleNotFound } = require("./middleware/errorHandler");

const { ensureUploadDir } = require("./utils/fileHandler");
const logger = require("./utils/logger");

const apiRoutes = require("./routes");

const app = express();

app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(config.UPLOAD_DIR));
ensureUploadDir();

// Mount Clerk JWT verification before routes (no-op when CLERK_SECRET_KEY is absent)
const clerkMw = clerkSetup();
if (clerkMw) app.use(clerkMw);

app.use(formatResponse);

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many subscribe requests" },
});
app.use(`${config.API_PREFIX}/subscribe`, subscribeLimiter);

app.use(config.API_PREFIX, apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(handleNotFound);
app.use(handleAllErrors);

const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

// Only bind an HTTP port when run directly (node server.js).
// In Vercel serverless the module is imported — listen() must not be called.
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info("Server running", {
        port: PORT,
        environment: NODE_ENV,
        url: `http://localhost:${PORT}`,
      });
    });
  });
} else {
  // Serverless: kick off the DB connection but don't block module export.
  connectDB();
}

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.message });
  process.exit(1);
});

module.exports = app;
