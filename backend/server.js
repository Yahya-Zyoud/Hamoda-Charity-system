const express = require("express");
const cors = require("cors");
const path = require("path");

// Register error handlers FIRST before any other code
process.on("unhandledRejection", (reason, promise) => {
  console.error("[UNHANDLED REJECTION]", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("[UNCAUGHT EXCEPTION]", error);
  process.exit(1);
});

try {
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

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/uploads", express.static(config.UPLOAD_DIR));
  ensureUploadDir();

  app.use(formatResponse);

  app.use(config.API_PREFIX, apiRoutes);

  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  app.use(handleNotFound);

  app.use(handleAllErrors);

  const PORT = config.PORT;
  const NODE_ENV = config.NODE_ENV;

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running`, {
      port: PORT,
      environment: NODE_ENV,
      url: `http://localhost:${PORT}`,
    });
  });

  // Keep server references alive
  server.keepAliveTimeout = 65000;
  global.server = server;
  global.app = app;

  // Keep the process alive by resuming stdin
  if (process.stdin.isTTY) {
    process.stdin.resume();
  }

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    logger.info("SIGINT received, closing server gracefully...");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, closing server gracefully...");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  });

} catch (error) {
  console.error("[FATAL] Server initialization failed:", error.message);
  console.error(error.stack);
  process.exit(1);
}
