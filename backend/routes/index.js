const express = require("express");
const router = express.Router();

router.use("/projects",  require("./projectRoutes"));
router.use("/services",  require("./serviceRoutes"));
router.use("/stats",     require("./statRoutes"));
router.use("/partners",  require("./partnerRoutes"));
router.use("/stories",   require("./storyRoutes"));
router.use("/subscribe", require("./subscriptionRoutes"));
router.use("/user",           require("./userRoutes"));
router.use("/help-requests",  require("./helpRequestRoutes"));
router.use("/donations",      require("./donationRoutes"));
router.use("/notifications",  require("./notificationRoutes"));
router.use("/admin",          require("./adminRoutes"));

module.exports = router;
