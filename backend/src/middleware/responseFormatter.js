const logger = require("../utils/logger");

/**
 * Response formatter middleware
 * Wraps successful responses with standard format
 */
const responseFormatter = (req, res, next) => {
  // Store original json method
  const originalJson = res.json;

  // Override json method
  res.json = function(data) {
    // If response already has success field, don't wrap it
    if (data && typeof data === "object" && "success" in data) {
      return originalJson.call(this, data);
    }

    // Otherwise, don't wrap non-error responses here
    // Let controllers handle formatting
    return originalJson.call(this, data);
  };

  next();
};

module.exports = {
  responseFormatter,
};
