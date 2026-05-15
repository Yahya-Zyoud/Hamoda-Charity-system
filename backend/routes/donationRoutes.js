const express          = require("express");
const router           = express.Router();
const validateDonation = require("../middleware/validateDonation");
const { optionalAuth, requireAdmin } = require("../middleware/auth");
const {
  createDonation,
  createCheckoutSession,
  verifyAndSaveDonation,
  getAllDonations,
  getRecentDonations,
  getDonationStats,
  getDonationById,
  updateDonationStatus,
} = require("../controllers/donationController");

// Public stats + recent widget (defined BEFORE /:id to avoid wildcard match)
router.get("/stats",  getDonationStats);
router.get("/recent", getRecentDonations);

// Stripe (no auth required on verify — Stripe calls it)
router.post("/checkout", optionalAuth, createCheckoutSession);
router.get("/verify",    verifyAndSaveDonation);

// Direct donation — optionalAuth so logged-in userId is captured
router.post("/", optionalAuth, validateDonation, createDonation);

// Admin-only
router.get("/",             requireAdmin, getAllDonations);
router.get("/:id",          requireAdmin, getDonationById);
router.patch("/:id/status", requireAdmin, updateDonationStatus);

module.exports = router;
