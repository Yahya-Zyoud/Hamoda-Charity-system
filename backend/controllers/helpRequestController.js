const HelpRequest = require("../models/HelpRequest");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

// POST /api/help-requests  (public)
exports.createHelpRequest = async (req, res) => {
  try {
    const { name, phone, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "الاسم مطلوب" });
    }
    if (!phone || !phone.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "رقم الهاتف مطلوب" });
    }
    if (!description || description.trim().length < 10) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "يرجى وصف الحالة بشكل مفصل (10 أحرف على الأقل)" });
    }

    const helpRequest = await HelpRequest.create(req.body);
    logger.info("Help request created", { id: helpRequest._id, name: helpRequest.name });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "تم إرسال طلبك بنجاح. سيتواصل معك فريقنا قريباً.",
      data: helpRequest,
    });
  } catch (error) {
    logger.error("Error creating help request", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

// GET /api/help-requests  (admin only)
exports.getHelpRequests = async (req, res) => {
  try {
    const { status, urgency, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (urgency) filter.urgency = urgency;

    const total = await HelpRequest.countDocuments(filter);
    const items = await HelpRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    logger.info("Help requests retrieved", { count: items.length });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: items,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("Error fetching help requests", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

// GET /api/help-requests/:id  (admin only)
exports.getHelpRequestById = async (req, res) => {
  try {
    const item = await HelpRequest.findById(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item });
  } catch (error) {
    logger.error("Error fetching help request", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

// PUT /api/help-requests/:id  (admin only)
exports.updateHelpRequest = async (req, res) => {
  try {
    const item = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    logger.info("Help request updated", { id: req.params.id, status: item.status });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: item });
  } catch (error) {
    logger.error("Error updating help request", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};

// DELETE /api/help-requests/:id  (admin only)
exports.deleteHelpRequest = async (req, res) => {
  try {
    const item = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!item) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NOT_FOUND });
    logger.info("Help request deleted", { id: req.params.id });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.SUCCESS });
  } catch (error) {
    logger.error("Error deleting help request", { error: error.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.ERROR });
  }
};
