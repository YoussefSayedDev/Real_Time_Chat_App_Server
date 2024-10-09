const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");
const createResponse = require("../utils/response");
const statusMsg = require("../utils/statusMsg");
const { validationResult } = require("express-validator");

// Controller To Create a New Message
const createMessage = async (req, res) => {
  const { senderId, conversationId, content } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json(createResponse(statusMsg.FAIL, errors.array()));

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

    const message = await Message.create(senderId, conversationId, content);

    return res.status(201).json(
      createResponse(statusMsg.SUCCESS, "Message created successfully.", {
        message,
      })
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

// Controller To Get All Messages Of a Specific Convesation
const getConversationMessages = async (req, res) => {
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

    const messages = await Message.findByConversationId(conversationId);

    return res.status(200).json(
      createResponse(statusMsg.SUCCESS, "Messages found successfully.", {
        messages,
      })
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
  createMessage,
  getConversationMessages,
};
