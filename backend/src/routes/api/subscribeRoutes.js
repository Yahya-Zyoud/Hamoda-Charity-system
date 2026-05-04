const express = require("express");
const router = express.Router();

const { subscribe, unsubscribe } = require("../../controllers/subscribeController");
const { validateSubscribeEmail } = require("../../middleware/validators");

/**
 * Newsletter subscription routes
 */
router.post("/", validateSubscribeEmail, subscribe);
router.post("/unsubscribe", validateSubscribeEmail, unsubscribe);

module.exports = router;
