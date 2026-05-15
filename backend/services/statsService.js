const Donation    = require("../models/Donation");
const Project     = require("../models/Project");
const HelpRequest = require("../models/HelpRequest");
const Team        = require("../models/Team");

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let _cache   = null;
let _cacheAt = 0;

/**
 * Compute all public statistics in parallel from real collections.
 * Returns a plain object of numbers — display config lives in the frontend.
 *
 * Cached for CACHE_TTL_MS to avoid hitting Atlas on every page load.
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
    // Unique donors by email (excludes failed donations)
    Donation.distinct("donorEmail", { status: { $ne: "failed" } }),

    // Total number of projects
    Project.countDocuments(),

    // Sum of beneficiaries across all projects (null-safe)
    Project.aggregate([
      { $group: { _id: null, total: { $sum: { $ifNull: ["$beneficiaries", 0] } } } },
    ]),

    // Help requests that were accepted = people actually served
    HelpRequest.countDocuments({ status: "accepted" }),

    // Team members (volunteers + staff)
    Team.countDocuments(),

    // Total donation amount (excludes failed)
    Donation.aggregate([
      { $match: { status: { $ne: "failed" } } },
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
 * Call invalidateCache() after any write that changes these numbers.
 */
exports.getLiveStats = async () => {
  if (_cache && Date.now() - _cacheAt < CACHE_TTL_MS) return _cache;

  const stats = await computeStats();
  _cache   = stats;
  _cacheAt = Date.now();
  return stats;
};

/** Call this after creating a Donation, Project, HelpRequest, or Team member. */
exports.invalidateCache = () => {
  _cache   = null;
  _cacheAt = 0;
};
