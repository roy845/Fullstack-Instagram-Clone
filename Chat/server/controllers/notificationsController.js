const Notification = require("../models/NotificationModel");
const asyncHandler = require("express-async-handler");

const createNotificationController = asyncHandler(async (req, res) => {
  const { data } = req.body;

  if (!data.sender || !data.content || !data.chat) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const notification = new Notification(data);

  const savedNotification = await notification.save();

  // Populate the fields 'sender', 'chat', and the 'users' array inside 'chat'
  await savedNotification.populate([
    { path: "sender", select: "-password" },
    {
      path: "chat",
      populate: {
        path: "users",
        select: "-password", // Assuming you also want to exclude passwords from the users
      },
    },
  ]);

  res.status(201).json(savedNotification);
});
const getAllNotificationsController = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("sender", "-password")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "-password",
        },
      });

    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
});
const removeNotificationController = asyncHandler(async (req, res) => {
  try {
    const { notificationId } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
});

module.exports = {
  createNotificationController,
  getAllNotificationsController,
  removeNotificationController,
};
