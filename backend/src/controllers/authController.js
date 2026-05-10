const authService = require("../services/authService");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: result.message });
    }
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    if (!result.success) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: result.message });
    }
    return res.status(HTTP_STATUS.OK).json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, message: "تم تسجيل الخروج بنجاح" });
};

module.exports = {
  register,
  login,
  logout,
};
