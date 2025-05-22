/*
  # Add event registration fields

  1. Changes
    - Add price field to events table
    - Add zoom_webinar_id field to events table
    - Create registrations table for tracking event signups

  2. Security
    - Enable RLS on registrations table
    - Add policies for authenticated users to manage registrations
    - Add policy for users to read their own registrations
*/

-- Add new fields to events table
ALTER TABLE events 
ADD COLUMN price numeric(10,2) DEFAULT 0.00,
ADD COLUMN zoom_webinar_id text,
ADD COLUMN max_participants integer DEFAULT NULL;

-- Create registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_id text,
  zoom_registrant_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create registrations"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON event_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);