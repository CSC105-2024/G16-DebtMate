-- Drop tables if they exist
DROP TABLE IF EXISTS users;

-- Create users table only
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,

  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add a test user (password is 'password' - for testing only)
INSERT INTO users (username, email, password) 
VALUES ('testuser', 'test','test@example.com', '$2b$10$LRCEOqH7JJsUCYvaZ/7yUu1.BTrIlpgHVUrDtnuQJ4OciO64tq4uK');

