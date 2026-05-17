const express = require("express");
const router  = express.Router();
const { requireAdmin } = require("../middleware/auth");
const {
  createVolunteer,
  getAllVolunteers,
  updateVolunteerStatus,
} = require("../controllers/volunteerController");

router.post("/",           createVolunteer);
router.get("/",            requireAdmin, getAllVolunteers);
router.patch("/:id/status", requireAdmin, updateVolunteerStatus);

module.exports = router;
