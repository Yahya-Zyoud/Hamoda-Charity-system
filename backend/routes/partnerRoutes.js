const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getPartners, getPartnerById, createPartner, updatePartner, deletePartner } = require("../controllers/partnerController");

router.get("/", getPartners);
router.get("/:id", getPartnerById);
router.post("/", protect, admin, createPartner);
router.put("/:id", protect, admin, updatePartner);
router.delete("/:id", protect, admin, deletePartner);

module.exports = router;
