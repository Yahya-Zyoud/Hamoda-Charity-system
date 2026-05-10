const Stat = require("../models/Stat");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getStats = async (req, res) => {
  try {
    const items = await Stat.find();
    return res.status(HTTP_STATUS.OK).json({ success: true, data: items, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.getStatById = async (req, res) => {
  try {
    const item = await Stat.findById(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.createStat = async (req, res) => {
  try {
    const item = await Stat.create(req.body);
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const item = await Stat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    const item = await Stat.findByIdAndDelete(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};
