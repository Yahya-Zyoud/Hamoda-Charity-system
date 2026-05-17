// Team routes — GET endpoints are public; POST/PUT/DELETE are admin-only
const express = require("express");
const router = express.Router();
const {
  getTeam,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");
const { requireAdmin } = require("../middleware/auth");

// Public reads
router.get("/",      getTeam);
router.get("/:id",   getTeamMember);

// Admin mutations
router.post("/",     requireAdmin, createTeamMember);
router.put("/:id",   requireAdmin, updateTeamMember);
router.delete("/:id", requireAdmin, deleteTeamMember);

module.exports = router;
