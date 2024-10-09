const pool = require("../config/database");

const createNotificationSchema = async () => {
  const createNotificationTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      sender_id INT REFERENCES users(id),
      conversation_id INT REFERENCES conversations(id),
      message VARCHAR(255) NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createNotificationTable);
    console.log("Notifications schema created successfully.");
  } catch (error) {
    console.error("Error creating notification schema:", error);
  }
};

module.exports = createNotificationSchema;
