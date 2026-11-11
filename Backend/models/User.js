const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otp: { type: String },               // 6-digit OTP store karne ke liye
    otpExpires: { type: Date },          // OTP ki expiry time (e.g., 10 minutes)
    isVerified: { type: Boolean, default: false }, // Jab tak verify na ho, false rahega
    avatar: { type: String, default: "" }, // Profile image path/URL
    bio: { type: String, default: "" },    // Optional bio/description
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);