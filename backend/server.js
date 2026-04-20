const express = require("express");
const cors = require("cors");
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

app.listen(PORT, () => {
  logger.info(`🚀 Server running`, {
    port: PORT,
    environment: NODE_ENV,
    url: `http://localhost:${PORT}`,
  });
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.message });
  process.exit(1);
});

module.exports = app;
