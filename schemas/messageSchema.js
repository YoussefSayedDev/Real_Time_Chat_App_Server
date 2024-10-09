const pool = require("../config/database");

const createMessageSchema = async () => {
  const createMessageTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INT REFERENCES users(id),
      conversation_id INT REFERENCES conversations(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createMessageTable);
    console.log("Message schema created successfully.");
  } catch (error) {
    console.error("Error creating message schema:", error);
  }
};

module.exports = createMessageSchema;
