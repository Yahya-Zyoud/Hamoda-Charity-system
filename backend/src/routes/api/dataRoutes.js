const express = require("express");
const router = express.Router();

const { getData } = require("../../controllers/dataController");

/**
 * Data routes - Fetch projects, services, stats, partners, stories
 */
router.get("/projects", getData("projects"));
router.get("/services", getData("services"));
router.get("/stats", getData("stats"));
router.get("/partners", getData("partners"));
router.get("/stories", getData("stories"));

module.exports = router;
