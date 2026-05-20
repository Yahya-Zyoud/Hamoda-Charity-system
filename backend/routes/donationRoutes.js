const express          = require('express');
const router           = express.Router();
const validateDonation = require('../middleware/validateDonation');
const { optionalAuth, requireAdmin } = require('../middleware/auth');
const {
  createDonation,
  getAllDonations,
  getRecentDonations,
  getDonationStats,
  getDonationById,
  updateDonationStatus,
} = require('../controllers/donationController');

router.get('/recent', getRecentDonations);
router.get('/stats',  getDonationStats);
router.post('/', optionalAuth, validateDonation, createDonation);
router.get('/',             requireAdmin, getAllDonations);
router.get('/:id',          requireAdmin, getDonationById);
router.patch('/:id/status', requireAdmin, updateDonationStatus);

module.exports = router;
