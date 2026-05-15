const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    userId:     String,
    donor:      { type: String, default: "" },
    email:      { type: String, default: "" },
    projectId:  { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    amount:     { type: Number, required: true },
    currency:   { type: String, default: "USD" },
    status:          { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    method:          String,
    note:            String,
    stripeSessionId: { type: String, default: null },
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

module.exports = mongoose.model("Donation", donationSchema);
