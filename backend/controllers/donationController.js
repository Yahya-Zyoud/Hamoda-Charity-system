// Controller handling donation creation, retrieval, status updates, and statistics
const donationService = require("../services/donationService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.createDonation = async (req, res) => {
  try {
    const donation = await donationService.createDirectDonation({ ...req.body, userId: req.userId || req.body.userId || "" });
    logger.info("Donation created", { id: donation._id, amount: donation.amount });
    return res.sendSuccess(donation, "تم استلام تبرعك بنجاح، سيتواصل معك فريقنا قريباً");
  } catch (error) {
    logger.error("Error creating donation", { error: error.message });
    // Propagate validation errors (400) as-is; wrap all others in a generic message
    return res.sendError(error.status === 400 ? error.message : MESSAGES.ERROR,
      error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await donationService.getAllDonations();
    return res.sendSuccess(donations);
  } catch (error) {
    logger.error("Error fetching donations", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = await donationService.getDonationById(req.params.id);
    if (!donation) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(donation);
  } catch (error) {
    logger.error("Error fetching donation", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const donation = await donationService.updateDonationStatus(req.params.id, req.body.status);
    if (!donation) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Donation status updated", { id: req.params.id, status: req.body.status });
    return res.sendSuccess(donation, "تم تحديث الحالة بنجاح");
  } catch (error) {
    logger.error("Error updating donation status", { error: error.message });
    return res.sendError(error.message, error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getRecentDonations = async (req, res) => {
  try {
    const donations = await donationService.getRecentDonations(req.query.limit);
    return res.sendSuccess(donations);
  } catch (error) {
    logger.error("Error fetching recent donations", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getDonationStats = async (req, res) => {
  try {
    const stats = await donationService.getDonationStats();
    return res.sendSuccess(stats);
  } catch (error) {
    logger.error("Error fetching donation stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
