const { body } = require("express-validator");

const createNotificationValidation = [
  body("senderId").notEmpty().withMessage("Sender id is required."),
  body("conversationId").notEmpty().withMessage("Conversation id is required."),
  body("message").notEmpty().withMessage("Message is required."),
];

module.exports = createNotificationValidation;
