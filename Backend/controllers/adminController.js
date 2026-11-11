// Protected Controllers (Only for Logged-In Users)
const getDashboard = (req, res) => {
  res.status(200).json({
    message: "Welcome to Dashboard",
    userId: req.user.id,
  });
};

const getUsers = (req, res) => {
  res.status(200).json({
    message: "Access granted: Displaying user management list",
  });
};

module.exports = {
  getDashboard,
  getUsers,
};