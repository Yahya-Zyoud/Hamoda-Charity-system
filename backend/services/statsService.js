const Donation    = require("../models/Donation");
const Project     = require("../models/Project");
const HelpRequest = require("../models/HelpRequest");
const Team        = require("../models/Team");

// Stats are re-computed at most once per TTL window.
// Any write that affects the numbers (donation, project, help-request, team)
// must call invalidateCache() so the next read triggers a fresh query.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let _cache   = null;
let _cacheAt = 0;

/**
 * Queries all four collections in parallel and returns a plain object of
 * numbers.  Display labels and icons live in the frontend (StatsSection.jsx)
 * so adding a new stat only requires a frontend change, not a backend deploy.
 */
async function computeStats() {
  const [
    uniqueDonorEmails,
    projectCount,
    beneficiariesAgg,
    servedRequestsCount,
    teamCount,
    donationAgg,
  ] = await Promise.all([
    // distinct() dedups by email so one donor with multiple donations counts once
    Donation.distinct("donorEmail", { status: "accepted" }),

    Project.countDocuments(),

    // $ifNull guards against projects that were saved before the beneficiaries
    // field was added to the schema (avoids null summing to NaN)
    Project.aggregate([
      { $group: { _id: null, total: { $sum: { $ifNull: ["$beneficiaries", 0] } } } },
    ]),

    // Only accepted requests count as "people actually served"
    HelpRequest.countDocuments({ status: "accepted" }),

    Team.countDocuments(),

    Donation.aggregate([
      { $match: { status: "accepted" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const projectBeneficiaries = beneficiariesAgg[0]?.total ?? 0;

  return {
    donors:        uniqueDonorEmails.length,
    projects:      projectCount,
    // Beneficiaries = people helped via projects + people served via accepted requests
    beneficiaries: projectBeneficiaries + servedRequestsCount,
    team:          teamCount,
    totalAmount:   donationAgg[0]?.total ?? 0,
  };
}

/**
 * Returns live stats, using the in-memory cache when fresh.
 * The first call after a cold start (or after invalidateCache) hits the DB;
 * subsequent calls within the TTL window return the cached value instantly.
 */
exports.getLiveStats = async () => {
  if (_cache && Date.now() - _cacheAt < CACHE_TTL_MS) return _cache;

  const stats = await computeStats();
  _cache   = stats;
  _cacheAt = Date.now();
  return stats;
};

/**
 * Must be called after any write that changes the stats numbers:
 * createDonation, createHelpRequest, updateHelpRequestStatus,
 * createProject, updateProject, deleteProject, createTeamMember.
 */
exports.invalidateCache = () => {
  _cache   = null;
  _cacheAt = 0;
};
