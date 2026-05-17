/**
 * Stripe Checkout integration.
 *
 * Graceful degradation: when STRIPE_SECRET_KEY is absent, isEnabled() returns
 * false and the donation controller falls back to "cash/pending" mode. The
 * frontend never sees a 500 — it just shows the existing flow.
 */
const logger = require("../utils/logger");

let _stripe = null;

function isEnabled() {
  return !!process.env.STRIPE_SECRET_KEY;
}

function getClient() {
  if (!isEnabled()) return null;
  if (_stripe) return _stripe;
  try {
    const Stripe = require("stripe");
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return _stripe;
  } catch (err) {
    logger.error("Failed to load Stripe SDK", { error: err.message });
    return null;
  }
}

/**
 * Creates a Checkout Session for a donation. Returns { url, sessionId } on
 * success or null on failure. The caller is responsible for redirecting the
 * browser to `url` so the user can pay.
 */
async function createCheckoutSession({ donation, frontendUrl }) {
  const stripe = getClient();
  if (!stripe) return null;

  const successUrl = `${frontendUrl}/donations/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl  = `${frontendUrl}/donations/cancel`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: donation.donorEmail,
    line_items: [
      {
        price_data: {
          currency: (donation.currency || "USD").toLowerCase(),
          product_data: {
            name: `تبرع — ${donation.donationType}`,
            description: donation.note || "Hamoda Charity Donation",
          },
          unit_amount: Math.round(Number(donation.amount) * 100), // cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      donationId: String(donation._id),
      donationType: donation.donationType,
      projectId: donation.projectId ? String(donation.projectId) : "",
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return { url: session.url, sessionId: session.id };
}

/** Verifies a webhook signature and returns the parsed event, or null. */
function verifyWebhook(rawBody, signature) {
  const stripe = getClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return null;
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    logger.warn("Stripe webhook signature verification failed", { error: err.message });
    return null;
  }
}

module.exports = {
  isEnabled,
  createCheckoutSession,
  verifyWebhook,
};
