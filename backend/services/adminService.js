const mongoose = require("mongoose");
const HelpRequest = require("../models/HelpRequest");
const Project = require("../models/Project");
const Donation = require("../models/Donation");
const User = require("../models/User");

const isDBReady = () => mongoose.connection.readyState === 1;

const HELP_TYPE_AR = {
  medical:   "طبي",
  education: "تعليمي",
  food:      "غذائي",
  housing:   "سكني",
  financial: "مالي",
  other:     "أخرى",
};

const EMPTY_STATS = {
  totalRequests: 0, pendingRequests: 0,
  totalProjects: 0, totalUsers: 0, totalDonations: 0,
  recentRequests: [], recentDonations: [],
};

exports.getAdminStats = async () => {
  if (!isDBReady()) return EMPTY_STATS;

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
    Donation.find().sort({ createdAt: -1 }).limit(5).populate("projectId", "title").lean(),
  ]);

  return {
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
      donor:     d.donorName || d.donor || "متبرع",
      project:   d.projectId?.title || d.donationType || "—",
      amount:    d.amount,
      createdAt: d.createdAt,
    })),
  };
};
