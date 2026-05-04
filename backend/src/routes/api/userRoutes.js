const express = require("express");
const router = express.Router();

const userController = require("../../controllers/userController");
const upload = require("../../config/multer");
const { validateProfileUpdate } = require("../../middleware/validators");

/**
 * User routes
 */
router.get("/profile", userController.getProfile);
router.put("/profile", validateProfileUpdate, userController.updateProfile);
router.post("/upload", upload.single("image"), userController.uploadImage);

module.exports = router;
