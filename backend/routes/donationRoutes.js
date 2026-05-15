const express          = require("express");
const router           = express.Router();
const validateDonation = require("../middleware/validateDonation");
const { optionalAuth, requireAdmin } = require("../middleware/auth");
const {
  createDonation,
  getAllDonations,
  getRecentDonations,
  getDonationStats,
  getDonationById,
  updateDonationStatus,
} = require("../controllers/donationController");

// Public stats + recent widget
router.get("/stats",  getDonationStats);
router.get("/recent", getRecentDonations);

// Direct donation
router.post("/", optionalAuth, validateDonation, createDonation);

// Admin-only
router.get("/",             requireAdmin, getAllDonations);
router.get("/:id",          requireAdmin, getDonationById);
router.patch("/:id/status", requireAdmin, updateDonationStatus);

module.exports = router;
