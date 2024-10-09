const { body } = require("express-validator");

const createMessageValidation = [
  body("senderId").notEmpty().withMessage("Sender id is required."),
  body("conversationId").notEmpty().withMessage("Conversation id is required."),
  body("content").notEmpty().withMessage("Content is required."),
];

module.exports = createMessageValidation;
