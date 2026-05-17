// Service that aggregates all admin dashboard data (counts, charts, recent records) in a single parallel query
const HelpRequest = require("../models/HelpRequest");
const Project     = require("../models/Project");
const Donation    = require("../models/Donation");
const User        = require("../models/User");

const MONTH_AR = [
  "", "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

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

exports.getAdminStats = async () => {
  const currentYear = new Date().getFullYear();
  const yearStart   = new Date(`${currentYear}-01-01`);

  // Fire all DB queries in parallel to keep dashboard load fast
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
      status:    r.status === "accepted" ? "approved" : r.status, // normalise "accepted" to "approved" for the frontend
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
