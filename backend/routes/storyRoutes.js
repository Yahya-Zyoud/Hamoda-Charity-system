const express = require("express");
const router = express.Router();
const { getStories } = require("../controllers/storyController");

router.get("/", getStories);

module.exports = router;
