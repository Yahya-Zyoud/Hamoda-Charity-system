const Partner = require("../models/Partner");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getPartners = async (req, res) => {
  try {
    const items = await Partner.find();
    return res.status(HTTP_STATUS.OK).json({ success: true, data: items, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.getPartnerById = async (req, res) => {
  try {
    const item = await Partner.findById(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.createPartner = async (req, res) => {
  try {
    const item = await Partner.create(req.body);
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const item = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const item = await Partner.findByIdAndDelete(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};
