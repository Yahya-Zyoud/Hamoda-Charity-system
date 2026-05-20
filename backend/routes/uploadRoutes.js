/**
 * Generic image-upload route for admin assets (project images, etc.).
 * Saves to backend/public/uploads/images and returns the public URL.
 */
const express = require("express");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "../public/uploads/images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, uploadDir); },
  filename(req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Only JPG, PNG, and WebP images are allowed."));
  },
});

// Admin-only: returns { url: "/uploads/images/<filename>" } the frontend can
// store directly on the resource (e.g. Project.image).
router.post("/image", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.sendError("No file selected", 400);
  const url = `/uploads/images/${req.file.filename}`;
  res.sendSuccess({ url, filename: req.file.filename });
});

module.exports = router;
