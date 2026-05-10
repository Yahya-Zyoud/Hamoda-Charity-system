const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    icon: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stat", statSchema);
