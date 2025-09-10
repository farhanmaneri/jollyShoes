// controllers/otpController.js
const express = require("express")
const Otp = require("../models/otp")
const { sendVerificationEamil, sendOrderOTPEmail } = require("../middlewares/Email");

const sendOtp = async (req, res) => {
  try {
    const { email, purpose, name, totalAmount, itemCount } = req.body;

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB
    await Otp.create({
      email,
      code,
      purpose,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Try to send email, but don't fail if email is not configured
    try {
      if (purpose === "order_verification") {
        // Use order OTP email template
        await sendOrderOTPEmail(email, name, code, totalAmount, itemCount);
      } else {
        // Use regular verification email template
        await sendVerificationEamil(email, code);
      }
    } catch (emailError) {
      // console.log("Email sending failed, but OTP is still generated:", emailError.message);
    }

    res.status(200).json({ 
      success: true, 
      message: "OTP sent",
      code: code, // Return the OTP code for testing purposes
      otp: code   // Also return as 'otp' for compatibility
    });
  } catch (error) {
    // console.error("Error in sendOtp:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send OTP",
      error: error.message 
    });
  }
};
module.exports = sendOtp;
