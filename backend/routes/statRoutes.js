// Public route for fetching live aggregated platform statistics
const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statController");

router.get("/", getStats);

module.exports = router;
