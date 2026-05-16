const mongoose = require("mongoose");
const idTransform = require("./_idTransform");

const statSchema = new mongoose.Schema(
  {
    icon:     { type: String, required: true },
    value:    { type: Number, required: true },
    suffix:   { type: String, default: "+" },
    label:    { type: String, required: true, trim: true },
    sublabel: { type: String, default: "" },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true, ...idTransform }
);

module.exports = mongoose.model("Stat", statSchema);
