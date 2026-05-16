const mongoose = require("mongoose");
const idTransform = require("./_idTransform");

const partnerSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    logo:  { type: String, default: null },
    emoji: { type: String, default: "" },
    color: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, ...idTransform }
);

module.exports = mongoose.model("Partner", partnerSchema);
