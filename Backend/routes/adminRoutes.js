const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getUsers,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");


// Protected Routes (Sirf Token wale access kar sakte hain)
router.get("/dashboard", protect, getDashboard);
router.get("/users", protect, getUsers);

module.exports = router;