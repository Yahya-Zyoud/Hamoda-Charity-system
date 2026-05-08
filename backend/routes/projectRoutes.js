const express = require("express");
const router = express.Router();
const { getProjects } = require("../controllers/projectController");

router.get("/", getProjects);

module.exports = router;
