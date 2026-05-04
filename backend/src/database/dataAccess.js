const fs = require("fs");
const path = require("path");
const logger = require("./logger");

/**
 * Data Access Layer - Handles all JSON file read/write operations
 */
class DataAccess {
  constructor(dataDir = path.join(__dirname, "../data")) {
    this.dataDir = dataDir;
  }

  /**
   * Load data from JSON file
   * @param {string} filename - filename without extension
   * @returns {Array|Object} parsed JSON data
   */
  loadData(filename) {
    try {
      const filePath = path.join(this.dataDir, `${filename}.json`);
      const content = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(content);
      logger.debug(`Data loaded successfully: ${filename}`);
      return data;
    } catch (error) {
      logger.error(`Failed to load data from ${filename}.json:`, { error: error.message });
      return [];
    }
  }

  /**
   * Save data to JSON file
   * @param {string} filename - filename without extension
   * @param {Array|Object} data - data to save
   * @returns {boolean} success status
   */
  saveData(filename, data) {
    try {
      const filePath = path.join(this.dataDir, `${filename}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      logger.info(`Data saved successfully: ${filename}`);
      return true;
    } catch (error) {
      logger.error(`Failed to save data to ${filename}.json:`, { error: error.message });
      return false;
    }
  }

  /**
   * Find item by property
   * @param {string} filename - filename without extension
   * @param {string} property - property to search
   * @param {*} value - value to match
   * @returns {Object|null} found item or null
   */
  findByProperty(filename, property, value) {
    try {
      const data = this.loadData(filename);
      if (!Array.isArray(data)) return null;
      return data.find(item => item[property] === value) || null;
    } catch (error) {
      logger.error(`Failed to find item in ${filename}:`, { error: error.message });
      return null;
    }
  }

  /**
   * Filter items by property
   * @param {string} filename - filename without extension
   * @param {string} property - property to filter
   * @param {*} value - value to match
   * @returns {Array} filtered items
   */
  filterByProperty(filename, property, value) {
    try {
      const data = this.loadData(filename);
      if (!Array.isArray(data)) return [];
      return data.filter(item => item[property] === value);
    } catch (error) {
      logger.error(`Failed to filter items in ${filename}:`, { error: error.message });
      return [];
    }
  }
}

// Export singleton instance
module.exports = new DataAccess();
