const Donation    = require("../models/Donation");
const Project     = require("../models/Project");
const HelpRequest = require("../models/HelpRequest");
const Team        = require("../models/Team");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getStats = async (req, res, next) => {
  try {
    const [
      uniqueDonorEmails,
      projectCount,
      beneficiariesAgg,
      servedRequestsCount,
      teamCount,
      donationAgg,
    ] = await Promise.all([
      Donation.distinct("donorEmail", { status: { $ne: "failed" } }),
      Project.countDocuments(),
      Project.aggregate([
        { $group: { _id: null, total: { $sum: { $ifNull: ["$beneficiaries", 0] } } } },
      ]),
      HelpRequest.countDocuments({ status: "accepted" }),
      Team.countDocuments(),
      Donation.aggregate([
        { $match: { status: { $ne: "failed" } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    return res.sendSuccess({
      donors:        uniqueDonorEmails.length,
      projects:      projectCount,
      beneficiaries: (beneficiariesAgg[0]?.total ?? 0) + servedRequestsCount,
      team:          teamCount,
      totalAmount:   donationAgg[0]?.total ?? 0,
    });
  } catch (error) {
    next(error);
  }
};
