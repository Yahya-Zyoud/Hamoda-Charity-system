const userService = require("../services/userService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return res.sendSuccess(users);
  } catch (error) {
    logger.error("Error fetching users", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    if (!user) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error updating user role", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await userService.updateUserStatus(req.params.id, req.body.status);
    if (!user) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error updating user status", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.userId);
    logger.info("User profile retrieved", { clerkId: req.userId });
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error fetching user profile", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.userId, req.body);
    logger.info("User profile updated", { clerkId: req.userId });
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error updating user profile", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getUserActivity = async (req, res) => {
  try {
    const activity = await userService.getUserActivity(req.userId);
    return res.sendSuccess(activity);
  } catch (error) {
    logger.error("Error fetching user activity", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const result = await userService.uploadImage(req.userId, req.file, req.body.type);
    logger.info("User image uploaded", { clerkId: req.userId, type: req.body.type });
    return res.status(HTTP_STATUS.CREATED).sendSuccess(result, MESSAGES.FILE_UPLOAD_SUCCESS);
  } catch (error) {
    logger.error("Error uploading user image", { error: error.message });
    return res.sendError(error.status === 400 ? error.message : MESSAGES.FILE_UPLOAD_ERROR,
      error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
