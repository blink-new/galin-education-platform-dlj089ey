/*
  # Add team members table

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `image_url` (text)
      - `degrees` (text[])
      - `bio` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `team_members` table
    - Add policies for public read access
    - Add policies for authenticated users to manage team members
*/

CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  image_url text NOT NULL,
  degrees text[] NOT NULL DEFAULT '{}',
  bio text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to team_members"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage team_members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);