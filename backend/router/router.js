const express = require("express");
const router = express.Router();

const { getProjects } = require("../controllers/projectsController");
const { getStories } = require("../controllers/storiesController");
const { getPartners } = require("../controllers/partnersController");
const { subscribe } = require("../controllers/subscribeController");
const { getStats } = require("../controllers/statsController");
const { getServices } = require("../controllers/servicesController");
const userRouter = require("./userRouter");

router.get("/projects", getProjects);

router.get("/stories", getStories);

router.get("/partners", getPartners);

router.post("/subscribe", subscribe);

router.get("/stats", getStats);

router.get("/services", getServices);

router.use("/user", userRouter);

module.exports = router;
