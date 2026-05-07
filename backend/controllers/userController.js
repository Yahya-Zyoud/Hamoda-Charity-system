const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");
const logger = require("../utils/logger");

const profiles = new Map();
const DEFAULT_PROFILE = {
  name: "محمد أحمد الخالدي",
  role: "متبرع بلاتيني",
  email: "mohammed@example.com",
  phone: "0599 123 456",
  city: "رام الله",
  bio: "عضو متفاعل وداعم للمبادرات الخيرية منذ عام 2024. أؤمن بأن العطاء هو جوهر الحياة.",
  avatar: "",
  cover: "",
  joinDate: "يناير 2024",
};

function getOrCreate(userId) {
  if (!profiles.has(userId)) {
    profiles.set(userId, { ...DEFAULT_PROFILE });
  }
  return profiles.get(userId);
}

exports.getProfile = (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || "guest";
    const profile = getOrCreate(userId);
    logger.info("User profile retrieved", { userId });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: profile,
    });
  } catch (error) {
    logger.error("Error fetching user profile", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR,
    });
  }
};

exports.updateProfile = (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || "guest";
    const profile = getOrCreate(userId);
    profiles.set(userId, { ...profile, ...req.body });
    logger.info("User profile updated", { userId });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: profiles.get(userId),
    });
  } catch (error) {
    logger.error("Error updating user profile", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR,
    });
  }
};

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "لم يتم اختيار ملف",
      });
    }

    const userId = req.headers["x-user-id"] || "guest";
    const profile = getOrCreate(userId);
    const url = getFileUrl(req.file.filename);
    const type = req.body.type || "avatar";

    if (profile[type]) {
      const oldName = profile[type].split("/").pop();
      deleteFile(oldName);
    }

    profiles.set(userId, { ...profile, [type]: url });

    logger.info("User image uploaded", { userId, type, filename: req.file.filename });
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.FILE_UPLOAD_SUCCESS,
      data: { url },
    });
  } catch (error) {
    logger.error("Error uploading user image", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.FILE_UPLOAD_ERROR,
    });
  }
};
