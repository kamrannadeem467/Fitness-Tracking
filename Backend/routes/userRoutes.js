const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getUserProfile, updateUserProfile, changePassword } = require("../controllers/userController");

// Profile Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("avatar"), updateUserProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;