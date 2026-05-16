const mongoose = require("mongoose");
const idTransform = require("./_idTransform");

const storySchema = new mongoose.Schema(
  {
    category:         { type: String, required: true, trim: true },
    title:            { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    tag:              { type: String, default: null },
    date:             { type: Date, required: true },
  },
  { timestamps: true, ...idTransform }
);

module.exports = mongoose.model("Story", storySchema);
