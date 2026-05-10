const express = require("express");
const router = express.Router();

const authRoutes = require("./api/authRoutes");
const dataRoutes = require("./api/dataRoutes");
const subscribeRoutes = require("./api/subscribeRoutes");
const userRoutes = require("./api/userRoutes");

/**
 * API Routes organization
 */
router.use("/auth", authRoutes);
router.use("/", dataRoutes);
router.use("/subscribe", subscribeRoutes);
router.use("/user", userRoutes);

module.exports = router;
