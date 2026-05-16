const mongoose = require("mongoose");
const Project = require("../models/Project");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getProjects = async () => {
  if (!isDBReady()) return [];
  return Project.find().sort({ createdAt: -1 });
};

exports.getProjectById = async (id) => {
  if (!isDBReady()) return null;
  return Project.findById(id);
};

exports.getProjectStats = async () => {
  if (!isDBReady()) return { total: 0, active: 0, completed: 0 };
  const [total, active, completed] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "active" }),
    Project.countDocuments({ status: "completed" }),
  ]);
  return { total, active, completed };
};

exports.createProject = async (data) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Project.create(data);
};

exports.updateProject = async (id, data) => {
  if (!isDBReady()) throw new Error("Database not connected");
  const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  return project;
};

exports.deleteProject = async (id) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Project.findByIdAndDelete(id);
};
