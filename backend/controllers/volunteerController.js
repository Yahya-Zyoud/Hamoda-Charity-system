const Volunteer    = require("../models/Volunteer");
const Notification = require("../models/Notification");
const { HTTP_STATUS } = require("../config/constants");
const { cleanObject } = require("../utils/sanitize");
const logger = require("../utils/logger");

async function createVolunteer(req, res, next) {
  try {
    const clean = cleanObject(req.body) || {};
    const { fullName, email, phone, city, skills, availability, note } = clean;

    if (!fullName || !email || !phone) {
      return res.sendError("يرجى تعبئة الاسم والبريد ورقم الهاتف.", HTTP_STATUS.BAD_REQUEST);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.sendError("البريد الإلكتروني غير صحيح", HTTP_STATUS.BAD_REQUEST);
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
      msg:       `طلب تطوع جديد من ${fullName}`,
      relatedId: volunteer._id,
    }).catch((err) => logger.warn("Failed to create volunteer notification", { error: err.message }));

    res.sendSuccess(volunteer, "تم استلام طلب التطوع، شكراً لاهتمامك.", HTTP_STATUS.CREATED);
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
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.sendError("قيمة الحالة غير صالحة.", HTTP_STATUS.BAD_REQUEST);
    }
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!volunteer) return res.sendError("غير موجود", HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(volunteer, "تم تحديث الحالة بنجاح.");
  } catch (error) {
    next(error);
  }
}

module.exports = { createVolunteer, getAllVolunteers, updateVolunteerStatus };
