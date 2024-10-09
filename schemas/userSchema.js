const pool = require("../config/database");

const createUserSchema = async () => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      profile_picture VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createUserTable);
    console.log("User schema created successfully.");
  } catch (error) {
    console.error("Error creating user schema:", error);
  }
};

module.exports = createUserSchema;
