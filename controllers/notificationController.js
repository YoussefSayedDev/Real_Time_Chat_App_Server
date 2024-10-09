const { validationResult } = require("express-validator");
const createResponse = require("../utils/response");
const statusMsg = require("../utils/statusMsg");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");

// Controller To Create a New Notification
const createNotification = async (req, res) => {
  const { userId, senderId, conversationId, message } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json(createResponse(statusMsg.FAIL, errors.array()));

  const existingUser = await User.findUserById(userId);

  if (!existingUser)
    return res
      .status(404)
      .json(
        createResponse(statusMsg.ERROR, [
          { msg: "User with the given id does not exist." },
        ])
      );

  try {
    const existingSender = await User.findUserById(senderId);

    if (!existingSender)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "Sender with the given id does not exist." },
          ])
        );

    const existingConversation = await Conversation.findConversationById(
      conversationId
    );

    if (!existingConversation)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "Conversation with the given id does not exist." },
          ])
        );

    const notification = await Notification.create(
      userId,
      senderId,
      conversationId,
      message
    );

    return res
      .status(201)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "Notification created successfully.",
          { notification }
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Controller To Mark A Notification As Read
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const existingNotification = await Notification.findNotificationById(id);

    if (!existingNotification)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "Notification with the given id does not exist." },
          ])
        );

    const markNotification = await Notification.markNotificationAsRead(id);

    return res.status(200).json(
      createResponse(
        statusMsg.SUCCESS,
        "Notification mark as read successfully.",
        {
          markNotification,
        }
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Controller To Mark All Notification As Read
const markAllNotificationAsRead = async (req, res) => {
  const { userId } = req.params;
  try {
    const existingUser = await User.findUserById(userId);

    if (!existingUser)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "User with the given id does not exist." },
          ])
        );

    const markNotifications = await Notification.markAllAsRead(userId);

    return res.status(200).json(
      createResponse(
        statusMsg.SUCCESS,
        "All notifications mark as read successfully.",
        {
          markNotifications,
        }
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Controller To Mark All Notification As Read
const markAllChatNotificationAsRead = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const existingConversation = await Conversation.findConversationById(
      conversationId
    );

    if (!existingConversation)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "Conversation with the given id does not exist." },
          ])
        );

    const markNotifications = await Notification.markAllChatAsRead(
      conversationId
    );

    return res.status(200).json(
      createResponse(
        statusMsg.SUCCESS,
        "All notifications mark as read successfully.",
        {
          markNotifications,
        }
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Controller To Get All Notification Of a Specific User
const getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const existingUser = await User.findUserById(userId);

    if (!existingUser)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "User with the given id does not exist." },
          ])
        );

    const notifications = await Notification.findByUserId(userId);

    return res
      .status(200)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "Notifications retrieved successfully.",
          notifications
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Controller To Remove All Notification Of a Specific User
const removeUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const existingUser = await User.findUserById(userId);

    if (!existingUser)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "User with the given id does not exist." },
          ])
        );

    const notifications = await Notification.removeAllNotificationByUserId(
      userId
    );

    return res
      .status(200)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "All notifications deleted successfully.",
          notifications
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

// Controller To Remove Notification By Id
const removeNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const existingNotification = await Notification.findNotificationById(id);

    if (!existingNotification)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "Notification with the given id does not exist." },
          ])
        );

    const notifications = await Notification.removeNotificationById(id);

    return res
      .status(200)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "Notifications deleted successfully.",
          notifications
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          statusMsg.ERROR,
          `Internal server error: ${error.message}`
        )
      );
  }
};

module.exports = {
  createNotification,
  markNotificationAsRead,
  markAllNotificationAsRead,
  getUserNotifications,
  markAllChatNotificationAsRead,
  removeUserNotifications,
  removeNotification,
};
