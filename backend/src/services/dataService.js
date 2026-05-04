const dataAccess = require("../database/dataAccess");
const logger = require("../utils/logger");

/**
 * Data Service - Business logic for data retrieval
 */
class DataService {
  /**
   * Get all items of a specific type
   */
  async getAll(dataType) {
    try {
      logger.debug(`Fetching all ${dataType}`);
      const items = dataAccess.loadData(dataType);
      return {
        success: true,
        data: items,
        count: items.length,
      };
    } catch (error) {
      logger.error(`Error fetching ${dataType}:`, { error: error.message });
      throw error;
    }
  }

  /**
   * Get item by ID
   */
  async getById(dataType, id) {
    try {
      logger.debug(`Fetching ${dataType} by ID: ${id}`);
      const item = dataAccess.findByProperty(dataType, "id", id);
      if (!item) {
        logger.warn(`${dataType} with ID ${id} not found`);
        return {
          success: false,
          data: null,
        };
      }
      return {
        success: true,
        data: item,
      };
    } catch (error) {
      logger.error(`Error fetching ${dataType} by ID:`, { error: error.message });
      throw error;
    }
  }

  /**
   * Get projects
   */
  async getProjects() {
    return this.getAll("projects");
  }

  /**
   * Get services
   */
  async getServices() {
    return this.getAll("services");
  }

  /**
   * Get stats
   */
  async getStats() {
    return this.getAll("stats");
  }

  /**
   * Get partners
   */
  async getPartners() {
    return this.getAll("partners");
  }

  /**
   * Get stories
   */
  async getStories() {
    return this.getAll("stories");
  }
}

module.exports = new DataService();
