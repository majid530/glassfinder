/*
  # Recreate Glass/Screen Protector Compatibility Tables

  1. New Tables
    - `compatibility_groups`
      - `id` (serial, primary key)
      - `name` (text) - descriptive name for the group
      - `created_at` (timestamp)
    - `phone_models`
      - `id` (serial, primary key)
      - `model_name` (text) - phone model name
      - `group_id` (integer, foreign key) - reference to compatibility group
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for all users (search compatibility)
    - No write access needed (data is static)

  3. Data
    - Group 1: Poco X3, A21s, Note 11 Pro
    - Group 2: A15, A26, A17
    - Group 3: A12, A13
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS phone_models CASCADE;
DROP TABLE IF EXISTS compatibility_groups CASCADE;

-- Create compatibility_groups table
CREATE TABLE compatibility_groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create phone_models table
CREATE TABLE phone_models (
  id SERIAL PRIMARY KEY,
  model_name TEXT NOT NULL UNIQUE,
  group_id INTEGER NOT NULL REFERENCES compatibility_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE compatibility_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_models ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view compatibility groups"
  ON compatibility_groups FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view phone models"
  ON phone_models FOR SELECT
  TO public
  USING (true);

-- Insert compatibility groups
INSERT INTO compatibility_groups (id, name) VALUES
  (1, 'Group 1 - Universal Fit'),
  (2, 'Group 2 - Samsung A Series Compatible'),
  (3, 'Group 3 - Samsung A Series Compatible');

-- Insert phone models for each group
-- Group 1: Poco X3, A21s, Note 11 Pro
INSERT INTO phone_models (model_name, group_id) VALUES
  ('Poco X3', 1),
  ('A21s', 1),
  ('Note 11 Pro', 1);

-- Group 2: A15, A26, A17
INSERT INTO phone_models (model_name, group_id) VALUES
  ('A15', 2),
  ('A26', 2),
  ('A17', 2);

-- Group 3: A12, A13
INSERT INTO phone_models (model_name, group_id) VALUES
  ('A12', 3),
  ('A13', 3);

-- Create index for faster searches
CREATE INDEX idx_phone_models_model_name ON phone_models (LOWER(model_name));
