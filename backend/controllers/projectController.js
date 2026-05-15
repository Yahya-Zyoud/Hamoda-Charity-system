const mongoose = require("mongoose");
const Project = require("../models/Project");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getProjects = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const items = await Project.find().sort({ createdAt: -1 });
    logger.info("Projects retrieved", { count: items.length });
    return res.sendSuccess(items);
  } catch (error) {
    logger.error("Error fetching projects", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getProjectById = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    const project = await Project.findById(req.params.id);
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(project);
  } catch (error) {
    logger.error("Error fetching project", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess({ total: 0, active: 0, completed: 0 });
    const [total, active, completed] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "active" }),
      Project.countDocuments({ status: "completed" }),
    ]);
    return res.sendSuccess({ total, active, completed });
  } catch (error) {
    logger.error("Error fetching project stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.createProject = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const project = await Project.create(req.body);
    logger.info("Project created", { id: project._id });
    return res.sendSuccess(project, MESSAGES.SUCCESS, HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error("Error creating project", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateProject = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Project updated", { id: req.params.id });
    return res.sendSuccess(project);
  } catch (error) {
    logger.error("Error updating project", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Project deleted", { id: req.params.id });
    return res.sendSuccess(null, MESSAGES.SUCCESS);
  } catch (error) {
    logger.error("Error deleting project", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
