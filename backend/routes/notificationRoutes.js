const express = require("express");
const router = express.Router();
const {
  getAll,
  markRead,
  markAllRead,
  deleteOne,
} = require("../controllers/notificationController");

router.get("/",              getAll);
router.patch("/read-all",    markAllRead);
router.patch("/:id/read",    markRead);
router.delete("/:id",        deleteOne);

module.exports = router;
