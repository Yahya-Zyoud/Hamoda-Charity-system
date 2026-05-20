const HelpRequest = require("../models/HelpRequest");
const Project     = require("../models/Project");
const Donation    = require("../models/Donation");
const User        = require("../models/User");
const { HTTP_STATUS } = require("../config/constants");

const TYPE_COLOR = {
  medical:   "#2563eb",
  education: "#0EA5E9",
  food:      "#D97706",
  housing:   "#16A34A",
  financial: "#8B5CF6",
  other:     "#94A3B8",
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearStart   = new Date(`${currentYear}-01-01`);

    const [
      totalRequests,
      pendingRequests,
      totalProjects,
      totalUsers,
      donationAgg,
      recentRequests,
      recentDonations,
      monthlyAgg,
      typeAgg,
    ] = await Promise.all([
      HelpRequest.countDocuments(),
      HelpRequest.countDocuments({ status: "pending" }),
      Project.countDocuments(),
      User.countDocuments(),
      Donation.aggregate([
        { $match: { status: { $ne: "failed" } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      HelpRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
      Donation.find().sort({ createdAt: -1 }).limit(5).populate("projectId", "title").lean(),
      Donation.aggregate([
        { $match: { createdAt: { $gte: yearStart }, status: { $ne: "failed" } } },
        { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$amount" } } },
        { $sort: { _id: 1 } },
      ]),
      HelpRequest.aggregate([
        { $group: { _id: "$helpType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const MONTH_NAMES = ["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return res.sendSuccess({
      totalRequests,
      pendingRequests,
      totalProjects,
      totalUsers,
      totalDonations: donationAgg[0]?.total || 0,
      monthlyDonations: monthlyAgg.map((item) => ({
        m: MONTH_NAMES[item._id] || `Month ${item._id}`,
        v: item.total,
      })),
      requestsByType: typeAgg.map((item) => ({
        type:  item._id,
        count: item.count,
        color: TYPE_COLOR[item._id] || "#94A3B8",
      })),
      recentRequests: recentRequests.map((r) => ({
        id:        r._id,
        name:      r.fullName,
        type:      r.helpType,
        status:    r.status === "accepted" ? "approved" : r.status,
        createdAt: r.createdAt,
      })),
      recentDonations: recentDonations.map((d) => ({
        id:        d._id,
        donor:     d.donorName || "Anonymous",
        project:   d.projectId?.title || d.donationType || "—",
        amount:    d.amount,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};
