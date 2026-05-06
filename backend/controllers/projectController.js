const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const createApiError = (status, message) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};

// GET /api/projects
exports.getAll = asyncHandler(async (req, res) => {
  const { status, category, search } = req.query;
  const query = {};
  if (status   && status   !== "الكل") query.status   = status;
  if (category && category !== "الكل") query.category = category;
  if (search) {
    query.$or = [
      { title:       { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const projects = await Project.find(query).sort({ createdAt: -1 });
  res.json(projects);
});

// GET /api/projects/stats
exports.getStats = asyncHandler(async (req, res) => {
  const [total, active, done, agg] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "نشط" }),
    Project.countDocuments({ status: "مكتمل" }),
    Project.aggregate([
      { $group: { _id: null, totalBeneficiaries: { $sum: "$beneficiaries" } } },
    ]),
  ]);

  res.json({
    total,
    active,
    done,
    beneficiaries: agg[0]?.totalBeneficiaries || 0,
  });
});

// GET /api/projects/:id
exports.getOne = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw createApiError(404, "المشروع غير موجود");
  res.json(project);
});

// POST /api/projects
exports.create = asyncHandler(async (req, res) => {
  const project = new Project(req.body);
  const saved   = await project.save();
  res.status(201).json(saved);
});

// PUT /api/projects/:id
exports.update = asyncHandler(async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw createApiError(404, "المشروع غير موجود");
  res.json(updated);
});

// DELETE /api/projects/:id
exports.remove = asyncHandler(async (req, res) => {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) throw createApiError(404, "المشروع غير موجود");
  res.json({ message: "تم حذف المشروع بنجاح" });
});