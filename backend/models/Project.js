const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان المشروع مطلوب"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "وصف المشروع مطلوب"],
    },
    category: {
      type: String,
      enum: ["صحة", "تعليم", "إغاثة", "بنية تحتية", "دعم نفسي", "أخرى"],
      default: "أخرى",
    },
    status: {
      type: String,
      enum: ["جاري", "مكتمل", "قيد التخطيط"],
      default: "قيد التخطيط",
    },
    goal: {
      type: Number,
      required: true,
      min: 0,
    },
    raised: {
      type: Number,
      default: 0,
      min: 0,
    },
    beneficiaries: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    tags: [String],
    manager: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// حساب نسبة الإنجاز
projectSchema.virtual("progress").get(function () {
  if (!this.goal || this.goal === 0) return 0;
  return Math.min(Math.round((this.raised / this.goal) * 100), 100);
});

projectSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Project", projectSchema);