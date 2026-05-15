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
const {
  createDonation,
  getAllDonations,
  getRecentDonations,
  getDonationStats,
  getDonationById,
  updateDonationStatus,
} = require('../controllers/donationController');

// ── Specific routes first (before /:id) ───────────────────────────────────
// IMPORTANT: /recent and /stats must be defined BEFORE /:id
// otherwise Express will try to find a donation with id "recent" or "stats"

router.get('/recent', getRecentDonations);     // GET  /api/donations/recent
router.get('/stats',  getDonationStats);       // GET  /api/donations/stats

// ── Main CRUD routes ───────────────────────────────────────────────────────
router.post('/',    validateDonation, createDonation);  // POST   /api/donations
router.get('/',     getAllDonations);                    // GET    /api/donations
router.get('/:id',  getDonationById);                   // GET    /api/donations/:id

// ── Status update ──────────────────────────────────────────────────────────
router.patch('/:id/status', updateDonationStatus);      // PATCH  /api/donations/:id/status

module.exports = router;
