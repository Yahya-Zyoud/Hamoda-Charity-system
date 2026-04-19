const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.subscribe = (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "البريد الإلكتروني غير صالح",
    });
  }

  console.log(`[Newsletter] New subscriber: ${email.trim()}`);

  res.json({
    success: true,
    message: "تم الاشتراك بنجاح! شكراً لاهتمامك.",
  });
};
