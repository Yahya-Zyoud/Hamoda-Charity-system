const mongoose = require("mongoose");
const User = require("../models/User");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

const DEFAULT_PROFILE = {
  name: "محمد أحمد الخالدي",
  role: "متبرع بلاتيني",
  email: "mohammed@example.com",
  phone: "0599 123 456",
  city: "رام الله",
  bio: "عضو متفاعل وداعم للمبادرات الخيرية منذ عام 2024.",
  avatar: "",
  cover: "",
  joinDate: "يناير 2024",
};

exports.getProfile = async (req, res) => {
  try {
    const clerkId = req.headers["x-user-id"] || "guest";

    if (!isDBReady()) {
      return res.sendSuccess({ ...DEFAULT_PROFILE, clerkId });
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ clerkId, ...DEFAULT_PROFILE });
    }

    logger.info("User profile retrieved", { clerkId });
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error fetching user profile", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const clerkId = req.headers["x-user-id"] || "guest";

    if (!isDBReady()) {
      return res.sendSuccess({ ...DEFAULT_PROFILE, ...req.body, clerkId });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );

    logger.info("User profile updated", { clerkId });
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error updating user profile", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.sendError("لم يتم اختيار ملف", HTTP_STATUS.BAD_REQUEST);
    }

    const clerkId = req.headers["x-user-id"] || "guest";
    const url = getFileUrl(req.file.filename);
    const type = req.body.type || "avatar";

    if (isDBReady()) {
      const existing = await User.findOne({ clerkId });
      if (existing && existing[type]) {
        deleteFile(existing[type].split("/").pop());
      }
      await User.findOneAndUpdate({ clerkId }, { $set: { [type]: url } }, { upsert: true });
    }

    logger.info("User image uploaded", { clerkId, type, filename: req.file.filename });
    return res.status(HTTP_STATUS.CREATED).sendSuccess({ url }, MESSAGES.FILE_UPLOAD_SUCCESS);
  } catch (error) {
    logger.error("Error uploading user image", { error: error.message });
    return res.sendError(MESSAGES.FILE_UPLOAD_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
