const { body, param } = require("express-validator");

const createConversationValidation = [
  body("userIds").notEmpty().withMessage("Ids of users are required."),
];

module.exports = createConversationValidation;
