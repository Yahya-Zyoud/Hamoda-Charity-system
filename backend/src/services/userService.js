const logger = require("../utils/logger");
const User = require("../models/User");

class UserService {
  async getProfile(userId) {
    try {
      logger.debug(`Fetching profile for user: ${userId}`);
      const user = await User.findById(userId).select("-password");
      if (!user) throw new Error("User not found");
      
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      logger.error("Error fetching profile:", { error: error.message });
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    try {
      logger.debug(`Updating profile for user: ${userId}`);
      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: profileData },
        { new: true, runValidators: true }
      ).select("-password");
      
      if (!updated) throw new Error("User not found");
      logger.info(`Profile updated for user: ${userId}`);
      
      return {
        success: true,
        data: updated,
        message: "تم تحديث الملف الشخصي بنجاح",
      };
    } catch (error) {
      logger.error("Error updating profile:", { error: error.message });
      throw error;
    }
  }

  async uploadImage(userId, filename) {
    try {
      logger.info(`Image uploaded for user: ${userId}`, { filename });
      
      const url = `/uploads/${filename}`;
      const updated = await User.findByIdAndUpdate(
        userId,
        { avatar: url },
        { new: true }
      ).select("-password");
      
      return {
        success: true,
        data: { url },
        message: "تم رفع الصورة بنجاح",
      };
    } catch (error) {
      logger.error("Error uploading image:", { error: error.message });
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find({}).select("-password");
      return { success: true, data: users };
    } catch (error) {
      logger.error("Error fetching all users:", { error: error.message });
      throw error;
    }
  }
}

module.exports = new UserService();

