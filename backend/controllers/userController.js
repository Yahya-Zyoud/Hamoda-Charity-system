const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");
const logger = require("../utils/logger");

let profile = {
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

exports.getProfile = (req, res) => {
  try {
    logger.info("User profile retrieved");
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
    profile = { ...profile, ...req.body };

    logger.info("User profile updated");
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS,
      data: profile,
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

    const url = getFileUrl(req.file.filename);
    const type = req.body.type || "avatar";

    if (profile[type]) {
      const oldName = profile[type].split("/").pop();
      deleteFile(oldName);
    }

    profile[type] = url;

    logger.info("User image uploaded", { type, filename: req.file.filename });

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
