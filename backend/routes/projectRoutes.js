// Project routes — GET endpoints are public; POST/PUT/DELETE are admin-only
const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  getProjectStats,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { requireAdmin } = require("../middleware/auth");

// Public reads
router.get("/",        getProjects);
router.get("/stats",   getProjectStats);
router.get("/:id",     getProjectById);

// Admin mutations
router.post("/",       requireAdmin, createProject);
router.put("/:id",     requireAdmin, updateProject);
router.delete("/:id",  requireAdmin, deleteProject);

module.exports = router;
