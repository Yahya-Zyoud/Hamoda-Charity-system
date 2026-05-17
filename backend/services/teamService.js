// Service layer for team member CRUD; sorts by manual order then creation date
const Team = require("../models/Team");

const ALLOWED_FIELDS = ["name", "title", "role", "description", "email", "phone", "order", "image", "initials"];

function pick(obj, keys) {
  return keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {});
}

exports.getTeam = async () =>
  Team.find().sort({ order: 1, createdAt: 1 });

exports.getTeamMember = async (id) =>
  Team.findById(id);

exports.createTeamMember = async (data) =>
  Team.create(pick(data, ALLOWED_FIELDS));

exports.updateTeamMember = async (id, data) =>
  Team.findByIdAndUpdate(id, pick(data, ALLOWED_FIELDS), { new: true, runValidators: true });

exports.deleteTeamMember = async (id) =>
  Team.findByIdAndDelete(id);
