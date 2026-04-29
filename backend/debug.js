#!/usr/bin/env node

console.log("1. Starting debug...");

try {
  console.log("2. Loading express...");
  const express = require("express");
  console.log("3. Loading cors...");
  const cors = require("cors");
  console.log("4. Loading path...");
  const path = require("path");
  
  console.log("5. Loading config...");
  const config = require("./config/environment");
  console.log("   Config loaded:", JSON.stringify(config));
  
  console.log("6. Loading middleware...");
  const { responseFormatter: formatResponse } = require("./middleware/responseFormatter");
  const { errorHandler: handleAllErrors, notFoundHandler: handleNotFound } = require("./middleware/errorHandler");
  
  console.log("7. Loading utils...");
  const { ensureUploadDir } = require("./utils/fileHandler");
  const logger = require("./utils/logger");
  
  console.log("8. Loading routes...");
  const apiRoutes = require("./routes");
  
  console.log("9. Creating app...");
  const app = express();
  
  console.log("10. Setting up middleware...");
  app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  console.log("11. Setting up static files...");
  app.use("/uploads", express.static(config.UPLOAD_DIR));
  ensureUploadDir();
  
  console.log("12. Setting up response formatter...");
  app.use(formatResponse);
  
  console.log("13. Setting up API routes...");
  app.use(config.API_PREFIX, apiRoutes);
  
  console.log("14. Setting up health check...");
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });
  
  console.log("15. Setting up error handlers...");
  app.use(handleNotFound);
  app.use(handleAllErrors);
  
  console.log("16. Starting server...");
  const PORT = config.PORT;
  const NODE_ENV = config.NODE_ENV;
  
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running`, {
      port: PORT,
      environment: NODE_ENV,
      url: `http://localhost:${PORT}`,
    });
    console.log("17. Server successfully started!");
  });
  
  // Set up process handlers
  process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection:", reason);
    logger.error("Unhandled Rejection", { reason, promise });
  });
  
  process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception:", error.message);
    logger.error("Uncaught Exception", { error: error.message });
    process.exit(1);
  });
  
  // Keep server open
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, closing server...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
  
} catch (error) {
  console.error("FATAL ERROR during initialization:", error);
  process.exit(1);
}
