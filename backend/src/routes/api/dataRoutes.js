const express = require("express");
const router = express.Router();

const { getData, createData, updateData, deleteData } = require("../../controllers/dataController");
const { protect, admin } = require("../../middleware/authMiddleware");

const types = ["projects", "services", "stats", "partners", "stories"];

types.forEach((type) => {
  router.get(`/${type}`, getData(type));
  router.get(`/${type}/:id`, async (req, res, next) => {
    try {
      const result = await require("../../services/dataService").getById(type, req.params.id);
      if (!result.success) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: result.data });
    } catch (err) { next(err); }
  });
  router.post(`/${type}`, protect, admin, createData(type));
  router.put(`/${type}/:id`, protect, admin, updateData(type));
  router.delete(`/${type}/:id`, protect, admin, deleteData(type));
});

module.exports = router;
