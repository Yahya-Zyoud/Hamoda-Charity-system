const express = require("express");
const router = express.Router();
const { getProjects } = require("../controllers/projectsController");
const { getServices } = require("../controllers/servicesController");
const { getStats } = require("../controllers/statsController");
const { getPartners } = require("../controllers/partnersController");
const { getStories } = require("../controllers/storiesController");
const { subscribe } = require("../controllers/subscribeController");
const { validateSubscribeEmail } = require("../middleware/validators");

router.get("/projects", getProjects);
router.get("/services", getServices);
router.get("/stats", getStats);
router.get("/partners", getPartners);
router.get("/stories", getStories);
router.post("/subscribe", validateSubscribeEmail, subscribe);
const userRoutes = require("./userRoutes");
router.use("/user", userRoutes);

module.exports = router;
