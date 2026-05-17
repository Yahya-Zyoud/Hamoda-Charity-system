// Public route for newsletter email subscription; validates email before saving
const express = require("express");
const router = express.Router();
const { subscribe } = require("../controllers/subscriptionController");
const { validateSubscribeEmail } = require("../middleware/validators");

router.post("/", validateSubscribeEmail, subscribe);

module.exports = router;
