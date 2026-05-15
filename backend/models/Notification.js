const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type:      { type: String, enum: ["request", "donation", "system"], default: "system" },
    msg:       { type: String, required: true, trim: true },
    read:      { type: Boolean, default: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
