const mongoose = require("mongoose");
const Project = require("../models/Project");
const { loadData } = require("../utils/dataLoader");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

const seedIfEmpty = async () => {
  const count = await Project.countDocuments();
  if (count === 0) {
    const json = loadData("projects");
    if (json.length) await Project.insertMany(json);
  }
};

exports.getProjects = async (req, res) => {
  try {
    if (!isDBReady()) {
      const items = loadData("projects");
      return res.sendSuccess(items);
    }
    await seedIfEmpty();
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
