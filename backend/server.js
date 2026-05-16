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
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "عدد محاولات الاشتراك كبير، حاول لاحقاً." },
});
app.use(`${config.API_PREFIX}/subscribe`, subscribeLimiter);

app.use(config.API_PREFIX, apiRoutes);

app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbState  = ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown";
  const healthy  = dbState === "connected";
  res.status(healthy ? 200 : 503).json({
    status:    healthy ? "OK" : "DEGRADED",
    db:        dbState,
    timestamp: new Date().toISOString(),
  });
});

app.use(handleNotFound);
app.use(handleAllErrors);

const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

// Only bind an HTTP port when run directly (node server.js).
// In Vercel serverless the module is imported — listen() must not be called.
if (require.main === module) {
  // Start HTTP server immediately so the frontend isn't blocked.
  // MongoDB connection is attempted in parallel; API routes that need
  // the DB will fail gracefully if it hasn't connected yet.
  const server = app.listen(PORT, () => {
    logger.info("Server running", {
      port: PORT,
      environment: NODE_ENV,
      url: `http://localhost:${PORT}`,
    });
  });
  connectDB().catch((err) => {
    logger.error("MongoDB connection failed — DB routes will return errors until resolved", {
      error: err.message,
      hint: "Run: docker compose up -d",
    });
  });

  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info("HTTP server closed");
      const mongoose = require("mongoose");
      mongoose.connection.close(false).then(() => {
        logger.info("MongoDB connection closed");
        process.exit(0);
      }).catch(() => process.exit(1));
    });
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
} else {
  // Serverless: kick off the DB connection but don't block module export.
  connectDB().catch((err) => {
    logger.error("MongoDB connection failed (serverless)", { error: err.message });
  });
}

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.message });
  process.exit(1);
});

module.exports = app;
