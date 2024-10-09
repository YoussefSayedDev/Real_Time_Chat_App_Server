const pool = require("../config/database");

const CreateConversationSechema = async () => {
  const createConversationTable = `
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      is_group BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createConversationTable);
    console.log("Conversation schema created successfully.");
  } catch (error) {
    console.error("Error creating conversation schema:", error);
  }
};

const CreateConversationParticipantsSchema = async () => {
  const createConversationParticipantsTable = `
    CREATE TABLE IF NOT EXISTS conversation_participants (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createConversationParticipantsTable);
    console.log("Conversation participants schema created successfully.");
  } catch (error) {
    console.error("Error creating conversation participants schema:", error);
  }
};

module.exports = {
  CreateConversationSechema,
  CreateConversationParticipantsSchema,
};
