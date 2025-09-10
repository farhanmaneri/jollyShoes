// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  purpose: { type: String, enum: ["signup", "login", "forgot_password", "order_verification"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Otp", otpSchema);
