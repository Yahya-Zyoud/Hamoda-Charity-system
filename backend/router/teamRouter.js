const express = require("express");
const router = express.Router();

const {
  getTeam,
  addMember,
  deleteMember,
} = require("../controllers/teamController"); // ✅ التصحيح هنا

router.get("/", getTeam);
router.post("/", addMember);
router.delete("/:id", deleteMember);

module.exports = router;