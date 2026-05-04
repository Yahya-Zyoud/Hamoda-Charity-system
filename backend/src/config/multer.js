const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("./environment");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, `../../${config.UPLOAD_DIR}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_randomnumber.extension
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;
    cb(null, name);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("نوع الملف غير مدعوم. الأنواع المسموحة: JPEG, PNG, WebP"));
  }
};

// Create multer instance
const upload = multer({
  storage,
  limits: { fileSize: config.MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
