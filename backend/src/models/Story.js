const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: String,
    image: String,
    author: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Story", storySchema);
