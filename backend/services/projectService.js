const Project      = require("../models/Project");
const statsService = require("./statsService");

/** Returns all projects sorted newest-first. */
exports.getProjects = async () =>
  Project.find().sort({ createdAt: -1 });

exports.getProjectById = async (id) =>
  Project.findById(id);

/** Returns a breakdown of project counts by status for the admin dashboard. */
exports.getProjectStats = async () => {
  const [total, active, completed] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "نشط" }),
    Project.countDocuments({ status: "مكتمل" }),
  ]);
  return { total, active, completed };
};

// Cache is invalidated on every write because project count and beneficiaries
// both feed into the public home-page stats section.

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
