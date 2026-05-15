const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    num:   { type: String, required: true },
    name:  { type: String, required: true, trim: true },
    desc:  { type: String, required: true, trim: true },
    icon:  { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
