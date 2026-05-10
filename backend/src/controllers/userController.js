const userService = require("../services/userService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

/**
 * Get user profile controller
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await userService.getProfile(userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: result.data,
    });
  } catch (error) {
    logger.error("Error fetching profile", { error: error.message });
    next(error);
  }
};

/**
 * Update user profile controller
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await userService.updateProfile(userId, req.body);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error("Error updating profile", { error: error.message });
    next(error);
  }
};

/**
 * Upload user image controller
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "لم يتم رفع ملف",
      });
    }

    const userId = req.user._id;
    const result = await userService.uploadImage(userId, req.file.filename);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error("Error uploading image", { error: error.message });
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    logger.error("Error fetching users", { error: error.message });
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadImage,
  getAllUsers,
};
