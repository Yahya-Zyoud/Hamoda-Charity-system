const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const Project  = require('../models/Project');
const Notification = require('../models/Notification');
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
        return res.sendError('Invalid project ID', HTTP_STATUS.BAD_REQUEST);
      }
      projectRef = await Project.findById(projectId).select('_id title');
      if (!projectRef) {
        return res.sendError('Project not found', HTTP_STATUS.BAD_REQUEST);
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
      status:      'pending',
    });

    if (projectRef) {
      await Project.findByIdAndUpdate(projectRef._id, { $inc: { raised: Number(amount) } });
    }

    Notification.create({
      type:      'donation',
      msg:       `New donation from ${donorName}: $${Number(amount).toLocaleString()} (${donationType})`,
      relatedId: donation._id,
    }).catch((err) => logger.warn('Failed to create donation notification', { error: err.message }));

    res.sendSuccess(donation, 'Donation received successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function getAllDonations(req, res, next) {
  try {
    const page     = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(200, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 25));
    const skip     = (page - 1) * pageSize;

    if (req.query.paginated === '1') {
      const [items, total] = await Promise.all([
        Donation.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
        Donation.countDocuments(),
      ]);
      return res.sendSuccess({ items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) });
    }

    const donations = await Donation.find().sort({ createdAt: -1 }).limit(200);
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
      date:          d.createdAt.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
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
    if (!donation) return res.sendError('Donation not found', HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(donation);
  } catch (error) {
    next(error);
  }
}

async function updateDonationStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.sendError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, HTTP_STATUS.BAD_REQUEST);
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!donation) return res.sendError('Donation not found', HTTP_STATUS.NOT_FOUND);
    res.sendSuccess(donation, 'Status updated successfully');
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
