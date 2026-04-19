const fs = require("fs");
const path = require("path");

let userProfile = {
    name: "محمد أحمد الخالدي",
    role: "متبرع بلاتيني",
    email: "mohammed@example.com",
    phone: "0599 123 456",
    city: "رام الله",
    bio: "عضو متفاعل وداعم للمبادرات الخيرية منذ عام 2024. أؤمن بأن العطاء هو جوهر الحياة.",
    avatar: "",
    cover: "",
    joinDate: "يناير 2024"
};

exports.getProfile = (req, res) => {
    res.json({ success: true, data: userProfile });
};

exports.updateProfile = (req, res) => {
    userProfile = { ...userProfile, ...req.body };
    res.json({ success: true, data: userProfile });
};

exports.uploadImage = (req, res) => {

    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
};
