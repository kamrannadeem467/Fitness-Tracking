const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      // 👉 Yeh line check karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log("Middleware Error: User not found in DB for ID:", decoded.id);
        return res.status(401).json({ message: "User not found with this token" });
      }
      
      return next();
    }
    
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    // 👉 Yeh terminal par exact error print karega (e.g. Invalid Signature ya Malformed)
    console.error("JWT Verification Failed Details:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
  }
};

module.exports = { protect };