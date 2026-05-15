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

const router = express.Router();

const uploadDir = path.join(__dirname, "../public/uploads/help-documents");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
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
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and PDF files are allowed."));
    }
  },
});

router.post("/", upload.single("document"), createHelpRequest);
router.get("/", getAllHelpRequests);
router.get("/:id", getHelpRequestById);
router.patch("/:id/status", updateHelpRequestStatus);
router.post("/:id/reanalyze", reanalyzeHelpRequest); // حمودة re-run
router.delete("/:id", deleteHelpRequest);

module.exports = router;
