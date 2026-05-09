const express = require("express");
const router = express.Router();
const { getPartners } = require("../controllers/partnerController");

router.get("/", getPartners);

module.exports = router;
