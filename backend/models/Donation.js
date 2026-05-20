const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Hamza's core fields
    donationType: {
      type: String,
      required: [true, "Donation type is required"],
      enum: ["sadaqah", "zakat", "relief", "housing", "medical", "education"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than zero"],
    },
    donorName: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true,
    },
    donorEmail: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    donorPhone: {
      type: String,
      trim: true,
      default: "",
    },
    donorCity: {
      type: String,
      trim: true,
      default: "",
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["stripe", "paypal", "cash"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    // Stripe-specific (only set for Stripe payments)
    note:            { type: String, default: "" },
    userId:          { type: String, default: "" },
    stripeSessionId: { type: String, default: null },
    projectId:       { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    currency:        { type: String, default: "USD" },
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
