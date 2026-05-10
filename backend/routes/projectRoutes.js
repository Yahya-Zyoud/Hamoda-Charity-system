const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.get("/",        getProjects);
router.get("/:id",     getProjectById);
router.post("/",       protect, admin, createProject);
router.put("/:id",     protect, admin, updateProject);
router.delete("/:id",  protect, admin, deleteProject);

module.exports = router;
