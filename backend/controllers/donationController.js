const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const Project  = require('../models/Project');
const Notification = require('../models/Notification');
const statsService = require('../services/statsService');
const stripeService = require('../services/stripeService');
const emailService  = require('../services/emailService');
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
      projectRef = await Project.findById(projectId).select('_id title');
      if (!projectRef) {
        return res.sendError('المشروع غير موجود', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // For Stripe payments we create the donation in pending state, hand the
    // browser a Checkout URL, and let the webhook mark it completed.
    // Cash donations stay pending until admin confirms (current behavior).
    const wantsStripe = paymentMethod === 'stripe' && stripeService.isEnabled();

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
      status:      wantsStripe ? 'pending' : 'pending',
    });

    if (projectRef && !wantsStripe) {
      // Credit the project counter immediately for cash donations.
      // For Stripe, we wait for webhook confirmation in handleWebhook().
      await Project.findByIdAndUpdate(projectRef._id, { $inc: { raised: Number(amount) } });
    }

    Notification.create({
      type:      'donation',
      msg:       `تبرع جديد من ${donorName} بمبلغ $${Number(amount).toLocaleString()} (${donationType})`,
      relatedId: donation._id,
    }).catch((err) => logger.warn('Failed to create donation notification', { error: err.message }));

    statsService.invalidateCache();

    // Fire-and-forget thank-you email (works without Stripe too)
    emailService.sendDonationConfirmation(donation, projectRef)
      .catch((err) => logger.warn('Failed to send donation email', { error: err.message }));

    // If Stripe is enabled and chosen, return a checkout URL for the frontend
    // to redirect to. Otherwise return the donation as before.
    if (wantsStripe) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const session = await stripeService.createCheckoutSession({ donation, frontendUrl });
      if (session) {
        donation.stripeSessionId = session.sessionId;
        await donation.save();
        return res.sendSuccess({ donation, checkoutUrl: session.url }, 'تم إنشاء جلسة الدفع', HTTP_STATUS.CREATED);
      }
      // If Stripe failed, fall through to the standard success response —
      // the donation is still saved as pending and an admin can follow up.
      logger.warn('Stripe session creation failed; donation saved as cash-pending', { donationId: donation._id });
    }

    res.sendSuccess(donation, 'تم استلام تبرعك بنجاح، شكرًا لك', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

/**
 * Stripe webhook handler. The Stripe SDK requires the raw request body to
 * verify the signature, so the route mounts express.raw() before this.
 */
async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  const event = stripeService.verifyWebhook(req.body, signature);
  if (!event) {
    return res.status(400).send('Invalid webhook');
  }

  if (event.type === 'checkout.session.completed') {
    const session    = event.data.object;
    const donationId = session.metadata?.donationId;
    if (donationId && mongoose.Types.ObjectId.isValid(donationId)) {
      const donation = await Donation.findByIdAndUpdate(
        donationId,
        { status: 'completed' },
        { new: true }
      );
      if (donation?.projectId) {
        await Project.findByIdAndUpdate(donation.projectId, { $inc: { raised: Number(donation.amount) } });
      }
      statsService.invalidateCache();
      logger.info('Stripe payment completed', { donationId });
    }
  }

  // Always 200 — Stripe retries non-2xx and we don't want noise.
  res.json({ received: true });
}

async function getAllDonations(req, res, next) {
  try {
    // Backwards-compatible: when no pagination query is sent, return an
    // unwrapped array (old admin pages). When ?paginated=1 is sent, return
    // a { items, page, ... } envelope for the new paginated tables.
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

async function downloadReceipt(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.sendError('لم يتم العثور على التبرع', HTTP_STATUS.NOT_FOUND);
    let project = null;
    if (donation.projectId) {
      project = await Project.findById(donation.projectId).select('title');
    }
    const { streamReceipt } = require('../services/receiptService');
    streamReceipt(res, donation, project);
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
  handleStripeWebhook,
  downloadReceipt,
};
