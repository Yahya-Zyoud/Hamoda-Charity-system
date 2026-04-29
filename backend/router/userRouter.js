const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, "../public/uploads");
        if (!require("fs").existsSync(dest)) {
            require("fs").mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.post("/upload", upload.single("image"), userController.uploadImage);

module.exports = router;
