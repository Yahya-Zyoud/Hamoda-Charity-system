const express = require("express");
const router = express.Router();

router.use("/projects",  require("./projectRoutes"));
router.use("/services",  require("./serviceRoutes"));
router.use("/stats",     require("./statRoutes"));
router.use("/partners",  require("./partnerRoutes"));
router.use("/stories",   require("./storyRoutes"));
router.use("/team",      require("./teamRoutes"));
router.use("/subscribe", require("./subscriptionRoutes"));
router.use("/user",           require("./userRoutes"));
router.use("/help-requests",  require("./helpRequestRoutes"));
router.use("/donations",      require("../router/donationRouter"));
router.use("/notifications",  require("./notificationRoutes"));
router.use("/admin",          require("./adminRoutes"));
router.use("/uploads",        require("./uploadRoutes"));
router.use("/volunteers",     require("./volunteerRoutes"));

module.exports = router;
