const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.getAll = async () => {
  if (!isDBReady()) return [];
  return Notification.find().sort({ createdAt: -1 }).limit(50);
};

exports.markRead = async (id) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
};

exports.markAllRead = async () => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Notification.updateMany({ read: false }, { read: true });
};

exports.deleteOne = async (id) => {
  if (!isDBReady()) throw new Error("Database not connected");
  return Notification.findByIdAndDelete(id);
};
