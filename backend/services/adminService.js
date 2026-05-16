const HelpRequest = require("../models/HelpRequest");
const Project     = require("../models/Project");
const Donation    = require("../models/Donation");
const User        = require("../models/User");

// Index 0 is intentionally empty — $month returns 1-based integers (1 = January)
const MONTH_AR = [
  "", "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

// Colors are consumed by the recharts PieChart in OverviewPage
const TYPE_COLOR = {
  medical:   "#2563eb",
  education: "#0EA5E9",
  food:      "#D97706",
  housing:   "#16A34A",
  financial: "#8B5CF6",
  other:     "#94A3B8",
};

const TYPE_AR = {
  medical:   "طبي",
  education: "تعليمي",
  food:      "غذائي",
  housing:   "سكني",
  financial: "مالي",
  other:     "أخرى",
};

/**
 * Returns all data needed by the admin Overview page in a single round-trip.
 * All nine queries run in parallel via Promise.all to minimise latency.
 *
 * monthlyDonations  — current-year donation totals grouped by month (bar chart)
 * requestsByType    — help-request counts grouped by type (pie chart)
 * recentRequests    — last 5 requests for the activity feed
 * recentDonations   — last 5 donations for the activity feed
 *
 * "accepted" is normalised to "approved" in recentRequests because the
 * frontend Badge component uses "approved" as its display value.
 */
exports.getAdminStats = async () => {
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
      { $match: { status: "accepted" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    HelpRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
    Donation.find({ status: { $ne: "rejected" } }).sort({ createdAt: -1 }).limit(5).populate("projectId", "title").lean(),
    // Group by calendar month for the current year — accepted donations only
    Donation.aggregate([
      { $match: { createdAt: { $gte: yearStart }, status: "accepted" } },
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$amount" } } },
      { $sort: { _id: 1 } },
    ]),
    HelpRequest.aggregate([
      { $group: { _id: "$helpType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const monthlyDonations = monthlyAgg.map((item) => ({
    m: MONTH_AR[item._id] || `شهر ${item._id}`,
    v: item.total,
  }));

  const requestsByType = typeAgg.map((item) => ({
    type:  TYPE_AR[item._id] || item._id,
    count: item.count,
    color: TYPE_COLOR[item._id] || "#94A3B8",
  }));

  return {
    totalRequests,
    pendingRequests,
    totalProjects,
    totalUsers,
    totalDonations: donationAgg[0]?.total || 0,
    monthlyDonations,
    requestsByType,
    recentRequests: recentRequests.map((r) => ({
      id:        r._id,
      name:      r.fullName,
      type:      TYPE_AR[r.helpType] || r.helpType,
      status:    r.status === "accepted" ? "approved" : r.status,
      createdAt: r.createdAt,
    })),
    recentDonations: recentDonations.map((d) => ({
      id:        d._id,
      donor:     d.donorName || "متبرع",
      project:   d.projectId?.title || d.donationType || "—",
      amount:    d.amount,
      createdAt: d.createdAt,
    })),
  };
};
