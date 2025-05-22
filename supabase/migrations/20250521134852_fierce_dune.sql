/*
  # Blog System Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `preview` (text, required)
      - `image_url` (text, required)
      - `author_id` (uuid, references authors)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
    
    - `blog_authors`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `role` (text, required)
      - `avatar_url` (text, required)
      - `created_at` (timestamp with timezone)

    - `blog_tags`
      - `id` (uuid, primary key)
      - `name` (text, required, unique)
      - `created_at` (timestamp with timezone)

    - `blog_posts_tags` (junction table)
      - `post_id` (uuid, references blog_posts)
      - `tag_id` (uuid, references blog_tags)
      - Primary key is (post_id, tag_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
*/

-- Create blog_authors table
CREATE TABLE blog_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  avatar_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_tags table
CREATE TABLE blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  preview text NOT NULL,
  image_url text NOT NULL,
  author_id uuid REFERENCES blog_authors(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for posts and tags
CREATE TABLE blog_posts_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Enable RLS
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to blog_authors"
  ON blog_authors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage blog_authors"
  ON blog_authors
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to blog_tags"
  ON blog_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage blog_tags"
  ON blog_tags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to blog_posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage blog_posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to blog_posts_tags"
  ON blog_posts_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage blog_posts_tags"
  ON blog_posts_tags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);