const db = require("../config/database");

// Create a new Conversation
const create = async (name, isGroup) => {
  try {
    const result = await db.query(
      `INSERT INTO 
        conversations (name, is_group, created_at) 
      VALUES ($1, $2, NOW()) 
      RETURNING *`,
      [name, isGroup]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error create conversation: ", error);
    throw error;
  }
};

// Find All Conversations For a Specific User
const findByUserId = async (userId) => {
  try {
    const result = await db.query(
      `
      SELECT c.*
      FROM conversations c
      JOIN conversation_participants cp ON
        c.id = cp.conversation_id
      WHERE cp.user_id = $1
      `,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error find conversation by user: ", error);
    throw error;
  }
};

// Fetch a conversation by id
const findConversationById = async (conversationId) => {
  try {
    const result = await db.query(
      `
      SELECT 
        c.id, 
        c.name, 
        c.is_group, 
        c.created_at, 
        COALESCE(array_agg(cp.user_id), '{}') AS members
      FROM conversations c
      LEFT JOIN conversation_participants cp 
        ON c.id = cp.conversation_id
      WHERE c.id = $1
      GROUP BY c.id
      `,
      [conversationId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error find conversation by id: ", error);
    throw error;
  }
};

// // Find a Conversation With The Same UserIds
// const findConversationWithUserIds = async (userOne, userTwo) => {
//   try {
//     const result = await db.query(
//       `
//       SELECT * FROM conversations WHERE
//       `
//     )
//   } catch (error) {

//   }
// }

module.exports = {
  create,
  findConversationById,
  findByUserId,
};
