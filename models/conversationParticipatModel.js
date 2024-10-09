const db = require("../config/database");

// Add participants to the conversation
const addParticipants = async (conversationId, userIds) => {
  try {
    // Start transcation
    await db.query("BEGIN");

    //  Add participants to the conversation
    for (let userid of userIds) {
      await db.query(
        `INSERT INTO 
          conversation_participants (user_id, conversation_id, added_at) 
        VALUES 
        ($1, $2, NOW());`,
        [userid, conversationId]
      );
    }

    //  Commit the transaction
    await db.query("COMMIT");
  } catch (error) {
    console.error("Error add participants: ", error);
    throw error;
  }
};

// Find participants by conversation id
const findByConversationId = async (conversationId) => {
  try {
    const result = await db.query(
      "SELECT * FROM conversation_participants WHERE conversation_id = $1",
      [conversationId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error find by conversation id: ", error);
    throw error;
  }
};

// Find participants by user id
const findByUserId = async (userId) => {
  try {
    const result = await db.query(
      "SELECT conversation_id FROM conversation_participants WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error find by user id: ", error);
    throw error;
  }
};

module.exports = {
  addParticipants,
  findByConversationId,
  findByUserId,
};
