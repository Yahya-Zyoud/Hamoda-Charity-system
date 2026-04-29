const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("../config/environment");

const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

const deleteFile = (filename) => {
  try {
    if (!filename) return false;

    const filePath = path.join(__dirname, `../${UPLOAD_DIR}/${filename}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

const ensureUploadDir = () => {
  try {
    const dir = path.join(__dirname, `../${UPLOAD_DIR}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating upload directory:", error);
  }
};

module.exports = {
  getFileUrl,
  deleteFile,
  ensureUploadDir,
};
