const express = require("express");
const router = express.Router();
const {
  getAll,
  markRead,
  markAllRead,
  deleteOne,
} = require("../controllers/notificationController");
const { requireAdmin } = require("../middleware/auth");

router.get("/",              requireAdmin, getAll);
router.patch("/read-all",    requireAdmin, markAllRead);
router.patch("/:id/read",    requireAdmin, markRead);
router.delete("/:id",        requireAdmin, deleteOne);

module.exports = router;
