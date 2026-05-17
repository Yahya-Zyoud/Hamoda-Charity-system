// Mongoose model for charity partner/sponsor organisations displayed on the site
const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    logo:  { type: String, default: null },
    emoji: { type: String, default: "" },
    color: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
