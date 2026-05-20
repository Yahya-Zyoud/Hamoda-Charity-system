const mongoose = require("mongoose");
const idTransform = require("./_idTransform");

const volunteerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true,
                match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"] },
    phone:    { type: String, required: true, trim: true },
    city:     { type: String, default: "", trim: true },
    skills:   { type: String, default: "", trim: true },
    availability: { type: String, default: "", trim: true },
    note:     { type: String, default: "", trim: true },
    status:   { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true, ...idTransform }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
