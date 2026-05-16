const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Hamza's core fields
    donationType: {
      type: String,
      required: [true, "نوع التبرع مطلوب"],
      enum: ["صدقة", "زكاة", "إغاثة", "إسكان", "علاج", "تعليم", "تبرع مشروع"],
    },
    amount: {
      type: Number,
      required: [true, "المبلغ مطلوب"],
      min: [1, "المبلغ يجب أن يكون أكبر من صفر"],
    },
    donorName: {
      type: String,
      required: [true, "اسم المتبرع مطلوب"],
      trim: true,
    },
    donorEmail: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "البريد الإلكتروني غير صحيح"],
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
      required: [true, "طريقة الدفع مطلوبة"],
      enum: ["stripe", "paypal", "cash"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
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
