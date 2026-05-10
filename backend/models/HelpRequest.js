const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, trim: true, lowercase: true },
    phone:        { type: String, trim: true },
    city:         { type: String, trim: true },
    type:         { type: String, enum: ["طبي", "إسكان", "تعليم", "غذاء", "عمل", "أخرى"], default: "أخرى" },
    description:  { type: String, required: true },
    urgency:      { type: String, enum: ["normal", "urgent", "critical"], default: "normal" },
    status:       { type: String, enum: ["pending", "approved", "rejected", "on_hold"], default: "pending" },
    notes:        { type: String, default: "" },
    hasDocuments: { type: Boolean, default: false },
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
