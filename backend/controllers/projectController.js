const projectService = require("../services/projectService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getProjects = async (req, res) => {
  try {
    const items = await projectService.getProjects();
    logger.info("Projects retrieved", { count: items.length });
    return res.sendSuccess(items);
  } catch (error) {
    logger.error("Error fetching projects", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(project);
  } catch (error) {
    logger.error("Error fetching project", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    const stats = await projectService.getProjectStats();
    return res.sendSuccess(stats);
  } catch (error) {
    logger.error("Error fetching project stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);
    logger.info("Project created", { id: project._id });
    return res.sendSuccess(project, MESSAGES.SUCCESS, HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error("Error creating project", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
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
    const project = await projectService.deleteProject(req.params.id);
    if (!project) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Project deleted", { id: req.params.id });
    return res.sendSuccess(null, MESSAGES.SUCCESS);
  } catch (error) {
    logger.error("Error deleting project", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
