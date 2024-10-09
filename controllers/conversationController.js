// Database
const { validationResult } = require("express-validator");
const db = require("../config/database");

// Models
const Conversation = require("../models/conversationModel");
const ConversationParticipants = require("../models/conversationParticipatModel");
const User = require("../models/userModel");

// Utils
const createConversationResponse = require("../utils/coversationResponse");
const createResponse = require("../utils/response");
const statusMsg = require("../utils/statusMsg");

// Controller To Create a New Conversation
const createConversation = async (req, res) => {
  const { userIds, isGroup, name } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res
      .status(400)
      .json(createResponse(statusMsg.ERROR, errors.array()));

  // Return The Conversation if already exists
  const conversationIdsForUserOne = await ConversationParticipants.findByUserId(
    userIds[0]
  );
  const conversationIdsForUserTwo = await ConversationParticipants.findByUserId(
    userIds[1]
  );

  for (userOne of conversationIdsForUserOne) {
    for (userTwo of conversationIdsForUserTwo) {
      if (userOne.conversation_id === userTwo.conversation_id) {
        const result = await Conversation.findConversationById(
          userOne.conversation_id
        );
        return res
          .status(200)
          .json(
            createResponse(
              statusMsg.SUCCESS,
              "Conversation already exsits.",
              createConversationResponse(result, userIds)
            )
          );
      }
    }
  }
  // for (userIds)

  for (userId of userIds) {
    const existingUser = await User.findUserById(userId);

    if (!existingUser)
      return res
        .status(404)
        .json(
          createResponse(statusMsg.ERROR, [
            { msg: "User with the given id does not exist." },
          ])
        );
  }

  try {
    // Start transcation
    await db.query("BEGIN");

    // Create the conversation
    const conversation = await Conversation.create(name || null, isGroup);

    // Add participants to the conversation
    await ConversationParticipants.addParticipants(conversation.id, userIds);

    // Commit transcation
    await db.query("COMMIT");

    return res
      .status(201)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "Conversation created successfully.",
          createConversationResponse(conversation, userIds)
        )
      );
  } catch (error) {
    // Rollback transaction in case of an error
    await db.query("ROLLBACK");
    console.error(error);
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

// Controller To Get All Conversations Of a Specific User
const getUserConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.findByUserId(userId);

    return res
      .status(200)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "Conversation retrieved successfully.",
          conversations
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

// Controller To Get a Specific Conversation By ID
const getConversationById = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findConversationById(
      conversationId
    );

    if (!conversation)
      return res
        .status(404)
        .json(createResponse(statusMsg.FAIL, "Conversation not found"));

    return res
      .status(200)
      .json(
        createResponse(
          statusMsg.SUCCESS,
          "Conversation found successfully.",
          conversation
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
  getConversationById,
  getUserConversations,
  createConversation,
};
