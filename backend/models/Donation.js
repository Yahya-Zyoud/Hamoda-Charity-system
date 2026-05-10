const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor:       { type: String, required: true, trim: true },
    email:       { type: String, trim: true, lowercase: true },
    phone:       { type: String, trim: true },
    amount:      { type: Number, required: true, min: 1 },
    currency:    { type: String, default: "USD" },
    project:     { type: String, trim: true },          // project title (display)
    projectId:   { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // ref (optional)
    method:      { type: String, default: "بطاقة ائتمان", enum: ["بطاقة ائتمان", "تحويل بنكي", "PayPal", "نقدي"] },
    status:      { type: String, default: "completed", enum: ["pending", "completed", "failed"] },
    note:        { type: String, default: "" },
    anonymous:   { type: Boolean, default: false },
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
