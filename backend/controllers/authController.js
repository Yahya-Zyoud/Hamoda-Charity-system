const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { HTTP_STATUS } = require("../config/constants");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_key", {
    expiresIn: "30d",
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "البريد الإلكتروني مسجل مسبقاً" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "بيانات المستخدم غير صالحة" });
    }
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

exports.logoutUser = (req, res) => {
  res.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
};
