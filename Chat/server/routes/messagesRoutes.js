const express = require("express");
const {
  sendMessageController,
  getAllMessagesController,
} = require("../controllers/messagesController");

const { requireSignIn } = require("../middlewares/authMiddleware");
const { upload } = require("../services/upload");

const router = express.Router();

//sendMessage || METHOD POST
router.post(
  "/sendMessage",
  requireSignIn,
  upload.single("file"),
  sendMessageController
);

//getMessages || METHOD GET
router.get("/getAllMessages/:chatId", requireSignIn, getAllMessagesController);

module.exports = router;
