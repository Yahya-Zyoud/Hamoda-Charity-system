const Team = require("../models/Team");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getTeam = async (req, res, next) => {
  try {
    const members = await Team.find().sort({ order: 1, createdAt: 1 });
    return res.sendSuccess(members);
  } catch (error) {
    next(error);
  }
};

exports.getTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(member);
  } catch (error) {
    next(error);
  }
};

exports.createTeamMember = async (req, res, next) => {
  try {
    const member = await Team.create(req.body);
    return res.sendSuccess(member, MESSAGES.SUCCESS, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.updateTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(member);
  } catch (error) {
    next(error);
  }
};

exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(null, MESSAGES.SUCCESS);
  } catch (error) {
    next(error);
  }
};
