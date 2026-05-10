const logger = require("../utils/logger");
const { validateSubscribeEmail } = require("../validators");
const Subscription = require("../models/Subscription");

class SubscribeService {
  async subscribe(email) {
    try {
      const cleanEmail = validateSubscribeEmail(email);
      logger.info("[Newsletter] New subscriber", { email: cleanEmail });
      
      const existing = await Subscription.findOne({ email: cleanEmail });
      if (existing) {
        throw new Error("مسجل مسبقاً");
      }

      const subscription = await Subscription.create({ email: cleanEmail });
      
      return {
        success: true,
        data: {
          email: subscription.email,
          subscribedAt: subscription.createdAt,
        },
      };
    } catch (error) {
      logger.error("Error subscribing to newsletter:", { error: error.message });
      throw error;
    }
  }

  async unsubscribe(email) {
    try {
      const cleanEmail = validateSubscribeEmail(email);
      logger.info("[Newsletter] Subscriber removed", { email: cleanEmail });
      
      await Subscription.findOneAndDelete({ email: cleanEmail });
      
      return {
        success: true,
        message: "تم إلغاء الاشتراك بنجاح",
      };
    } catch (error) {
      logger.error("Error unsubscribing from newsletter:", { error: error.message });
      throw error;
    }
  }
}

module.exports = new SubscribeService();
