const Team = require("../models/Team");

exports.getTeam = async () =>
  Team.find().sort({ order: 1, createdAt: 1 });

exports.getTeamMember = async (id) =>
  Team.findById(id);

exports.createTeamMember = async (data) =>
  Team.create(data);

exports.updateTeamMember = async (id, data) =>
  Team.findByIdAndUpdate(id, data, { new: true, runValidators: true });

exports.deleteTeamMember = async (id) =>
  Team.findByIdAndDelete(id);
