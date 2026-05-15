const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  deleteHelpRequest,
  reanalyzeHelpRequest,
} = require("../controllers/helpRequestController");
const { optionalAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "../public/uploads/help-documents");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, uploadDir); },
  filename(req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Only JPG, PNG, and PDF files are allowed."));
  },
});

// Public form submission — optionalAuth so the userId is attached if logged in
router.post("/", optionalAuth, upload.single("document"), createHelpRequest);

// Admin-only
router.get("/",             requireAdmin, getAllHelpRequests);
router.get("/:id",          requireAdmin, getHelpRequestById);
router.patch("/:id/status", requireAdmin, updateHelpRequestStatus);
router.post("/:id/reanalyze", requireAdmin, reanalyzeHelpRequest);
router.delete("/:id",       requireAdmin, deleteHelpRequest);

module.exports = router;
