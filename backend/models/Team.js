const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    title:       { type: String, required: true, trim: true },
    role:        {
      type: String,
      enum: ["إدارة", "موظف", "دكتور", "متطوع", "سيكيورتي"],
      required: true,
      trim: true,
    },
    description: { type: String, default: "", trim: true },
    email:       { type: String, default: "", trim: true },
    phone:       { type: String, default: "", trim: true },
    initials:    { type: String, default: "" },
    image:       { type: String, default: null },
    order:       { type: Number, default: 0 },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
