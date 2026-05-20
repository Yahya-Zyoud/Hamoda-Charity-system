const HelpRequest  = require("../models/HelpRequest");
const Notification = require("../models/Notification");
const { HTTP_STATUS } = require("../config/constants");
const { cleanObject } = require("../utils/sanitize");
const logger = require("../utils/logger");

const ALLOWED_STATUSES = ["pending", "accepted", "rejected"];

async function createHelpRequest(req, res, next) {
  try {
    const clean = cleanObject(req.body) || {};
    const { fullName, nationalId, phone, email, city, helpType, description } = clean;

    if (!fullName || !nationalId || !phone || !city || !helpType || !description) {
      return res.sendError("Please fill in all required fields", HTTP_STATUS.BAD_REQUEST);
    }
    if (!/^\d{9}$/.test(nationalId)) {
      return res.sendError("National ID must be exactly 9 digits", HTTP_STATUS.BAD_REQUEST);
    }
    if (!/^05\d{8}$/.test(phone)) {
      return res.sendError("Phone number must start with 05 and be 10 digits", HTTP_STATUS.BAD_REQUEST);
    }
    if (description.trim().length < 20) {
      return res.sendError("Description must be at least 20 characters", HTTP_STATUS.BAD_REQUEST);
    }

    const documentPath = req.file ? `/uploads/help-documents/${req.file.filename}` : null;

    const helpRequest = await HelpRequest.create({
      clerkId: req.userId || "",
      fullName, nationalId, phone, email, city, helpType, description, documentPath,
    });

    Notification.create({
      type:      "request",
      msg:       `New help request from ${fullName} (${helpType})`,
      relatedId: helpRequest._id,
    }).catch((err) => logger.warn("Failed to create notification", { error: err.message }));

    res.sendSuccess(helpRequest, "Help request submitted successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function getAllHelpRequests(req, res, next) {
  try {
    const requests = await HelpRequest.find().sort({ createdAt: -1 });
    res.sendSuccess(requests);
  } catch (error) {
    next(error);
  }
}

async function getHelpRequestById(req, res, next) {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) return res.sendError("Help request not found", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(request);
  } catch (error) {
    next(error);
  }
}

async function updateHelpRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.sendError(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}`, HTTP_STATUS.BAD_REQUEST);
    }
    const request = await HelpRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.sendError("Help request not found", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(request, "Status updated successfully");
  } catch (error) {
    next(error);
  }
}

async function deleteHelpRequest(req, res, next) {
  try {
    const request = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.sendError("Help request not found", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(null, "Help request deleted");
  } catch (error) {
    next(error);
  }
}

module.exports = { createHelpRequest, getAllHelpRequests, getHelpRequestById, updateHelpRequestStatus, deleteHelpRequest };
