// sendEmail.js
const transporter = require("../emailConfig");

async function sendEmail({ subject, text, userEmail }) {
  try {
    const mailOptions = {
      from: "farhanmaneri@gmail.com",
      to: userEmail,
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    // console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
