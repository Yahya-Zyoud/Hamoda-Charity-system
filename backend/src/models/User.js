const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, sparse: true, unique: true }, // allow optional clerkId
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // for normal register
    phone: String,
    role: { type: String, default: "متبرع", enum: ["متبرع", "admin"] },
    city: String,
    bio: String,
    avatar: String,
    cover: String,
    joinDate: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password; // hide password
        return ret;
      },
    },
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
