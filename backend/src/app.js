const express = require("express");
const cors = require("cors");
const path = require("path");

const config = require("./config/environment");
const { responseFormatter } = require("./middleware/responseFormatter");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { ensureUploadDir } = require("./utils/fileHandler");
const logger = require("./utils/logger");

const apiRoutes = require("./routes");

/**
 * Create and configure Express app
 */
const createApp = () => {
  const app = express();

  // Middleware - CORS
  app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  }));

  // Middleware - Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware - Static files
  app.use("/uploads", express.static(config.UPLOAD_DIR));
  ensureUploadDir();

  // Middleware - Response formatter
  app.use(responseFormatter);

  // Routes
  app.use(config.API_PREFIX, apiRoutes);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
    });
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
