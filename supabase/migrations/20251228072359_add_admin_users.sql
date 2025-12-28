/*
  # Add Admin User Management

  ## Overview
  This migration adds admin user functionality to enable content management.

  ## New Tables
  - `admin_users` - Admin user accounts
    - `id` (uuid, primary key, references auth.users)
    - `email` (text, unique) - Admin email
    - `full_name` (text) - Admin's full name
    - `created_at` (timestamptz) - Account creation timestamp
    - `last_login` (timestamptz) - Last login timestamp

  ## Security
  - Enable RLS on admin_users table
  - Only admins can view admin users
  - Service role can insert/update admin users

  ## Important Notes
  - Admin users are separate from regular users
  - Admins have full access to create/edit/delete content
  - First admin must be created manually via SQL or Supabase dashboard
*/

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin users
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Policy: Admins can update their own last login
CREATE POLICY "Admins can update their own record"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for content management
-- Allow admins to insert tracks
DROP POLICY IF EXISTS "Artists can insert their own tracks" ON tracks;
CREATE POLICY "Admins can insert tracks"
  ON tracks FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Allow admins to update tracks
DROP POLICY IF EXISTS "Artists can update their own tracks" ON tracks;
CREATE POLICY "Admins can update tracks"
  ON tracks FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Allow admins to delete tracks
CREATE POLICY "Admins can delete tracks"
  ON tracks FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Allow admins to insert playlists
DROP POLICY IF EXISTS "Artists can create playlists" ON playlists;
CREATE POLICY "Admins can insert playlists"
  ON playlists FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Allow admins to update playlists
DROP POLICY IF EXISTS "Artists can update their own playlists" ON playlists;
CREATE POLICY "Admins can update playlists"
  ON playlists FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Allow admins to delete playlists
CREATE POLICY "Admins can delete playlists"
  ON playlists FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Allow admins to insert artists
CREATE POLICY "Admins can insert artists"
  ON artists FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Allow admins to update artists
DROP POLICY IF EXISTS "Artists can update their own profile" ON artists;
CREATE POLICY "Admins can update artists"
  ON artists FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Allow admins to delete artists
CREATE POLICY "Admins can delete artists"
  ON artists FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Allow admins to manage playlist_tracks
DROP POLICY IF EXISTS "Users can modify playlist tracks" ON playlist_tracks;
CREATE POLICY "Admins can insert playlist tracks"
  ON playlist_tracks FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete playlist tracks"
  ON playlist_tracks FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));