const express = require("express");
const router = express.Router();

const userController = require("../../controllers/userController");
const upload = require("../../config/multer");
const { validateProfileUpdate } = require("../../middleware/validators");
const { protect, admin } = require("../../middleware/authMiddleware");

/**
 * User routes
 */
router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, validateProfileUpdate, userController.updateProfile);
router.post("/upload", protect, upload.single("image"), userController.uploadImage);
router.get("/", protect, admin, userController.getAllUsers);

module.exports = router;
