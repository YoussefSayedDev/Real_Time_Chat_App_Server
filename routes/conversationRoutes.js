const express = require("express");
const router = express.Router();

// The Controllers
const {
  createConversation,
  getConversationById,
} = require("../controllers/conversationController");
const { getConversationMessages } = require("../controllers/messageController");
// The Validations
const createConversationValidation = require("../validations/conversationValidation");

// Route to create a new conversation
router.post("/", createConversationValidation, createConversation);

// Get Specific Conversation Route
router.get("/:conversationId", getConversationById);

// Route to get messages of specific conversation
router.get("/:conversationId/messages", getConversationMessages);

module.exports = router;
