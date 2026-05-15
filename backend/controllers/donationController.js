// controllers/donationController.js

const Donation = require('../models/Donation');

// POST /api/donations
async function createDonation(req, res, next) {
  try {
    const {
      donationType,
      amount,
      donorName,
      donorEmail,
      donorPhone,
      donorCity,
      paymentMethod,
    } = req.body;

    const donation = await Donation.create({
      donationType,
      amount: Number(amount),
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim().toLowerCase(),
      donorPhone: donorPhone.trim(),
      donorCity: donorCity ? donorCity.trim() : '',
      paymentMethod,
      status: 'completed', // حتى تنحسب مباشرة ضمن الإجمالي
    });

    res.status(201).json({
      success: true,
      message: 'تم استلام تبرعك بنجاح، شكرًا لك',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/donations
async function getAllDonations(req, res, next) {
  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/donations/recent
async function getRecentDonations(req, res, next) {
  try {
    const donations = await Donation.find({ status: { $ne: 'failed' } })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('donorName donationType amount paymentMethod createdAt');

    const formatted = donations.map((d) => ({
      _id: d._id,
      name: d.donorName,
      type: d.donationType,
      paymentMethod: d.paymentMethod,
      amount: `$${Number(d.amount).toLocaleString()}`,
      date: d.createdAt.toLocaleDateString('ar-SA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/donations/stats
async function getDonationStats(req, res, next) {
  try {
    const result = await Donation.aggregate([
      { $match: { status: { $ne: 'failed' } } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonors: { $sum: 1 },
        },
      },
    ]);

    const stats = result[0] || {
      totalAmount: 0,
      totalDonors: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalAmount: stats.totalAmount,
        totalDonors: stats.totalDonors,
        totalAmountFormatted: `$${Number(stats.totalAmount).toLocaleString()}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/donations/:id
async function getDonationById(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على التبرع',
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/donations/:id/status
async function updateDonationStatus(req, res, next) {
  try {
    const { status } = req.body;
    const VALID_STATUSES = ['pending', 'completed', 'failed'];

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `الحالة يجب أن تكون: ${VALID_STATUSES.join(' | ')}`,
      });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على التبرع',
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث الحالة بنجاح',
      data: donation,
    });
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