const Service = require("../models/Service");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getServices = async (req, res) => {
  try {
    const items = await Service.find();
    return res.status(HTTP_STATUS.OK).json({ success: true, data: items, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.createService = async (req, res) => {
  try {
    const item = await Service.create(req.body);
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.updateService = async (req, res) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const item = await Service.findByIdAndDelete(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};
