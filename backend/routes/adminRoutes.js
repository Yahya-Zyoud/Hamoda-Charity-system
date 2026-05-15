const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

router.get("/stats", requireAdmin, getAdminStats);

module.exports = router;
