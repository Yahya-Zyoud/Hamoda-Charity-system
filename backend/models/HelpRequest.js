const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    clerkId:      { type: String, default: "" },
    fullName:     { type: String, required: true, trim: true },
    nationalId:   { type: String, required: true, trim: true },
    phone:        { type: String, required: true, trim: true },
    email:        { type: String, trim: true, default: "" },
    city:         { type: String, required: true, trim: true },
    helpType: {
      type: String,
      required: true,
      enum: ["medical", "education", "food", "housing", "financial", "other"],
    },
    description:  { type: String, required: true, trim: true },
    documentPath: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // ----- حمودة (Hamoda) AI fields -----
    // These are populated automatically by the Hamoda AI helper after a
    // request is created. They are optional so the app works fine even
    // when OPENAI_API_KEY is not configured.
    aiSuggestedHelpType: {
      type: String,
      enum: ["medical", "education", "food", "housing", "financial", "other", null],
      default: null,
    },
    aiSummary:     { type: String, default: "" },
    aiUrgency: {
      type: String,
      enum: ["low", "medium", "high", "critical", null],
      default: null,
    },
    aiConfidence:  { type: Number, default: null }, // 0..1
    aiClassifiedAt:{ type: Date, default: null },
    aiModel:       { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("HelpRequest", helpRequestSchema);
