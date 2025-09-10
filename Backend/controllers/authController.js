const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // ✅ add this
const Users = require("../models/user");
const { sendEmail } = require("./sendEmail");

let requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("Incoming reset request for:", email);

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // ✅ use frontend URL for the link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // console.log("Generated reset link:", resetLink);

    await sendEmail({
      subject: "Password Reset Request",
      text: `Click this link to reset your password: ${resetLink}`,
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}" target="_blank">${resetLink}</a>`,
      userEmail: user.email,
    });

    return res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    // console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ error: error.toString() });
  }
};

let resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    // console.error("Error in resetPassword:", error);
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
