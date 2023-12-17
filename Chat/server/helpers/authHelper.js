const bcrypt = require("bcrypt");
const crypto = require("crypto");

const hashPassword = async (password) => {
  try {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateResetPasswordToken = () => crypto.randomBytes(20).toString("hex");

module.exports = { comparePassword, hashPassword, generateResetPasswordToken };
