const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { HTTP_STATUS } = require("../config/constants");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "غير مصرح لك بالوصول، لا يوجد توكن",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "التوكن غير صالح",
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: "غير مصرح لك بالوصول، صلاحيات مدير فقط",
    });
  }
};

module.exports = { protect, admin };
