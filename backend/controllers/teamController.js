const mongoose = require("mongoose");
const Team = require("../models/Team");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getTeam = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const members = await Team.find().sort({ order: 1, createdAt: 1 });
    logger.info("Team retrieved", { count: members.length });
    return res.sendSuccess(members);
  } catch (error) {
    logger.error("Error fetching team", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getTeamMember = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    const member = await Team.findById(req.params.id);
    if (!member) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(member);
  } catch (error) {
    logger.error("Error fetching team member", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const member = await Team.create(req.body);
    logger.info("Team member created", { id: member._id });
    return res.sendSuccess(member, MESSAGES.SUCCESS, HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error("Error creating team member", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Team member updated", { id: req.params.id });
    return res.sendSuccess(member);
  } catch (error) {
    logger.error("Error updating team member", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Team member deleted", { id: req.params.id });
    return res.sendSuccess(null, MESSAGES.SUCCESS);
  } catch (error) {
    logger.error("Error deleting team member", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
