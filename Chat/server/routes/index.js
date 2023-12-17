const express = require("express");
const authRoutes = require("./authRoutes");
const usersRoutes = require("./usersRoutes");
const chatRoutes = require("./chatRoutes");
const messagesRoutes = require("./messagesRoutes");
const notificationsRoutes = require("./notificationsRoutes");
const filesRoutes = require("./filesRoutes");

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/users", usersRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/messages", messagesRoutes);
router.use("/api/notifications", notificationsRoutes);
router.use("/api/files", filesRoutes);

module.exports = router;
