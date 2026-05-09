const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    id: Number,
    title: { type: String, required: true },
    description: String,
    details: String,
    image: String,
    logoType: String,
    category: String,
    status: { type: String, enum: ["نشط", "مكتمل", "معلق"], default: "نشط" },
    goal: Number,
    raised: { type: Number, default: 0 },
    beneficiaries: Number,
    location: String,
    startDate: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        if (ret.id == null) ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Project", projectSchema);
