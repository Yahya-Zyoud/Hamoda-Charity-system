const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  deleteHelpRequest,
} = require("../controllers/helpRequestController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/help-documents");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed."));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", upload.single("document"), createHelpRequest);

router.get("/", getAllHelpRequests);

router.get("/:id", getHelpRequestById);

router.patch("/:id/status", updateHelpRequestStatus);

router.delete("/:id", deleteHelpRequest);

module.exports = router;