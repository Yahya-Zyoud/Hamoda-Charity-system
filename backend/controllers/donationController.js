const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const Project  = require('../models/Project');
const Notification = require('../models/Notification');
const statsService = require('../services/statsService');
const { HTTP_STATUS } = require('../config/constants');
const { cleanObject } = require('../utils/sanitize');
const logger = require('../utils/logger');

const VALID_STATUSES = ['pending', 'completed', 'failed'];

async function createDonation(req, res, next) {
  try {
    const clean = cleanObject(req.body) || {};
    const { donationType, amount, donorName, donorEmail, donorPhone, donorCity, paymentMethod, note, userId, projectId } = clean;

    let projectRef = null;
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.sendError('معرّف المشروع غير صالح', HTTP_STATUS.BAD_REQUEST);
      }
      projectRef = await Project.findById(projectId).select('_id');
      if (!projectRef) {
        return res.sendError('المشروع غير موجود', HTTP_STATUS.BAD_REQUEST);
      }
    }

    const donation = await Donation.create({
      donationType,
      amount:      Number(amount),
      donorName:   donorName.trim(),
      donorEmail:  donorEmail.trim().toLowerCase(),
      donorPhone:  donorPhone ? donorPhone.trim() : '',
      donorCity:   donorCity  ? donorCity.trim()  : '',
      paymentMethod,
      note:        note   || '',
      userId:      userId || req.userId || '',
      projectId:   projectRef ? projectRef._id : undefined,
    });

    if (projectRef) {
      // Increment project raised counter for completed/pending donations.
      // Cash donations remain pending until admin confirms — we still credit
      // the project so the public progress bar reflects the inflow.
      await Project.findByIdAndUpdate(projectRef._id, { $inc: { raised: Number(amount) } });
    }

    Notification.create({
      type:      'donation',
      msg:       `تبرع جديد من ${donorName} بمبلغ ${Number(amount).toLocaleString('ar-EG')} ₪ (${donationType})`,
      relatedId: donation._id,
    }).catch((err) => logger.warn('Failed to create donation notification', { error: err.message }));

    statsService.invalidateCache();

    res.sendSuccess(donation, 'تم استلام تبرعك بنجاح، شكرًا لك', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function getAllDonations(req, res, next) {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).limit(50);
    res.sendSuccess(donations);
  } catch (error) {
    next(error);
  }
}

async function getRecentDonations(req, res, next) {
  try {
    const requested = Number.parseInt(req.query.limit, 10);
    const limit     = Number.isFinite(requested) && requested > 0 ? Math.min(requested, 50) : 6;

    const donations = await Donation.find({ status: { $ne: 'failed' } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('donorName donationType amount paymentMethod createdAt');

    const formatted = donations.map((d) => ({
      _id:           d._id,
      name:          d.donorName,
      type:          d.donationType,
      paymentMethod: d.paymentMethod,
      amount:        `$${Number(d.amount).toLocaleString()}`,
      date:          d.createdAt.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }),
    }));

    res.sendSuccess(formatted);
  } catch (error) {
    next(error);
  }
}

async function getDonationStats(req, res, next) {
  try {
    const result = await Donation.aggregate([
      { $match: { status: { $ne: 'failed' } } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' }, totalDonors: { $sum: 1 } } },
    ]);

    const stats = result[0] || { totalAmount: 0, totalDonors: 0 };

    res.sendSuccess({
      totalAmount:          stats.totalAmount,
      totalDonors:          stats.totalDonors,
      totalAmountFormatted: `$${Number(stats.totalAmount).toLocaleString()}`,
    });
  } catch (error) {
    next(error);
  }
}

async function getDonationById(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.sendError('لم يتم العثور على التبرع', HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(donation);
  } catch (error) {
    next(error);
  }
}

async function updateDonationStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.sendError(`الحالة يجب أن تكون: ${VALID_STATUSES.join(' | ')}`, HTTP_STATUS.BAD_REQUEST);
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!donation) return res.sendError('لم يتم العثور على التبرع', HTTP_STATUS.NOT_FOUND);

    res.sendSuccess(donation, 'تم تحديث الحالة بنجاح');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createDonation,
  getAllDonations,
  getRecentDonations,
  getDonationStats,
  getDonationById,
  updateDonationStatus,
};
