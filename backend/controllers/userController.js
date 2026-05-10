const mongoose = require("mongoose");
const User = require("../models/User");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");
const logger = require("../utils/logger");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "المستخدم غير موجود" });
    }

    logger.info("User profile retrieved", { id: req.user._id });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (error) {
    logger.error("Error fetching user profile", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "المستخدم غير موجود" });
    }

    logger.info("User profile updated", { id: req.user._id });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (error) {
    logger.error("Error updating user profile", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "لم يتم اختيار ملف" });
    }

    const url = getFileUrl(req.file.filename);
    const type = req.body.type || "avatar";

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "المستخدم غير موجود" });
    }

    if (user[type]) {
      deleteFile(user[type].split("/").pop());
    }

    user[type] = url;
    await user.save();

    logger.info("User image uploaded", { id: req.user._id, type, filename: req.file.filename });
    return res.status(HTTP_STATUS.CREATED).json({ success: true, message: MESSAGES.FILE_UPLOAD_SUCCESS, data: { url } });
  } catch (error) {
    logger.error("Error uploading user image", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.FILE_UPLOAD_ERROR });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(HTTP_STATUS.OK).json({ success: true, data: users });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};
