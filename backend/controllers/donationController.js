const donationService = require("../services/donationService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

function resolveError(error) {
  if (error.status) return { message: error.message, status: error.status };
  if (error.name === "ValidationError") {
    const msg = Object.values(error.errors).map((e) => e.message).join("، ");
    return { message: msg || MESSAGES.INVALID_INPUT, status: HTTP_STATUS.BAD_REQUEST };
  }
  if (error.name === "CastError") {
    return { message: "معرّف غير صالح", status: HTTP_STATUS.BAD_REQUEST };
  }
  return { message: MESSAGES.ERROR, status: HTTP_STATUS.INTERNAL_SERVER_ERROR };
}

exports.createDonation = async (req, res) => {
  try {
    const donation = await donationService.createDirectDonation({ ...req.body, userId: req.userId || req.body.userId || "" });
    logger.info("Donation created", { id: donation._id, amount: donation.amount });
    return res.sendSuccess(donation, "تم استلام تبرعك بنجاح، سيتواصل معك فريقنا قريباً");
  } catch (error) {
    logger.error("Error creating donation", { error: error.message });
    const { message, status } = resolveError(error);
    return res.sendError(message, status);
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

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await donationService.deleteDonation(req.params.id);
    if (!donation) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Donation deleted", { id: req.params.id });
    return res.sendSuccess(null, "تم حذف التبرع بنجاح");
  } catch (error) {
    logger.error("Error deleting donation", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
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
