const Team = require("../models/Team");

// GET
const getTeam = async (req, res) => {
  try {
    const members = await Team.find({ active: true })
      .select("-__v -createdAt -updatedAt")
      .sort({ role: 1, order: 1 });

    res.json(members);
  } catch (err) {
    res.status(500).json({
      message: "خطأ في جلب بيانات الفريق",
      error: err.message,
    });
  }
};

// POST
const addMember = async (req, res) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({
      message: "خطأ في إضافة العضو",
      error: err.message,
    });
  }
};

// DELETE
const deleteMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "تم الحذف" });
  } catch (err) {
    res.status(500).json({
      message: "خطأ في الحذف",
      error: err.message,
    });
  }
};

module.exports = { getTeam, addMember, deleteMember };