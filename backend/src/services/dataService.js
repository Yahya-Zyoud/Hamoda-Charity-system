const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Stat = require("../models/Stat");
const Partner = require("../models/Partner");
const Story = require("../models/Story");
const logger = require("../utils/logger");

// Mongoose model map
const models = {
  projects: Project,
  services: Service,
  stats: Stat,
  partners: Partner,
  stories: Story,
};

// JSON file paths (relative to backend/data/)
const DATA_DIR = path.join(__dirname, "../../data");

const isMongoConnected = () => mongoose.connection.readyState === 1;

const loadJson = (dataType) => {
  try {
    const filePath = path.join(DATA_DIR, `${dataType}.json`);
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    logger.warn(`JSON fallback failed for ${dataType}: ${err.message}`);
    return [];
  }
};

/**
 * Data Service - Uses MongoDB when connected, falls back to JSON files otherwise.
 */
class DataService {
  async getAll(dataType) {
    try {
      if (isMongoConnected()) {
        logger.debug(`Fetching all ${dataType} from MongoDB`);
        const Model = models[dataType];
        if (!Model) throw new Error("Invalid data type");
        const items = await Model.find({});
        return { success: true, data: items, count: items.length };
      } else {
        logger.debug(`Fetching all ${dataType} from JSON fallback`);
        const items = loadJson(dataType);
        return { success: true, data: items, count: items.length };
      }
    } catch (error) {
      logger.error(`Error fetching ${dataType}:`, { error: error.message });
      // Last resort: try JSON even if Mongo threw
      const items = loadJson(dataType);
      if (items.length > 0) {
        return { success: true, data: items, count: items.length };
      }
      throw error;
    }
  }

  async getById(dataType, id) {
    try {
      if (isMongoConnected()) {
        logger.debug(`Fetching ${dataType} by ID: ${id} from MongoDB`);
        const Model = models[dataType];
        if (!Model) throw new Error("Invalid data type");
        const item = await Model.findById(id);
        if (!item) return { success: false, data: null };
        return { success: true, data: item };
      } else {
        logger.debug(`Fetching ${dataType} by ID: ${id} from JSON fallback`);
        const items = loadJson(dataType);
        const item = items.find((i) => String(i.id) === String(id) || String(i._id) === String(id));
        if (!item) return { success: false, data: null };
        return { success: true, data: item };
      }
    } catch (error) {
      logger.error(`Error fetching ${dataType} by ID:`, { error: error.message });
      throw error;
    }
  }

  async getProjects() { return this.getAll("projects"); }
  async getServices()  { return this.getAll("services"); }
  async getStats()     { return this.getAll("stats"); }
  async getPartners()  { return this.getAll("partners"); }
  async getStories()   { return this.getAll("stories"); }

  async create(dataType, data) {
    if (!isMongoConnected()) throw new Error("Database not connected");
    try {
      const Model = models[dataType];
      if (!Model) throw new Error("Invalid data type");
      const item = await Model.create(data);
      return { success: true, data: item };
    } catch (error) {
      logger.error(`Error creating ${dataType}:`, { error: error.message });
      throw error;
    }
  }

  async update(dataType, id, data) {
    if (!isMongoConnected()) throw new Error("Database not connected");
    try {
      const Model = models[dataType];
      if (!Model) throw new Error("Invalid data type");
      const item = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!item) return { success: false, data: null };
      return { success: true, data: item };
    } catch (error) {
      logger.error(`Error updating ${dataType}:`, { error: error.message });
      throw error;
    }
  }

  async delete(dataType, id) {
    if (!isMongoConnected()) throw new Error("Database not connected");
    try {
      const Model = models[dataType];
      if (!Model) throw new Error("Invalid data type");
      const item = await Model.findByIdAndDelete(id);
      if (!item) return { success: false, data: null };
      return { success: true, data: item };
    } catch (error) {
      logger.error(`Error deleting ${dataType}:`, { error: error.message });
      throw error;
    }
  }
}

module.exports = new DataService();
