const Notification = require("../models/Notification");

exports.getAll = async () =>
  Notification.find().sort({ createdAt: -1 }).limit(50);

exports.markRead = async (id) =>
  Notification.findByIdAndUpdate(id, { read: true }, { new: true });

exports.markAllRead = async () =>
  Notification.updateMany({ read: false }, { read: true });

exports.deleteOne = async (id) =>
  Notification.findByIdAndDelete(id);
