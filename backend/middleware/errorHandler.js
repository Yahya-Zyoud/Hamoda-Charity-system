module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "حدث خطأ في الخادم",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
