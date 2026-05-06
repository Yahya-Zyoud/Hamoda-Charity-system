const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/projectController");

// ترتيب مهم: /stats قبل /:id
router.get   ("/stats", controller.getStats);
router.get   ("/",      controller.getAll);
router.get   ("/:id",   controller.getOne);
router.post  ("/",      controller.create);
router.put   ("/:id",   controller.update);
router.delete("/:id",   controller.remove);

module.exports = router;