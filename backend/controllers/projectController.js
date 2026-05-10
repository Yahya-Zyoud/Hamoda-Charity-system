const Project = require("../models/Project");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getProjects = async (req, res) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    logger.info("Projects retrieved", { count: items.length });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: items });
  } catch (error) {
    logger.error("Error fetching projects", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: project });
  } catch (error) {
    logger.error("Error fetching project", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    logger.info("Project created", { id: project._id });
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: project, message: MESSAGES.SUCCESS });
  } catch (error) {
    logger.error("Error creating project", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    logger.info("Project updated", { id: req.params.id });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: project });
  } catch (error) {
    logger.error("Error updating project", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    logger.info("Project deleted", { id: req.params.id });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    logger.error("Error deleting project", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};
