const Project = require("../models/Project");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getProjects = async (req, res, next) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    return res.sendSuccess(items);
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(project);
  } catch (error) {
    next(error);
  }
};

exports.getProjectStats = async (req, res, next) => {
  try {
    const [total, active, completed] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "active" }),
      Project.countDocuments({ status: "completed" }),
    ]);
    return res.sendSuccess({ total, active, completed });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    return res.sendSuccess(project, MESSAGES.SUCCESS, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(project);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(null, MESSAGES.SUCCESS);
  } catch (error) {
    next(error);
  }
};
