const User = require("../models/UserModel");
const generateToken = require("../helpers/generateToken");
const asyncHandler = require("express-async-handler");
const {
  hashPassword,
  comparePassword,
  generateResetPasswordToken,
} = require("../helpers/authHelper");
const { sendEmailResetPassword } = require("../services/mailer");

const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Please Enter all the fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).send("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await new User({
    name,
    email,
    password: hashedPassword,
    profilePic,
  }).save();

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic:
        user.profilePic ||
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      token: generateToken(user._id),
    });
  } else {
    return res.res.status(400).send("Failed to create a user");
  }
});
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("User not found");
  }

  const match = await comparePassword(password, user?.password);

  if (user && match) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
      createdAt: new Date(user.createdAt),
    });
  } else {
    res.status(400).send("Unauthorized");
  }
});

const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "User not found" });
  } else {
    const token = generateResetPasswordToken();

    const passwordResetTokenDetails = {
      email,
      token,
      expiresAt: new Date(Date.now() + 900000),
    };

    user.resetTokenDetails = passwordResetTokenDetails;

    await user.save();

    try {
      await sendEmailResetPassword(email, token);
      res.json({ message: "Reset Link sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending email" });
    }
  }
});

const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    "resetTokenDetails.token": token,
    "resetTokenDetails.expiresAt": { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({ message: "Invalid or expired token" });
  } else {
    const hashedPassword = await hashPassword(password);

    const updatedUser = await User.updateOne(
      { _id: user._id },
      { password: hashedPassword }
    );

    user.resetTokenDetails = {};
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  }
});

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
};
