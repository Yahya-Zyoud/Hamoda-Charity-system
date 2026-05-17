// Mongoose model for manually-managed statistic cards shown on the public site
const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    icon:     { type: String, required: true },
    value:    { type: Number, required: true },
    suffix:   { type: String, default: "+" },
    label:    { type: String, required: true, trim: true },
    sublabel: { type: String, default: "" },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stat", statSchema);
