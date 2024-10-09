CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255), -- Only used for group chats
  is_group BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- joined_at
);