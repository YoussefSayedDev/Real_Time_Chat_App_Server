const express = require("express");

// The Controllers
const { createConversation } = require("../controllers/conversationController");
const {
  createNotification,
  markNotificationAsRead,
  markAllNotificationAsRead,
  markAllChatNotificationAsRead,
  removeNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// Route to create a new notification
router.post("/", createNotification, createConversation);

// Route to mark all notifications as read using user id
router.post("/:userId/user/markall", markAllNotificationAsRead);

// Route to mark all notifications as read using conversation id
router.post("/:conversationId/chat/markall", markAllChatNotificationAsRead);

// Route to mark notification as read
router.post("/:id", markNotificationAsRead);

// Route to delete notification
router.delete("/:id", removeNotification);

module.exports = router;
