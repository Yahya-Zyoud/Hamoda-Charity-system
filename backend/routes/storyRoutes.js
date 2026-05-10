const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getStories, getStoryById, createStory, updateStory, deleteStory } = require("../controllers/storyController");

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/", protect, admin, createStory);
router.put("/:id", protect, admin, updateStory);
router.delete("/:id", protect, admin, deleteStory);

module.exports = router;
