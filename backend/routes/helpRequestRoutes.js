const express = require("express");
const router = express.Router();
const {
  createHelpRequest,
  getHelpRequests,
  getHelpRequestById,
  updateHelpRequest,
  deleteHelpRequest,
} = require("../controllers/helpRequestController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public: submit a help request
router.post("/", createHelpRequest);

// Admin only: view and manage
router.get("/",        protect, admin, getHelpRequests);
router.get("/:id",     protect, admin, getHelpRequestById);
router.put("/:id",     protect, admin, updateHelpRequest);
router.delete("/:id",  protect, admin, deleteHelpRequest);

module.exports = router;
