const mongoose = require("mongoose");
const HelpRequest = require("../models/HelpRequest");
const Project = require("../models/Project");
const Donation = require("../models/Donation");
const User = require("../models/User");
const { loadData } = require("../utils/dataLoader");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

const HELP_TYPE_AR = {
  medical: "طبي", education: "تعليمي", food: "غذائي",
  housing: "سكني", financial: "مالي", other: "أخرى",
};

exports.getAdminStats = async (req, res) => {
  try {
    if (!isDBReady()) {
      const projects = loadData("projects");
      return res.sendSuccess({
        totalRequests: 0, pendingRequests: 0,
        totalProjects: projects.length,
        totalUsers: 0, totalDonations: 0,
        recentRequests: [], recentDonations: [],
      });
    }

    const [
      totalRequests, pendingRequests, totalProjects, totalUsers,
      donationAgg, recentRequests, recentDonations,
    ] = await Promise.all([
      HelpRequest.countDocuments(),
      HelpRequest.countDocuments({ status: "pending" }),
      Project.countDocuments(),
      User.countDocuments(),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      HelpRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
      Donation.find().sort({ createdAt: -1 }).limit(5)
        .populate("projectId", "title").lean(),
    ]);

    return res.sendSuccess({
      totalRequests,
      pendingRequests,
      totalProjects,
      totalUsers,
      totalDonations: donationAgg[0]?.total || 0,
      recentRequests: recentRequests.map((r) => ({
        id:        r._id,
        name:      r.fullName,
        type:      HELP_TYPE_AR[r.helpType] || r.helpType,
        status:    r.status === "accepted" ? "approved" : r.status,
        createdAt: r.createdAt,
      })),
      recentDonations: recentDonations.map((d) => ({
        id:        d._id,
        donor:     d.donor   || "متبرع",
        project:   d.projectId?.title || "—",
        amount:    d.amount,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    logger.error("Error fetching admin stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
