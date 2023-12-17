const express = require("express");
const {
  createNotificationController,
  getAllNotificationsController,
  removeNotificationController,
} = require("../controllers/notificationsController");

const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

//createNotification || METHOD POST
router.post("/createNotification", requireSignIn, createNotificationController);

//getAllNotifications || METHOD GET
router.get(
  "/getAllNotifications",
  requireSignIn,
  getAllNotificationsController
);

//removeNotification || METHOD DELTE
router.delete(
  "/removeNotification/:notificationId",
  requireSignIn,
  removeNotificationController
);

module.exports = router;
