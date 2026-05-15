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
    // Hamoda AI classification fields
    aiSuggestedHelpType: { type: String, default: null },
    aiUrgency:           { type: String, enum: ["low", "medium", "high", "critical"], default: null },
    aiConfidence:        { type: Number, default: null },
    aiSummary:           { type: String, default: "" },
    aiModel:             { type: String, default: null },
    aiClassifiedAt:      { type: Date,   default: null },
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
