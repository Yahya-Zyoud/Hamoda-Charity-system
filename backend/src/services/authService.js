const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_key", {
    expiresIn: "30d",
  });
};

class AuthService {
  async register(data) {
    const { name, email, password, phone } = data;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" };
    }

    const user = await User.create({ name, email, password, phone });
    return {
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      };
    }

    return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  }
}

module.exports = new AuthService();
