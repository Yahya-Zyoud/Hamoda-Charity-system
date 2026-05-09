const express = require("express");
const router = express.Router();

const {
  getTeam,
  getMember,
  addMember,
  updateMember,
  deleteMember,
} = require("../controllers/teamController");

router.get("/", getTeam);
router.get("/:id", getMember);
router.post("/", addMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

module.exports = router;