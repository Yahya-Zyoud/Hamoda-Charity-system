// Service layer for charity project CRUD; invalidates the stats cache after any write
const Project      = require("../models/Project");
const statsService = require("./statsService");

exports.getProjects = async () =>
  Project.find().sort({ createdAt: -1 });

exports.getProjectById = async (id) =>
  Project.findById(id);

exports.getProjectStats = async () => {
  const [total, active, completed] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "active" }),
    Project.countDocuments({ status: "completed" }),
  ]);
  return { total, active, completed };
};

exports.createProject = async (data) => {
  const project = await Project.create(data);
  statsService.invalidateCache();
  return project;
};

exports.updateProject = async (id, data) => {
  const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  statsService.invalidateCache();
  return project;
};

exports.deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  statsService.invalidateCache();
  return project;
};
