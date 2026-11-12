const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Token Generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 1. REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      if (!userExists.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.otp = otp;
        userExists.otpExpires = Date.now() + 10 * 60 * 1000;
        await userExists.save();

        const message = `<h2>Email Verification</h2><p>Your OTP code is:</p><h1 style="color: #4F46E5;">${otp}</h1>`;
        await sendEmail({ email: userExists.email, subject: 'Account Verification OTP', message });

        return res.status(200).json({ message: "User already exists but not verified. New OTP sent to email." });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Agar role explicitly bheja jaye (jaise admin banana ho), toh wo use ho warna default "user"
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      otp,
      otpExpires,
      isVerified: false,
    });

    const message = `
      <h2>Welcome to Our App!</h2>
      <p>Your OTP code for email verification is:</p>
      <h1 style="color: #4F46E5;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Account Verification OTP',
      message,
    });

    return res.status(201).json({
      message: "Registration successful! Please check your email for the OTP.",
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. VERIFY OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email with OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Forgot Password (Send OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `
      <h2>Password Reset Request</h2>
      <p>Your OTP code to reset password is:</p>
      <h1 style="color: #EF4444;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });

    return res.status(200).json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful! You can now login with your new password." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 6. Google Login
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "", 
        isVerified: true,
        role: "user" // Default role for social logins
      });
    }

    const jwtToken = generateToken(user._id, user.role);

    return res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  registerUser, 
  verifyOTP, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  googleLogin 
};