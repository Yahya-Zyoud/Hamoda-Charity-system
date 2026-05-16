const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    phone: String,
    role: { type: String, default: "متبرع" },
    city: String,
    bio: String,
    avatar: String,
    cover: String,
    joinDate: String,
    status:   { type: String, enum: ["active", "inactive"], default: "active" },
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

module.exports = mongoose.model("User", userSchema);
