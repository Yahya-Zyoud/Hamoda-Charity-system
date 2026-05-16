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

const ALLOWED_CREATE_FIELDS = ["title", "description", "details", "category", "status", "goal", "beneficiaries", "image", "location", "startDate", "endDate", "tags", "manager", "logoType"];
const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

function pick(obj, keys) {
  return keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {});
}

exports.createProject = async (data) => {
  const safe = pick(data, ALLOWED_CREATE_FIELDS);
  const project = await Project.create(safe);
  statsService.invalidateCache();
  return project;
};

exports.updateProject = async (id, data) => {
  const safe = pick(data, ALLOWED_UPDATE_FIELDS);
  const project = await Project.findByIdAndUpdate(id, safe, { new: true, runValidators: true });
  statsService.invalidateCache();
  return project;
};

exports.deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  statsService.invalidateCache();
  return project;
};
