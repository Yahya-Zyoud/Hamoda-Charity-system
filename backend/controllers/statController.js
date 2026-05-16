const mongoose = require("mongoose");
const Team     = require("../models/Team");
const Project  = require("../models/Project");
const Donation = require("../models/Donation");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getStats = async (req, res) => {
  try {
    if (!isDBReady()) {
      return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const [
      activeVolunteers,
      completedProjects,
      beneficiariesAgg,
      uniqueDonorEmails,
    ] = await Promise.all([
      // All active team members (volunteers, staff, doctors, etc.)
      Team.countDocuments({ active: true }),

      // Projects marked as completed
      Project.countDocuments({ status: "مكتمل" }),

      // Sum of beneficiaries across all projects
      Project.aggregate([
        { $group: { _id: null, total: { $sum: "$beneficiaries" } } },
      ]),

      // Unique donors by email across all donations (any status)
      Donation.distinct("donorEmail"),
    ]);

    const stats = {
      activeVolunteers,
      totalDonors:        uniqueDonorEmails.length,
      completedProjects,
      totalBeneficiaries: beneficiariesAgg[0]?.total ?? 0,
    };

    logger.info("Live stats computed", stats);
    return res.sendSuccess(stats);
  } catch (error) {
    logger.error("Error computing stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
