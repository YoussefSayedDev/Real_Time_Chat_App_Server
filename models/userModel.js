require("dotenv").config();
const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a New User
const createUser = async (name, email, password, profile_picture) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      `INSERT INTO 
        users (name, email, password, profile_picture) 
      VALUES 
        ($1, $2, $3, $4) 
      RETURNING *`,
      [name, email, hashedPassword, profile_picture]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error register user: ", error);
    throw error;
  }
};

// Find a User by Email
const findUserByEmail = async (email) => {
  try {
    const result = await db.query(
      `SELECT 
        *
      FROM 
        users 
      WHERE 
        email = $1`,
      [email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user by email: ", error);
    throw error;
  }
};

// Find a User by Id
const findUserById = async (id) => {
  try {
    const result = await db.query(
      `SELECT 
        id, name, email, profile_picture 
      FROM 
        users 
      WHERE 
        id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user by id: ", error);
    throw error;
  }
};

const findAllUsers = async () => {
  try {
    const result = await db.query(
      "SELECT id, name, email, profile_picture FROM users"
    );
    return result.rows;
  } catch (error) {
    console.error("Error finding user by id: ", error);
    throw error;
  }
};

// Update User Image
const updateImage = async (image, userId) => {
  try {
    const result = await db.query(
      `
      UPDATE 
        users
      SET 
        profile_picture = $1
      WHERE
        id = $2
      RETURNING *
      `,
      [image, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user image: ", error);
    throw error;
  }
};

// Generate a JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findAllUsers,
  updateImage,
  generateToken,
};
