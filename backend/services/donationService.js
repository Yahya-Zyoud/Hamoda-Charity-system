const Donation     = require("../models/Donation");
const Project      = require("../models/Project");
const Notification = require("../models/Notification");
const statsService = require("./statsService");
const logger       = require("../utils/logger");

/**
 * Creates a donation record and fires a notification to the admin panel.
 * The notification is intentionally fire-and-forget (.catch instead of await)
 * so a notification failure never rolls back a successful donation.
 */
exports.createDirectDonation = async ({ donationType, amount, donorName, donorEmail, donorPhone, donorCity, paymentMethod, userId, projectId, note }) => {
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
    ...(projectId && { projectId }),
    note:          (note || "").trim(),
  });

  Notification.create({
    type:      "donation",
    msg:       `تبرع جديد بمبلغ $${donation.amount} من ${donation.donorName} (${donation.donationType})`,
    relatedId: donation._id,
  }).catch((err) => logger.warn("Failed to create donation notification", { error: err.message }));

  statsService.invalidateCache();
  return donation;
};

/** Returns all donations newest-first, with project title populated. */
exports.getAllDonations = async () =>
  Donation.find().sort({ createdAt: -1 }).limit(200).populate("projectId", "title");

exports.getDonationById = async (id) =>
  Donation.findById(id).populate("projectId", "title");

/**
 * Updates a donation's status and keeps project.raised in sync.
 *
 * Rules to prevent duplicate counting:
 *  - changing TO "accepted":   add donation.amount to project.raised
 *  - changing FROM "accepted": subtract donation.amount from project.raised (floor 0)
 *  - any other transition:     no project change
 */
exports.updateDonationStatus = async (id, status) => {
  const VALID = ["pending", "accepted", "rejected"];
  if (!status || !VALID.includes(status)) {
    const err = new Error(`الحالة يجب أن تكون: ${VALID.join(" | ")}`);
    err.status = 400;
    throw err;
  }

  const existing = await Donation.findById(id);
  if (!existing) return null;

  const wasAccepted = existing.status === "accepted";
  const becomesAccepted = status === "accepted";

  const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

  // Keep project.raised in sync when a project-linked donation changes acceptance state
  if (donation.projectId) {
    if (becomesAccepted && !wasAccepted) {
      await Project.findByIdAndUpdate(donation.projectId, { $inc: { raised: donation.amount } });
    } else if (!becomesAccepted && wasAccepted) {
      // Use aggregation pipeline to safely floor at 0
      await Project.findByIdAndUpdate(donation.projectId, [
        { $set: { raised: { $max: [0, { $subtract: ["$raised", donation.amount] }] } } },
      ]);
    }
  }

  statsService.invalidateCache();
  return donation;
};

/** Hard-deletes a donation record. If it was accepted, reverses project.raised. */
exports.deleteDonation = async (id) => {
  const donation = await Donation.findById(id);
  if (!donation) return null;

  // Reverse project funding if this was an accepted donation
  if (donation.status === "accepted" && donation.projectId) {
    await Project.findByIdAndUpdate(donation.projectId, [
      { $set: { raised: { $max: [0, { $subtract: ["$raised", donation.amount] }] } } },
    ]);
  }

  await Donation.findByIdAndDelete(id);
  statsService.invalidateCache();
  return donation;
};

/**
 * Returns recent non-rejected donations formatted for display widgets.
 */
exports.getRecentDonations = async (limit = 6) => {
  const safeLimit = Math.min(Number(limit) || 6, 50);
  const donations = await Donation.find({ status: { $ne: "rejected" } })
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

/** Aggregates total amount and donor count from accepted donations only. */
exports.getDonationStats = async () => {
  const result = await Donation.aggregate([
    { $match: { status: "accepted" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" }, totalDonors: { $sum: 1 } } },
  ]);
  const stats = result[0] || { totalAmount: 0, totalDonors: 0 };
  return {
    totalAmount:          stats.totalAmount,
    totalDonors:          stats.totalDonors,
    totalAmountFormatted: `$${Number(stats.totalAmount).toLocaleString()}`,
  };
};
