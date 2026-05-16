const mongoose = require("mongoose");
const User = require("../models/User");
const HelpRequest = require("../models/HelpRequest");
const Donation = require("../models/Donation");
const { getFileUrl, deleteFile } = require("../utils/fileHandler");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getUsers = async () => {
  if (!isDBReady()) return [];
  return User.find().sort({ createdAt: -1 });
};

exports.updateUserRole = async (id, role) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return User.findByIdAndUpdate(id, { role }, { new: true });
};

exports.updateUserStatus = async (id, status) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return User.findByIdAndUpdate(id, { status }, { new: true });
};

exports.getProfile = async (clerkId) => {
  if (!isDBReady()) throw new Error("Database not connected");
  let user = await User.findOne({ clerkId });
  if (!user) user = await User.create({ clerkId });
  return user;
};

exports.updateProfile = async (clerkId, data) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return User.findOneAndUpdate(
    { clerkId },
    { $set: data },
    { new: true, upsert: true, runValidators: true }
  );
};

exports.getUserActivity = async (clerkId) => {
  if (!isDBReady()) {
    return { helpRequests: [], donations: [], stats: { totalRequests: 0, totalDonations: 0, totalProjects: 0, donationAmount: 0 } };
  }

  const [helpRequests, donations] = await Promise.all([
    HelpRequest.find({ clerkId }).sort({ createdAt: -1 }).limit(10).lean(),
    Donation.find({ userId: clerkId }).populate("projectId", "title").sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const uniqueProjects = new Set(
    donations.filter((d) => d.projectId).map((d) => String(d.projectId._id || d.projectId))
  ).size;

  return {
    helpRequests,
    donations,
    stats: {
      totalRequests:  helpRequests.length,
      totalDonations: donations.length,
      totalProjects:  uniqueProjects,
      donationAmount: donations.reduce((s, d) => s + (d.amount || 0), 0),
    },
  };
};

exports.uploadImage = async (clerkId, file, type = "avatar") => {
  if (!file) throw Object.assign(new Error("لم يتم اختيار ملف"), { status: 400 });
  const url = getFileUrl(file.filename);
  if (isDBReady()) {
    const existing = await User.findOne({ clerkId });
    if (existing && existing[type]) {
      deleteFile(existing[type].split("/").pop());
    }
    await User.findOneAndUpdate({ clerkId }, { $set: { [type]: url } }, { upsert: true });
  }
  return { url };
};
