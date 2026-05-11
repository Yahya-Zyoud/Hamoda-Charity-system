const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    nationalId: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    helpType: {
      type: String,
      required: true,
      enum: ["medical", "education", "food", "housing", "financial", "other"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    documentPath: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HelpRequest", helpRequestSchema);