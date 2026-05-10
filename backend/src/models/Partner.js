const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: String,
    url: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Partner", partnerSchema);
