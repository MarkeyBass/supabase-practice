-- Database Schema for Supabase Query Language Teaching
-- This schema will be automatically created when you run the Express server
-- You can also run this manually in Supabase Studio SQL Editor
--
-- NOTE: Make sure Supabase is running (run 'supabase start') before starting the server
-- The database 'blog_db' is specified in your .env file (DB_NAME) and is automatically
-- created by Supabase. The connection pool connects directly to this database.

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (email, name, age, status) VALUES
  ('john@example.com', 'John Doe', 28, 'active'),
  ('jane@example.com', 'Jane Smith', 32, 'active'),
  ('bob@example.com', 'Bob Johnson', 45, 'inactive'),
  ('alice@example.com', 'Alice Williams', 24, 'active'),
  ('charlie@example.com', 'Charlie Brown', 38, 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (user_id, title, content, published, views) VALUES
  (1, 'Introduction to PostgreSQL', 'PostgreSQL is a powerful database...', true, 150),
  (1, 'Advanced SQL Techniques', 'In this post we explore...', true, 89),
  (2, 'Getting Started with Node.js', 'Node.js is a runtime...', true, 234),
  (2, 'Draft Post', 'This is not published yet...', false, 0),
  (4, 'Web Development Tips', 'Here are some tips...', true, 167),
  (5, 'Database Design Patterns', 'Good database design...', true, 203)
ON CONFLICT DO NOTHING;

INSERT INTO comments (post_id, user_id, content) VALUES
  (1, 2, 'Great introduction!'),
  (1, 4, 'Very helpful, thanks!'),
  (3, 1, 'Love this tutorial'),
  (3, 5, 'Clear and concise'),
  (5, 1, 'Nice tips!'),
  (6, 2, 'Excellent patterns')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) - Disabled for teaching purposes
-- In production, you would create proper RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (for teaching purposes)
-- In production, you would create proper policies
DROP POLICY IF EXISTS "Allow all on users" ON users;
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on posts" ON posts;
CREATE POLICY "Allow all on posts" ON posts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on comments" ON comments;
CREATE POLICY "Allow all on comments" ON comments FOR ALL USING (true);

