const mongoose = require("mongoose");
const User = require("../models/User");
const HelpRequest = require("../models/HelpRequest");
const Donation = require("../models/Donation");
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

exports.getUsers = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const users = await User.find().sort({ createdAt: -1 });
    return res.sendSuccess(users);
  } catch (error) {
    logger.error("Error fetching users", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error updating user role", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError("Database not connected", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(user);
  } catch (error) {
    logger.error("Error updating user status", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
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

exports.getUserActivity = async (req, res) => {
  try {
    const clerkId = req.headers["x-user-id"] || "guest";

    if (!isDBReady()) {
      return res.sendSuccess({ helpRequests: [], donations: [], stats: { totalRequests: 0, totalDonations: 0, totalProjects: 0, donationAmount: 0 } });
    }

    const [helpRequests, donations] = await Promise.all([
      HelpRequest.find({ clerkId }).sort({ createdAt: -1 }).limit(10).lean(),
      Donation.find({ userId: clerkId }).populate("projectId", "title").sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    const uniqueProjects = new Set(
      donations.filter((d) => d.projectId).map((d) => String(d.projectId._id || d.projectId))
    ).size;

    return res.sendSuccess({
      helpRequests,
      donations,
      stats: {
        totalRequests: helpRequests.length,
        totalDonations: donations.length,
        totalProjects: uniqueProjects,
        donationAmount: donations.reduce((s, d) => s + (d.amount || 0), 0),
      },
    });
  } catch (error) {
    logger.error("Error fetching user activity", { error: error.message });
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
