const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const resetPassword = require("../templates/resetPassword");
const { extractUsernameFromEmail } = require("../helpers/utils");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  sendEmailResetPassword: async (email, token) => {
    const name = extractUsernameFromEmail(email);
    const resetLink = `http://localhost:3000/resetPassword/${token}`;
    const ResetPasswordMessage = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset Your Password",
      html: resetPassword(name, resetLink),
    };

    return await transporter.sendMail(ResetPasswordMessage);
  },
};

// `
//       <p>To reset your password, click the link below:</p>
//       <p>The link is valid for only 15 minutes. after that you need to generate another link.</p>
//       <a href="http://localhost:3000/resetPassword/${token}">Reset Password</a>
//     `,
