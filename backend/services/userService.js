// Service layer for user profile management, activity history aggregation, and image uploads
const User        = require("../models/User");
const HelpRequest = require("../models/HelpRequest");
const Donation    = require("../models/Donation");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");

/** Returns all users sorted newest-first for the admin users table. */
exports.getUsers = async () =>
  User.find().sort({ createdAt: -1 });

exports.updateUserRole   = async (id, role)   => User.findByIdAndUpdate(id, { role },   { new: true });
exports.updateUserStatus = async (id, status) => User.findByIdAndUpdate(id, { status }, { new: true });

/**
 * Returns the user's MongoDB profile, creating a bare record on first access.
 * Clerk is the source of truth for identity — this document holds only the
 * extra profile fields (phone, city, bio, avatar) that Clerk doesn't store.
 */
exports.getProfile = async (clerkId) => {
  let user = await User.findOne({ clerkId });
  if (!user) user = await User.create({ clerkId }); // auto-provision a user record on first profile fetch
  return user;
};

/**
 * Updates profile fields with upsert: true so a profile document is created
 * if the user somehow reaches this endpoint before getProfile has run.
 */
exports.updateProfile = async (clerkId, data) =>
  User.findOneAndUpdate(
    { clerkId },
    { $set: data },
    { new: true, upsert: true }
  );

/**
 * Returns the user's help requests, donations, and summary statistics.
 *
 * Donation matching uses a phone-number fallback because users can donate
 * anonymously (userId: "") before signing in. Once they save their phone in
 * their profile, those earlier donations are linked retroactively.
 */
exports.getUserActivity = async (clerkId) => {
  const userProfile = await User.findOne({ clerkId }).select("phone").lean();
  const userPhone   = userProfile?.phone?.trim() || null;

  // When a phone is available, match donations by userId OR donorPhone.
  // Without a phone we can only match by userId (logged-in donations only).
  const donationFilter = userPhone
    ? { $or: [{ userId: clerkId }, { donorPhone: userPhone }] }
    : { userId: clerkId };

  const donationStatsFilter = userPhone
    ? { $or: [{ userId: clerkId }, { donorPhone: userPhone }], status: { $ne: "rejected" } }
    : { userId: clerkId, status: { $ne: "rejected" } };

  const [
    helpRequests,
    donations,
    totalRequests,
    donationAgg,
    uniqueProjectIds,
  ] = await Promise.all([
    HelpRequest.find({ clerkId }).sort({ createdAt: -1 }).limit(10).lean(),
    Donation.find(donationFilter).populate("projectId", "title").sort({ createdAt: -1 }).limit(10).lean(),
    HelpRequest.countDocuments({ clerkId }),
    Donation.aggregate([
      { $match: donationStatsFilter },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
    ]),
    // distinct donationType — used as "types donated" count on the profile card
    Donation.distinct("donationType", donationFilter),
  ]);

  const agg = donationAgg[0] || { count: 0, total: 0 };

  return {
    helpRequests,
    donations,
    stats: {
      totalRequests:  totalRequests,
      totalDonations: agg.count,
      totalProjects:  uniqueProjectIds.length,
      donationAmount: agg.total,
    },
  };
};

/**
 * Saves an uploaded image to the user's profile.
 * Deletes the previous file from disk before storing the new URL
 * so orphaned uploads don't accumulate in /uploads.
 */
exports.uploadImage = async (clerkId, file, type = "avatar") => {
  if (!file) throw Object.assign(new Error("لم يتم اختيار ملف"), { status: 400 });
  const url      = getFileUrl(file.filename);
  const existing = await User.findOne({ clerkId });
  if (existing && existing[type]) {
    deleteFile(existing[type].split("/").pop()); // delete the old file from disk before saving the new one
  }
  await User.findOneAndUpdate({ clerkId }, { $set: { [type]: url } }, { upsert: true });
  return { url };
};
