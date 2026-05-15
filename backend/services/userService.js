const User        = require("../models/User");
const HelpRequest = require("../models/HelpRequest");
const Donation    = require("../models/Donation");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");

exports.getUsers = async () =>
  User.find().sort({ createdAt: -1 });

exports.updateUserRole = async (id, role) =>
  User.findByIdAndUpdate(id, { role }, { new: true });

exports.updateUserStatus = async (id, status) =>
  User.findByIdAndUpdate(id, { status }, { new: true });

exports.getProfile = async (clerkId) => {
  let user = await User.findOne({ clerkId });
  if (!user) user = await User.create({ clerkId });
  return user;
};

exports.updateProfile = async (clerkId, data) =>
  User.findOneAndUpdate(
    { clerkId },
    { $set: data },
    { new: true, upsert: true }
  );

exports.getUserActivity = async (clerkId) => {
  // Look up the user's saved phone to match pre-auth donations (saved with userId: "")
  const userProfile = await User.findOne({ clerkId }).select("phone").lean();
  const userPhone   = userProfile?.phone?.trim() || null;

  // Match by userId (current) OR by donorPhone (fallback for old anonymous donations)
  const donationFilter = userPhone
    ? { $or: [{ userId: clerkId }, { donorPhone: userPhone }] }
    : { userId: clerkId };

  const donationStatsFilter = userPhone
    ? { $or: [{ userId: clerkId }, { donorPhone: userPhone }], status: { $ne: "failed" } }
    : { userId: clerkId, status: { $ne: "failed" } };

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

exports.uploadImage = async (clerkId, file, type = "avatar") => {
  if (!file) throw Object.assign(new Error("لم يتم اختيار ملف"), { status: 400 });
  const url = getFileUrl(file.filename);
  const existing = await User.findOne({ clerkId });
  if (existing && existing[type]) {
    deleteFile(existing[type].split("/").pop());
  }
  await User.findOneAndUpdate({ clerkId }, { $set: { [type]: url } }, { upsert: true });
  return { url };
};
