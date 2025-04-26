-- database schema for DebtMate

-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Friends Table
CREATE TABLE IF NOT EXISTS friends (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  UNIQUE(user_id, friend_id)
);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group Members Table
CREATE TABLE IF NOT EXISTS group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  added_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

-- insert sample users
INSERT INTO users (name, username, email, password)
VALUES 
  ('John Doe', 'johndoe', 'john@example.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm'),
  ('Jane Smith', 'janesmith', 'jane@example.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm'),
  ('Neo Boy', 'neoboy', 'neoboy@n.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm'),
  ('Ncode Boy 1', 'ncodeboy1', 'ncodeboy1@n.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm'),
  ('Ncode Boy 2', 'ncodeboy2', 'ncodeboy2@n.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm'),
  ('Ncode Boy 3', 'ncodeboy3', 'ncodeboy3@n.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm'),
  ('Ncode Boy 4', 'ncodeboy4', 'ncodeboy4@n.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm'),
  ('Ncode Boy 5', 'ncodeboy5', 'ncodeboy5@n.com', '$2b$10$rNCLHS5.vI0iSVYD3rUo0eJd3vn1o3XF8UXVMcMqjB9d9SQGcXxLm')
ON CONFLICT (username) DO NOTHING;