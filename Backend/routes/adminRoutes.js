const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware"); // 👉 Admin check middleware import kiya

// --- All routes here are strictly Protected AND Admin-Only ---

// 1. Admin Dashboard Stats & Overview
router.get("/dashboard", protect, adminOnly, getDashboard);

// 2. Get All Registered Users List
router.get("/users", protect, adminOnly, getUsers);

// 3. Delete a User by ID
router.delete("/users/:id", protect, adminOnly, deleteUser);

// 4. Update a User's Role (e.g., make someone admin or user)
router.patch("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;