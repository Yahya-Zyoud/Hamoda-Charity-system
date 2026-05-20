const User        = require("../models/User");
const HelpRequest = require("../models/HelpRequest");
const Donation    = require("../models/Donation");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.sendSuccess(users);
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!user) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(user);
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    let user = await User.findOne({ clerkId: req.userId });
    if (!user) user = await User.create({ clerkId: req.userId });
    return res.sendSuccess(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: req.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    return res.sendSuccess(user);
  } catch (error) {
    next(error);
  }
};

exports.getUserActivity = async (req, res, next) => {
  try {
    const userProfile = await User.findOne({ clerkId: req.userId }).select("phone").lean();
    const userPhone   = userProfile?.phone?.trim() || null;

    const donationFilter = userPhone
      ? { $or: [{ userId: req.userId }, { donorPhone: userPhone }] }
      : { userId: req.userId };

    const donationStatsFilter = userPhone
      ? { $or: [{ userId: req.userId }, { donorPhone: userPhone }], status: { $ne: "failed" } }
      : { userId: req.userId, status: { $ne: "failed" } };

    const [helpRequests, donations, totalRequests, donationAgg, uniqueProjectIds] = await Promise.all([
      HelpRequest.find({ clerkId: req.userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Donation.find(donationFilter).populate("projectId", "title").sort({ createdAt: -1 }).limit(10).lean(),
      HelpRequest.countDocuments({ clerkId: req.userId }),
      Donation.aggregate([
        { $match: donationStatsFilter },
        { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
      ]),
      Donation.distinct("donationType", donationFilter),
    ]);

    const agg = donationAgg[0] || { count: 0, total: 0 };
    return res.sendSuccess({
      helpRequests,
      donations,
      stats: {
        totalRequests:  totalRequests,
        totalDonations: agg.count,
        totalProjects:  uniqueProjectIds.length,
        donationAmount: agg.total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.sendError("No file selected", HTTP_STATUS.BAD_REQUEST);
    const url      = getFileUrl(req.file.filename);
    const type     = req.body.type || "avatar";
    const existing = await User.findOne({ clerkId: req.userId });
    if (existing && existing[type]) {
      deleteFile(existing[type].split("/").pop());
    }
    await User.findOneAndUpdate({ clerkId: req.userId }, { $set: { [type]: url } }, { upsert: true });
    return res.status(HTTP_STATUS.CREATED).sendSuccess({ url }, MESSAGES.FILE_UPLOAD_SUCCESS);
  } catch (error) {
    next(error);
  }
};
