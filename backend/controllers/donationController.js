const Donation = require("../models/Donation");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

// POST /api/donations  (public)
exports.createDonation = async (req, res) => {
  try {
    const { donor, amount } = req.body;

    if (!donor || !donor.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "اسم المتبرع مطلوب" });
    }
    if (!amount || isNaN(amount) || Number(amount) < 1) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "مبلغ التبرع يجب أن يكون أكبر من 0" });
    }

    const donation = await Donation.create({ ...req.body, amount: Number(amount) });
    logger.info("Donation created", { id: donation._id, amount: donation.amount, donor: donation.donor });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "شكراً على تبرعك الكريم! تم تسجيل تبرعك بنجاح.",
      data: donation,
    });
  } catch (error) {
    logger.error("Error creating donation", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

// GET /api/donations  (admin only)
exports.getDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { donor: { $regex: search, $options: "i" } },
        { project: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Donation.countDocuments(filter);
    const items = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalAmount = await Donation.aggregate([
      { $match: { ...filter, status: "completed" } },
      { $group: { _id: null, sum: { $sum: "$amount" } } },
    ]);

    logger.info("Donations retrieved", { count: items.length });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: items,
      total,
      totalAmount: totalAmount[0]?.sum || 0,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("Error fetching donations", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

// GET /api/donations/:id  (admin only)
exports.getDonationById = async (req, res) => {
  try {
    const item = await Donation.findById(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item });
  } catch (error) {
    logger.error("Error fetching donation", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

// DELETE /api/donations/:id  (admin only)
exports.deleteDonation = async (req, res) => {
  try {
    const item = await Donation.findByIdAndDelete(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    logger.info("Donation deleted", { id: req.params.id });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    logger.error("Error deleting donation", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};
