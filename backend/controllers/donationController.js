const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

const isDBReady = () => mongoose.connection.readyState === 1;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require("stripe")(key);
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.sendError("بوابة الدفع غير مهيأة — أضف STRIPE_SECRET_KEY في .env", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const { amount, projectId, projectTitle, donorName, email, note } = req.body;
    const clerkId = req.headers["x-user-id"] || "";

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
      cancel_url:  `${FRONTEND_URL}/donate`,
      metadata: {
        projectId:    projectId    || "",
        projectTitle: projectTitle || "",
        donorName:    donorName    || "",
        clerkId:      clerkId,
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
        const { projectId, donorName, clerkId, note, projectTitle } = session.metadata;
        const donationData = {
          userId:          clerkId || "",
          donor:           donorName || session.customer_details?.name || "متبرع",
          email:           session.customer_details?.email || "",
          amount:          session.amount_total / 100,
          currency:        session.currency.toUpperCase(),
          status:          "completed",
          method:          "stripe",
          note:            note || "",
          stripeSessionId: session_id,
        };
        if (projectId) donationData.projectId = projectId;
        await Donation.create(donationData);
        logger.info("Donation saved from Stripe session", { sessionId: session_id, amount: donationData.amount });
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

exports.getAllDonations = async (req, res) => {
  try {
    if (!isDBReady()) return res.sendSuccess([]);
    const donations = await Donation.find()
      .populate("projectId", "title")
      .sort({ createdAt: -1 });
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
