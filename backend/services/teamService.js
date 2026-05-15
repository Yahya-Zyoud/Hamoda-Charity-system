const mongoose = require("mongoose");
const Team = require("../models/Team");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getTeam = async () => {
  if (!isDBReady()) return [];
  return Team.find().sort({ order: 1, createdAt: 1 });
};

exports.getTeamMember = async (id) => {
  if (!isDBReady()) return null;
  return Team.findById(id);
};

exports.createTeamMember = async (data) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Team.create(data);
};

exports.updateTeamMember = async (id, data) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Team.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteTeamMember = async (id) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Team.findByIdAndDelete(id);
};
