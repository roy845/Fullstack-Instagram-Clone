const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/authController");

const router = express.Router();

//REGISTER || METHOD POST
router.post("/register", registerController);
//LOGIN || POST
router.post("/login", loginController);
//FORGOT PASSWORD || POST
router.post("/forgotPassword", forgotPasswordController);
//RESET PASSWORD || POST
router.post("/resetPassword", resetPasswordController);

module.exports = router;
