const adminOnly = (req, res, next) => {
  // Kyunke 'protect' middleware pehle hi req.user attach kar chuka hota hai, 
  // hum easily check kar sakte hain ke user ka role admin hai ya nahi.
  if (req.user && req.user.role === 'admin') {
    next(); // Agar admin hai toh agay jane do
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { adminOnly };