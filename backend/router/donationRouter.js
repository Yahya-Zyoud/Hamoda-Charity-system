// router/donationRouter.js
// ─────────────────────────────────────────────────────────────────────────────
// Maps every HTTP method + URL path to the correct controller function.
// The validateDonation middleware runs BEFORE createDonation to check input.
//
// Full route table (base = /api/donations):
//   POST   /              → create a new donation
//   GET    /              → get all donations (admin)
//   GET    /recent        → get 6 most recent (sidebar widget)
//   GET    /stats         → get total amount + donor count (impact card)
//   GET    /:id           → get one donation by MongoDB id
//   PATCH  /:id/status    → update status: pending | completed | failed
// ─────────────────────────────────────────────────────────────────────────────

const express            = require('express');
const router             = express.Router();
const validateDonation   = require('../middleware/validateDonation');
const { optionalAuth, requireAdmin } = require('../middleware/auth');
const {
  createDonation,
  getAllDonations,
  getRecentDonations,
  getDonationStats,
  getDonationById,
  updateDonationStatus,
  downloadReceipt,
} = require('../controllers/donationController');

// ── Public routes (no auth required) ──────────────────────────────────────
router.get('/recent', getRecentDonations);
router.get('/stats',  getDonationStats);

// ── Donor-facing: submit a donation (auth optional — attaches userId if logged in) ──
router.post('/', optionalAuth, validateDonation, createDonation);

// ── PDF receipt — donor receives this link in their confirmation email ────
router.get('/:id/receipt', downloadReceipt);

// ── Admin-only routes ──────────────────────────────────────────────────────
router.get('/',             requireAdmin, getAllDonations);
router.get('/:id',          requireAdmin, getDonationById);
router.patch('/:id/status', requireAdmin, updateDonationStatus);

module.exports = router;
