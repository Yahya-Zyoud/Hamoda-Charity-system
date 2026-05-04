const logger = require("../utils/logger");
const { validateSubscribeEmail } = require("../validators");

/**
 * Subscribe Service - Business logic for newsletter subscriptions
 */
class SubscribeService {
  /**
   * Subscribe email to newsletter
   * TODO: Integrate with email service to save subscriptions
   */
  async subscribe(email) {
    try {
      // Validate email
      const cleanEmail = validateSubscribeEmail(email);
      
      logger.info("[Newsletter] New subscriber", { email: cleanEmail });
      
      // TODO: Save to database/file when implementing persistence
      // const saved = dataAccess.addSubscriber(cleanEmail);
      
      return {
        success: true,
        data: {
          email: cleanEmail,
          subscribedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      logger.error("Error subscribing to newsletter:", { error: error.message });
      throw error;
    }
  }

  /**
   * Unsubscribe email from newsletter
   */
  async unsubscribe(email) {
    try {
      const cleanEmail = validateSubscribeEmail(email);
      logger.info("[Newsletter] Subscriber removed", { email: cleanEmail });
      
      // TODO: Remove from database when implementing persistence
      
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
