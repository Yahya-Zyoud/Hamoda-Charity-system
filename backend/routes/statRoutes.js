const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getStats, getStatById, createStat, updateStat, deleteStat } = require("../controllers/statController");

router.get("/", getStats);
router.get("/:id", getStatById);
router.post("/", protect, admin, createStat);
router.put("/:id", protect, admin, updateStat);
router.delete("/:id", protect, admin, deleteStat);

module.exports = router;
