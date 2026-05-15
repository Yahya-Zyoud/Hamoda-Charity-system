// models/Donation.js
// ─────────────────────────────────────────────────────────────────────────────
// Mongoose schema and model for a single donation document.
// This defines the shape of every donation record stored in MongoDB.
//
// A "schema" is just a blueprint — it describes what fields the document
// has, what type each field is, and any rules (required, min, etc.).
// A "model" is the class you use to create/read/update/delete documents.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

// Define the shape of a donation document in MongoDB
const donationSchema = new mongoose.Schema(
  {
    // What kind of donation is this?
    donationType: {
      type: String,
      required: [true, 'نوع التبرع مطلوب'],           // Arabic error message
      enum: ['صدقة', 'زكاة', 'إغاثة', 'إسكان', 'علاج', 'تعليم'],
    },

    // How much is the donation (in USD)?
    amount: {
      type: Number,
      required: [true, 'المبلغ مطلوب'],
      min: [1, 'المبلغ يجب أن يكون أكبر من صفر'],
    },

    // Donor personal info
    donorName: {
      type: String,
      required: [true, 'اسم المتبرع مطلوب'],
      trim: true,                                       // remove extra whitespace
    },

    donorEmail: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      trim: true,
      lowercase: true,                                  // always store as lowercase
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'البريد الإلكتروني غير صحيح'],
    },

    donorPhone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true,
    },

    donorCity: {
      type: String,
      trim: true,
      default: '',                                      // optional field
    },

    // Which payment method was used?
    paymentMethod: {
      type: String,
      required: [true, 'طريقة الدفع مطلوبة'],
      enum: ['stripe', 'paypal', 'cash'],
    },

    // Status of the donation (can be updated later by admin)
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create the model from the schema
// "Donation" → MongoDB collection will be named "donations" (auto-pluralized)
const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
