const express = require("express");
const {
  createChatController,
  fetchChatController,
  createGroupChatController,
  renameGroupChatController,
  removeFromGroupChatController,
  addToGroupChatController,
  deleteGroupChatController,
} = require("../controllers/chatController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

//fetchChat || METHOD GET
router.get("/fetchChat", requireSignIn, fetchChatController);

//createChat || METHOD POST
router.post("/createChat", requireSignIn, createChatController);

//createGroupChat || METHOD POST
router.post("/createGroupChat", requireSignIn, createGroupChatController);

//removeFromGroupChat || METHOD PUT
router.put(
  "/removeFromGroupChat",
  requireSignIn,
  removeFromGroupChatController
);

//addToGroupChat || METHOD PUT
router.put("/addToGroupChat", requireSignIn, addToGroupChatController);

//renameGroupChat || METHOD PUT
router.put("/renameGroupChat", requireSignIn, renameGroupChatController);

//renameGroupChat || METHOD DELETE
router.delete("/deleteGroup/:chatId", requireSignIn, deleteGroupChatController);

module.exports = router;
