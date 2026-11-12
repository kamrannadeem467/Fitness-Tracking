const User = require("../models/User");

// @desc    Get admin dashboard overview
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // 👉 Check karein ke admin khud ko toh delete nahi kar raha
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "Security Error: You cannot delete your own admin account!" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body; // "admin" ya "user"

    // 👉 Security Check: Admin khud apna role change nahi kar sakta!
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "Security Error: You cannot change your own role!" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role || user.role;
    await user.save();

    res.status(200).json({ success: true, message: `User role updated to ${user.role}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  deleteUser,
  updateUserRole,
};