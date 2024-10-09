const db = require("../config/database");

// Function To Create a Message
const create = async (senderId, conversationId, content) => {
  try {
    const result = await db.query(
      `INSERT INTO 
        messages (sender_id, conversation_id, content, created_at) 
      VALUES 
        ($1, $2, $3, NOW())
      RETURNING *;`,
      [senderId, conversationId, content]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error create message: ", error);
    throw error;
  }
};

// Function To Find All Message of Specific Conversation
const findByConversationId = async (conversationId) => {
  try {
    const result = await db.query(
      `
        SELECT * FROM messages WHERE conversation_id = $1;
      `,
      [conversationId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error find messages by conversation id: ", error);
    throw error;
  }
};

// Function To Get Message By Id
const findMessageById = async (messageId) => {
  try {
    const result = await db.query(
      `
        SELECT * FROM messages WHERE id = $1;
      `,
      [messageId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error find messages by conversation id: ", error);
    throw error;
  }
};

module.exports = {
  create,
  findMessageById,
  findByConversationId,
};
