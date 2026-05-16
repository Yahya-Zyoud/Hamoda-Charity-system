const mongoose = require("mongoose");
const idTransform = require("./_idTransform");

const teamSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    title:       { type: String, required: true, trim: true },
    role:        { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    email:       { type: String, default: "", trim: true },
    phone:       { type: String, default: "", trim: true },
    initials:    { type: String, default: "" },
    image:       { type: String, default: null },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true, ...idTransform }
);

module.exports = mongoose.model("Team", teamSchema);
