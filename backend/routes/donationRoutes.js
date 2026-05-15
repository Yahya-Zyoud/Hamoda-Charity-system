const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  verifyAndSaveDonation,
  getAllDonations,
  getDonationById,
} = require("../controllers/donationController");

router.post("/checkout", createCheckoutSession);
router.get("/verify",    verifyAndSaveDonation);
router.get("/",          getAllDonations);
router.get("/:id",       getDonationById);

module.exports = router;
