const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonationById,
  deleteDonation,
} = require("../controllers/donationController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public: submit a donation
router.post("/", createDonation);

// Admin only: view and manage
router.get("/",       protect, admin, getDonations);
router.get("/:id",    protect, admin, getDonationById);
router.delete("/:id", protect, admin, deleteDonation);

module.exports = router;
