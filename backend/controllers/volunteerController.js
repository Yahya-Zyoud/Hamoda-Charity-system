const Volunteer    = require("../models/Volunteer");
const Notification = require("../models/Notification");
const { HTTP_STATUS } = require("../config/constants");
const { cleanObject } = require("../utils/sanitize");
const logger = require("../utils/logger");

const VALID_STATUSES = ["pending", "approved", "rejected"];

async function createVolunteer(req, res, next) {
  try {
    const clean = cleanObject(req.body) || {};
    const { fullName, email, phone, city, skills, availability, note } = clean;

    if (!fullName || !email || !phone) {
      return res.sendError("Name, email, and phone are required", HTTP_STATUS.BAD_REQUEST);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.sendError("Invalid email address", HTTP_STATUS.BAD_REQUEST);
    }

    const volunteer = await Volunteer.create({
      fullName: fullName.trim(),
      email:    email.trim().toLowerCase(),
      phone:    phone.trim(),
      city:     city || "",
      skills:   skills || "",
      availability: availability || "",
      note:     note || "",
    });

    Notification.create({
      type:      "volunteer",
      msg:       `New volunteer application from ${fullName}`,
      relatedId: volunteer._id,
    }).catch((err) => logger.warn("Failed to create volunteer notification", { error: err.message }));

    res.sendSuccess(volunteer, "Volunteer application received. Thank you!", HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function getAllVolunteers(req, res, next) {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.sendSuccess(volunteers);
  } catch (error) {
    next(error);
  }
}

async function updateVolunteerStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.sendError(`Status must be one of: ${VALID_STATUSES.join(", ")}`, HTTP_STATUS.BAD_REQUEST);
    }
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!volunteer) return res.sendError("Volunteer not found", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(volunteer, "Status updated successfully");
  } catch (error) {
    next(error);
  }
}

module.exports = { createVolunteer, getAllVolunteers, updateVolunteerStatus };
