CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Altering Table
ALTER TABLE messages DROP CONSTRAINT 'name of constraint here';
ALTER TABLE 
  messages
ADD CONSTRAINT 
  msg_constraint 
FOREIGN KEY(sender_id) 
REFERENCES 
  users(id) 
ON DELETE 
  CASCADE 
ON UPDATE 
  CASCADE;
