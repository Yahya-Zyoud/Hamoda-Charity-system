const express = require("express");
const router = express.Router();
const { getData } = require("../controllers/dataController");
const { subscribe } = require("../controllers/subscribeController");
const { validateSubscribeEmail } = require("../middleware/validators");

router.get("/projects", getData("projects"));
router.get("/services", getData("services"));
router.get("/stats", getData("stats"));
router.get("/partners", getData("partners"));
router.get("/stories", getData("stories"));
router.post("/subscribe", validateSubscribeEmail, subscribe);
const userRoutes = require("./userRoutes");
router.use("/user", userRoutes);

module.exports = router;
