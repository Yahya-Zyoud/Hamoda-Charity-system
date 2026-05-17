// User API routes — profile management for authenticated users and admin controls for roles/status.
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const userController = require("../controllers/userController");
const { validateProfileUpdate } = require("../middleware/validators");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Multer storage config for profile image uploads.
const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    const dir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (request, file, cb) => {
    // Timestamp prefix prevents overwriting existing files with the same name.
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per image
  fileFilter: (request, file, cb) => {
    const types = ["image/jpeg", "image/png", "image/webp"];
    if (types.includes(file.mimetype)) cb(null, true);
    else cb(new Error("نوع الملف غير مدعوم"));
  },
});

// Admin-only: list all users and manage roles/status
router.get("/",             requireAdmin, userController.getUsers);
router.put("/:id/role",     requireAdmin, userController.updateUserRole);
router.put("/:id/status",   requireAdmin, userController.updateUserStatus);

// Authenticated user's own profile
router.get("/activity",     requireAuth, userController.getUserActivity);
router.get("/profile",      requireAuth, userController.getProfile);
router.put("/profile",      requireAuth, validateProfileUpdate, userController.updateProfile);
router.post("/upload",      requireAuth, upload.single("image"), userController.uploadImage);

module.exports = router;
