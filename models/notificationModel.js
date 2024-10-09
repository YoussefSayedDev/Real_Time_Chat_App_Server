const db = require("../config/database");

// Function To Create a Notification
const create = async (userId, senderId, conversationId, message) => {
  try {
    const result = await db.query(
      `INSERT INTO 
        notifications (user_id, sender_id, conversation_id, message, created_at) 
      VALUES 
        ($1, $2, $3, $4, NOW())
      RETURNING *`,
      [userId, senderId, conversationId, message]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error create notification: ", error);
    throw error;
  }
};

// Function To Mark Notification As Read
const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await db.query(
      `UPDATE 
        notifications 
      SET
        is_read = true
      WHERE
        id = $1;
      `,
      [notificationId]
    );
    const result = await db.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error mark notification as read: ", error);
    throw error;
  }
};

// Function To Mark All Notifications As Read Using User Id
const markAllAsRead = async (userId) => {
  try {
    const result = await db.query(
      `UPDATE 
        notifications 
      SET
        is_read = true
      WHERE 
        user_id = $1
      RETURNING *
      `,
      [userId]
    );

    const res = await db.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );

    return res.rows;
  } catch (error) {
    console.error("Error mark all notifications as read: ", error);
    throw error;
  }
};

// Function To Mark All Notifications As Read Using Conversation Id
const markAllChatAsRead = async (conversationId) => {
  try {
    const result = await db.query(
      `UPDATE 
        notifications 
      SET
        is_read = true
      WHERE 
        conversation_id = $1
      RETURNING *
      `,
      [conversationId]
    );

    const res = await db.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );

    return res.rows;
  } catch (error) {
    console.error("Error mark all chat notifications as read: ", error);
    throw error;
  }
};

// Function To Find Notification By Id
const findNotificationById = async (notificationId) => {
  try {
    const result = await db.query(
      `SELECT
        *
      FROM
        notifications
      WHERE
        id = $1`,
      [notificationId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error find notification by id: ", error);
    throw error;
  }
};

// Function To Find Notification By User Id
const findByUserId = async (userId) => {
  try {
    const result = await db.query(
      `SELECT
        *
      FROM
        notifications
      WHERE
        user_id = $1
      ORDER BY
        created_at
      DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error find notification by user id: ", error);
    throw error;
  }
};

// Function To Romove All Notifications User
const removeAllNotificationByUserId = async (userId) => {
  try {
    const result = await db.query(
      `Delete
      FROM
        notifications
      WHERE
        user_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error remove all notification by user id: ", error);
    throw error;
  }
};

// Function To Romove Notification Using Notification Id
const removeNotificationById = async (notificationId) => {
  try {
    const result = await db.query(
      `Delete
      FROM
        notifications
      WHERE
        id = $1`,
      [notificationId]
    );
    const res = await db.query("SELECT * FROM notifications;");
    return res.rows;
  } catch (error) {
    console.error("Error remove notification by notification id: ", error);
    throw error;
  }
};

module.exports = {
  create,
  markNotificationAsRead,
  markAllAsRead,
  findNotificationById,
  findByUserId,
  markAllChatAsRead,
  removeAllNotificationByUserId,
  removeNotificationById,
};
