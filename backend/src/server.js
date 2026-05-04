const createApp = require("./app");
const config = require("./config/environment");
const logger = require("./utils/logger");

const app = createApp();

const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running`, {
    port: PORT,
    environment: NODE_ENV,
    url: `http://localhost:${PORT}`,
    apiPrefix: config.API_PREFIX,
  });
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
  process.exit(1);
});

module.exports = server;
