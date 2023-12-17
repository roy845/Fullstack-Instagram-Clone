const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const mongoose = require("mongoose");
const Message = require("../models/MessageModel");

const createChatController = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send("UserId param not sent with request");
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };

    try {
      const createdChat = await new Chat(chatData).save();

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
});
const fetchChatController = asyncHandler(async (req, res) => {
  try {
    const { checked } = req.query;
    const currentUser = await User.findById(req.user.id);
    const blockedUsersList = currentUser?.blockedUsers;
    let chats;
    console.log(checked);
    if (checked === "true") {
      chats = await Chat.find({
        $and: [
          { users: req.user.id },
          { users: { $nin: blockedUsersList } },
          { users: { $ne: [] } },
        ],
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .limit(20);
    } else {
      chats = await Chat.find({
        $and: [
          { users: req.user.id },
          { users: { $nin: blockedUsersList } },
          { users: { $ne: [] } },
        ],
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
    }

    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});
const createGroupChatController = asyncHandler(async (req, res) => {
  const { name, users } = req.body;

  if (!name || !users) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user.id);

  try {
    const groupChat = await new Chat({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    }).save();

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});
const renameGroupChatController = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(400).send("Group is probably deleted");
  } else {
    res.json(updatedChat);
  }
});
const addToGroupChatController = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    return res.status(404).send("Chat not found");
  } else {
    res.json(added);
  }
});
const removeFromGroupChatController = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).send("Chat not found");
  }

  if (chat.groupAdmin.toString() === userId) {
    chat.users = chat.users.filter((user) => user.toString() !== userId);

    if (chat.users.length > 0) {
      const randomIndex = Math.floor(Math.random() * chat.users.length);
      chat.groupAdmin = chat.users[randomIndex];
    } else {
      chat.groupAdmin = null;
    }
  } else {
    chat.users = chat.users.filter((user) => user.toString() !== userId);
  }

  const updatedChat = await chat.save();

  const populatedChat = await Chat.populate(updatedChat, [
    { path: "users", select: "-password" },
    { path: "groupAdmin", select: "-password" },
  ]);

  res.json(populatedChat);
});
const deleteGroupChatController = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.params;

    const chatGroup = await Chat.findById(chatId);

    if (!chatGroup) {
      return res.status(404).send({ error: "Chat group not found" });
    }

    if (chatGroup.groupAdmin.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .send({ error: "You are not authorized to delete this group chat" });
    }

    await Chat.deleteOne({ _id: chatGroup._id });

    await Message.deleteMany({ chat: chatGroup._id });

    res.send({
      message: "Chat group and associated messages deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = {
  createChatController,
  fetchChatController,
  renameGroupChatController,
  createGroupChatController,
  removeFromGroupChatController,
  addToGroupChatController,
  deleteGroupChatController,
};
