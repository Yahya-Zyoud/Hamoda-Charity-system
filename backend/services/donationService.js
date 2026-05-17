// Service layer for donation CRUD operations and statistics; fires admin notifications on creation
const Donation     = require("../models/Donation");
const Notification = require("../models/Notification");
const statsService = require("./statsService");
const logger       = require("../utils/logger");

exports.createDirectDonation = async ({ donationType, amount, donorName, donorEmail, donorPhone, donorCity, paymentMethod, userId }) => {
  const donation = await Donation.create({
    donationType,
    amount:        Number(amount),
    donorName:     donorName.trim(),
    donorEmail:    donorEmail.trim().toLowerCase(),
    donorPhone:    (donorPhone || "").trim(),
    donorCity:     (donorCity  || "").trim(),
    paymentMethod: paymentMethod || "cash",
    status:        "pending",
    userId:        userId || "",
  });

  // Fire-and-forget: notification failure must not block the donor's response
  Notification.create({
    type:      "donation",
    msg:       `تبرع جديد بمبلغ $${donation.amount} من ${donation.donorName} (${donation.donationType})`,
    relatedId: donation._id,
  }).catch((err) => logger.warn("Failed to create donation notification", { error: err.message }));

  statsService.invalidateCache();
  return donation;
};

exports.getAllDonations = async () =>
  Donation.find().sort({ createdAt: -1 }).limit(50).populate("projectId", "title");

exports.getDonationById = async (id) =>
  Donation.findById(id).populate("projectId", "title");

exports.updateDonationStatus = async (id, status) => {
  const VALID = ["pending", "completed", "failed"];
  if (!status || !VALID.includes(status)) {
    const err = new Error(`الحالة يجب أن تكون: ${VALID.join(" | ")}`);
    err.status = 400;
    throw err;
  }
  return Donation.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
};

exports.getRecentDonations = async (limit = 6) => {
  const safeLimit = Math.min(Number(limit) || 6, 50); // cap at 50 to prevent large payloads
  const donations = await Donation.find({ status: { $ne: "failed" } })
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .select("donorName donationType amount paymentMethod createdAt");

  return donations.map((d) => ({
    id:            d._id,
    name:          d.donorName,
    type:          d.donationType,
    paymentMethod: d.paymentMethod,
    amount:        `$${Number(d.amount).toLocaleString()}`,
    date:          d.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" }),
  }));
};

exports.getDonationStats = async () => {
  const result = await Donation.aggregate([
    { $match: { status: { $ne: "failed" } } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" }, totalDonors: { $sum: 1 } } },
  ]);
  const stats = result[0] || { totalAmount: 0, totalDonors: 0 };
  return {
    totalAmount:          stats.totalAmount,
    totalDonors:          stats.totalDonors,
    totalAmountFormatted: `$${Number(stats.totalAmount).toLocaleString()}`,
  };
};
