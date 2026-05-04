const Project = require("../models/Project");

// GET /api/projects
exports.getAll = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/stats
exports.getStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
exports.getOne = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "المشروع غير موجود" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects
exports.create = async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved   = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/projects/:id
exports.update = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "المشروع غير موجود" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
exports.remove = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "المشروع غير موجود" });
    res.json({ message: "تم حذف المشروع بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};