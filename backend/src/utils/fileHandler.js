const fs = require("fs");
const path = require("path");
const config = require("../config/environment");
const logger = require("./logger");

/**
 * Get file URL
 */
const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

/**
 * Delete file
 */
const deleteFile = (filename) => {
  try {
    if (!filename) return false;

    const filePath = path.join(__dirname, `../../${config.UPLOAD_DIR}/${filename}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error("Error deleting file:", { error: error.message });
    return false;
  }
};

/**
 * Ensure upload directory exists
 */
const ensureUploadDir = () => {
  try {
    const dir = path.join(__dirname, `../../${config.UPLOAD_DIR}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info("Upload directory created");
    }
  } catch (error) {
    logger.error("Error creating upload directory:", { error: error.message });
  }
};

/**
 * Get file stats
 */
const getFileStats = (filename) => {
  try {
    const filePath = path.join(__dirname, `../../${config.UPLOAD_DIR}/${filename}`);
    if (fs.existsSync(filePath)) {
      return fs.statSync(filePath);
    }
    return null;
  } catch (error) {
    logger.error("Error getting file stats:", { error: error.message });
    return null;
  }
};

module.exports = {
  getFileUrl,
  deleteFile,
  ensureUploadDir,
  getFileStats,
};
