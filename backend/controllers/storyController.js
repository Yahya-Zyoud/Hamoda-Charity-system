const Story = require("../models/Story");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getStories = async (req, res) => {
  try {
    const items = await Story.find();
    return res.status(HTTP_STATUS.OK).json({ success: true, data: items, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const item = await Story.findById(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.createStory = async (req, res) => {
  try {
    const item = await Story.create(req.body);
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const item = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const item = await Story.findByIdAndDelete(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};
