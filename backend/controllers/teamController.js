const Team = require("../models/Team");
const asyncHandler = require("../utils/asyncHandler");

const createApiError = (status, message) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};

// GET /api/team
const getTeam = asyncHandler(async (req, res) => {
  const members = await Team.find({ active: true })
    .select("-__v -createdAt -updatedAt")
    .sort({ role: 1, order: 1 });

  res.json(members);
});

// GET /api/team/:id
const getMember = asyncHandler(async (req, res) => {
  const member = await Team.findById(req.params.id);
  if (!member) throw createApiError(404, "العضو غير موجود");
  res.json(member);
});

// POST /api/team
const addMember = asyncHandler(async (req, res) => {
  const member = await Team.create(req.body);
  res.status(201).json(member);
});

// PUT /api/team/:id
const updateMember = asyncHandler(async (req, res) => {
  const updated = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw createApiError(404, "العضو غير موجود");
  res.json(updated);
});

// DELETE /api/team/:id
const deleteMember = asyncHandler(async (req, res) => {
  const deleted = await Team.findByIdAndDelete(req.params.id);
  if (!deleted) throw createApiError(404, "العضو غير موجود");
  res.json({ message: "تم حذف العضو بنجاح" });
});

module.exports = { getTeam, getMember, addMember, updateMember, deleteMember };