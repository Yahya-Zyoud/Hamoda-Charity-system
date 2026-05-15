const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const Notification = require("../models/Notification");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require("stripe")(key);
}

// ── Direct donation (Hamza's flow — no Stripe redirect) ───────────────────
exports.createDonation = async (req, res) => {
  try {
    if (!isDBReady()) {
      return res.sendError("قاعدة البيانات غير متصلة", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const { donationType, amount, donorName, donorEmail, donorPhone, donorCity, paymentMethod } = req.body;

    const donation = await Donation.create({
      donationType,
      amount:        Number(amount),
      donorName:     donorName.trim(),
      donorEmail:    donorEmail.trim().toLowerCase(),
      donorPhone:    donorPhone.trim(),
      donorCity:     donorCity ? donorCity.trim() : "",
      paymentMethod,
      status:        "completed",
      userId:        req.userId || "",
    });

    logger.info("Direct donation created", { id: donation._id, amount: donation.amount });

    Notification.create({
      type:      "donation",
      msg:       `تبرع جديد بمبلغ $${donation.amount} من ${donation.donorName} (${donation.donationType})`,
      relatedId: donation._id,
    }).catch((err) => logger.warn("Failed to create donation notification", { error: err.message }));

    return res.sendSuccess(donation, "تم استلام تبرعك بنجاح، شكرًا لك");
  } catch (error) {
    logger.error("Error creating donation", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// ── Stripe checkout (Yahya's flow) ────────────────────────────────────────
exports.createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.sendError("بوابة الدفع غير مهيأة — أضف STRIPE_SECRET_KEY في .env", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const { amount, projectId, projectTitle, donorName, email, note, donationType } = req.body;
    const clerkId = req.userId || "";

    if (!amount || Number(amount) < 1) {
      return res.sendError("الحد الأدنى للتبرع هو 1$", HTTP_STATUS.BAD_REQUEST);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `تبرع لـ ${projectTitle || "جمعية حمودة الخيرية"}`,
            description: note || "شكراً جزيلاً لدعمك",
          },
          unit_amount: Math.round(Number(amount) * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: email || undefined,
      success_url: `${FRONTEND_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${FRONTEND_URL}/donations`,
      metadata: {
        projectId:    projectId    || "",
        projectTitle: projectTitle || "",
        donorName:    donorName    || "",
        donationType: donationType || "",
        clerkId,
        note:         note         || "",
      },
    });

    logger.info("Stripe checkout session created", { sessionId: session.id, amount });
    return res.sendSuccess({ url: session.url });
  } catch (error) {
    logger.error("Error creating checkout session", { error: error.message });
    return res.sendError("حدث خطأ أثناء إنشاء جلسة الدفع", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.verifyAndSaveDonation = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.sendError("بوابة الدفع غير مهيأة", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const { session_id } = req.query;
    if (!session_id) return res.sendError("session_id مطلوب", HTTP_STATUS.BAD_REQUEST);

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.sendError("لم يكتمل الدفع بعد", HTTP_STATUS.BAD_REQUEST);
    }

    if (isDBReady()) {
      const existing = await Donation.findOne({ stripeSessionId: session_id });
      if (!existing) {
        const { projectId, donorName, clerkId, note, projectTitle, donationType } = session.metadata;
        const donationData = {
          donationType:    donationType || "صدقة",
          donorName:       donorName || session.customer_details?.name || "متبرع",
          donorEmail:      session.customer_details?.email || "unknown@stripe.com",
          donorPhone:      "",
          paymentMethod:   "stripe",
          amount:          session.amount_total / 100,
          currency:        session.currency.toUpperCase(),
          status:          "completed",
          note:            note || "",
          userId:          clerkId || "",
          stripeSessionId: session_id,
        };
        if (projectId) donationData.projectId = projectId;
        await Donation.create(donationData);
        logger.info("Donation saved from Stripe", { sessionId: session_id });
      }
    }

    return res.sendSuccess({
      amount:        session.amount_total / 100,
      currency:      session.currency,
      donor:         session.customer_details?.name || session.metadata.donorName || "متبرع",
      project:       session.metadata.projectTitle || "",
      paymentStatus: session.payment_status,
    });
  } catch (error) {
    logger.error("Error verifying donation", { error: error.message });
    return res.sendError("حدث خطأ أثناء التحقق من الدفع", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// ── Admin: list all ───────────────────────────────────────────────────────
exports.getAllDonations = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("projectId", "title");
    return res.sendSuccess(donations);
  } catch (error) {
    logger.error("Error fetching donations", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getDonationById = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    const donation = await Donation.findById(req.params.id).populate("projectId", "title");
    if (!donation) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return res.sendSuccess(donation);
  } catch (error) {
    logger.error("Error fetching donation", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    const { status } = req.body;
    const VALID_STATUSES = ["pending", "completed", "failed"];
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.sendError(`الحالة يجب أن تكون: ${VALID_STATUSES.join(" | ")}`, HTTP_STATUS.BAD_REQUEST);
    }
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!donation) return res.sendError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info("Donation status updated", { id: req.params.id, status });
    return res.sendSuccess(donation, "تم تحديث الحالة بنجاح");
  } catch (error) {
    logger.error("Error updating donation status", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// ── Public: recent + stats (Hamza's logic) ───────────────────────────────
exports.getRecentDonations = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const limit = Math.min(Number(req.query.limit) || 6, 50);
    const donations = await Donation.find({ status: { $ne: "failed" } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("donorName donationType amount paymentMethod createdAt");

    const formatted = donations.map((d) => ({
      id:            d._id,
      name:          d.donorName,
      type:          d.donationType,
      paymentMethod: d.paymentMethod,
      amount:        `$${Number(d.amount).toLocaleString()}`,
      date:          d.createdAt.toLocaleDateString("ar-SA", {
        day: "numeric", month: "long", year: "numeric",
      }),
    }));

    return res.sendSuccess(formatted);
  } catch (error) {
    logger.error("Error fetching recent donations", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getDonationStats = async (req, res) => {
  try {
    if (!isDBReady()) {
      return res.sendSuccess({ totalAmount: 0, totalDonors: 0, totalAmountFormatted: "$0" });
    }

    const result = await Donation.aggregate([
      { $match: { status: { $ne: "failed" } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" }, totalDonors: { $sum: 1 } } },
    ]);

    const stats = result[0] || { totalAmount: 0, totalDonors: 0 };
    return res.sendSuccess({
      totalAmount:          stats.totalAmount,
      totalDonors:          stats.totalDonors,
      totalAmountFormatted: `$${Number(stats.totalAmount).toLocaleString()}`,
    });
  } catch (error) {
    logger.error("Error fetching donation stats", { error: error.message });
    return res.sendError(MESSAGES.ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
