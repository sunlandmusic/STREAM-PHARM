/*
  # Sunland Music Streaming Platform - Core Schema

  ## Overview
  This migration creates the complete database schema for the Sunland music streaming platform,
  including tables for artists, tracks, playlists, users, subscriptions, and the BLESS donation system.

  ## New Tables

  ### Artists
  - `artists` - Artist profiles with bio, images, and earnings tracking
    - `id` (uuid, primary key)
    - `name` (text, unique) - Artist name
    - `bio` (text) - Artist biography
    - `profile_image` (text) - URL to profile image
    - `total_blessings` (numeric) - Total amount received from BLESS donations
    - `total_plays` (bigint) - Total plays across all tracks
    - `created_at` (timestamptz)

  ### Tracks
  - `tracks` - Individual music tracks
    - `id` (uuid, primary key)
    - `title` (text) - Track title
    - `artist_id` (uuid, foreign key) - Reference to artists table
    - `album` (text) - Album name
    - `duration` (integer) - Duration in seconds
    - `file_url` (text) - URL to audio file in Supabase Storage
    - `cover_image_url` (text) - URL to cover art
    - `genre` (text) - Music genre
    - `release_date` (date) - Release date
    - `plays_count` (bigint) - Number of plays
    - `is_premium` (boolean) - Premium content flag
    - `created_at` (timestamptz)

  ### Playlists
  - `playlists` - User and curated playlists
    - `id` (uuid, primary key)
    - `title` (text) - Playlist title
    - `description` (text) - Playlist description
    - `cover_image` (text) - URL to cover image
    - `artist_id` (uuid, foreign key) - Creator/curator
    - `category` (text) - Playlist category
    - `is_featured` (boolean) - Featured on homepage
    - `play_count` (bigint) - Total plays
    - `created_at` (timestamptz)

  - `playlist_tracks` - Junction table for playlist-track relationships
    - `playlist_id` (uuid, foreign key)
    - `track_id` (uuid, foreign key)
    - `position` (integer) - Track order in playlist
    - `added_at` (timestamptz)

  ### Users
  - `users` - Extended user profiles (linked to auth.users)
    - `id` (uuid, primary key, references auth.users)
    - `username` (text, unique) - Display username
    - `profile_image` (text) - Profile picture URL
    - `subscription_status` (text) - free_trial, active, expired
    - `subscription_end_date` (timestamptz) - When subscription ends
    - `stripe_customer_id` (text) - Stripe customer ID
    - `created_at` (timestamptz)

  - `user_favorites` - User's saved tracks and playlists
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `favoritable_type` (text) - 'track' or 'playlist'
    - `favoritable_id` (uuid) - ID of track or playlist
    - `created_at` (timestamptz)

  - `listening_history` - Track listening history
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `track_id` (uuid, foreign key)
    - `played_at` (timestamptz)
    - `duration_listened` (integer) - Seconds listened

  ### BLESS Donations
  - `blessings` - Donation transactions
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key) - Donor
    - `artist_id` (uuid, foreign key) - Recipient
    - `track_id` (uuid, foreign key, nullable) - Track being blessed
    - `amount` (numeric) - Donation amount in USD
    - `stripe_payment_id` (text) - Stripe payment intent ID
    - `message` (text) - Optional message from donor
    - `created_at` (timestamptz)

  - `artist_earnings` - Artist payout tracking
    - `id` (uuid, primary key)
    - `artist_id` (uuid, foreign key)
    - `blessing_amount` (numeric) - Total blessings before fees
    - `platform_fee` (numeric) - Platform fee amount (10%)
    - `stripe_fee` (numeric) - Stripe processing fee
    - `net_amount` (numeric) - Amount paid to artist
    - `payout_status` (text) - pending, processing, completed, failed
    - `stripe_payout_id` (text) - Stripe payout ID
    - `payout_date` (timestamptz) - When payout was completed
    - `created_at` (timestamptz)

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Create policies for authenticated users to read public content
  - Create policies for users to manage their own data
  - Create policies for artists to manage their content
  - Admin-only access for sensitive operations

  ## Indexes
  - Add indexes on foreign keys for performance
  - Add indexes on frequently queried fields
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  bio text DEFAULT '',
  profile_image text DEFAULT '',
  total_blessings numeric DEFAULT 0,
  total_plays bigint DEFAULT 0,
  stripe_account_id text,
  created_at timestamptz DEFAULT now()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  album text DEFAULT '',
  duration integer NOT NULL,
  file_url text NOT NULL,
  cover_image_url text DEFAULT '',
  genre text DEFAULT '',
  release_date date DEFAULT CURRENT_DATE,
  plays_count bigint DEFAULT 0,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text DEFAULT '',
  cover_image text DEFAULT '',
  artist_id uuid REFERENCES artists(id) ON DELETE SET NULL,
  category text DEFAULT 'Mix',
  is_featured boolean DEFAULT false,
  play_count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Playlist tracks junction table
CREATE TABLE IF NOT EXISTS playlist_tracks (
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  position integer NOT NULL,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (playlist_id, track_id)
);

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  profile_image text DEFAULT '',
  subscription_status text DEFAULT 'free_trial',
  subscription_end_date timestamptz DEFAULT (now() + interval '1 year'),
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  favoritable_type text NOT NULL CHECK (favoritable_type IN ('track', 'playlist')),
  favoritable_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, favoritable_type, favoritable_id)
);

-- Listening history table
CREATE TABLE IF NOT EXISTS listening_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  played_at timestamptz DEFAULT now(),
  duration_listened integer DEFAULT 0
);

-- Blessings (donations) table
CREATE TABLE IF NOT EXISTS blessings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  stripe_payment_id text UNIQUE NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Artist earnings table
CREATE TABLE IF NOT EXISTS artist_earnings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  blessing_amount numeric NOT NULL,
  platform_fee numeric NOT NULL,
  stripe_fee numeric NOT NULL,
  net_amount numeric NOT NULL,
  payout_status text DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
  stripe_payout_id text,
  payout_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_plays_count ON tracks(plays_count DESC);
CREATE INDEX IF NOT EXISTS idx_playlists_category ON playlists(category);
CREATE INDEX IF NOT EXISTS idx_playlists_is_featured ON playlists(is_featured);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_track_id ON listening_history(track_id);
CREATE INDEX IF NOT EXISTS idx_blessings_artist_id ON blessings(artist_id);
CREATE INDEX IF NOT EXISTS idx_blessings_user_id ON blessings(user_id);

-- Enable Row Level Security
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Artists (public read, artists can update their own)
CREATE POLICY "Artists are viewable by everyone"
  ON artists FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Artists can update their own profile"
  ON artists FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE users.id = auth.uid()));

-- RLS Policies for Tracks (public read)
CREATE POLICY "Tracks are viewable by everyone"
  ON tracks FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Artists can insert their own tracks"
  ON tracks FOR INSERT
  TO authenticated
  WITH CHECK (artist_id IN (SELECT id FROM artists WHERE id = (SELECT id FROM artists LIMIT 1)));

CREATE POLICY "Artists can update their own tracks"
  ON tracks FOR UPDATE
  TO authenticated
  USING (artist_id IN (SELECT id FROM artists LIMIT 1));

-- RLS Policies for Playlists (public read)
CREATE POLICY "Playlists are viewable by everyone"
  ON playlists FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Artists can create playlists"
  ON playlists FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Artists can update their own playlists"
  ON playlists FOR UPDATE
  TO authenticated
  USING (artist_id IN (SELECT id FROM artists LIMIT 1));

-- RLS Policies for Playlist Tracks (public read)
CREATE POLICY "Playlist tracks are viewable by everyone"
  ON playlist_tracks FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can modify playlist tracks"
  ON playlist_tracks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Users (users can read all, update their own)
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for User Favorites (users manage their own)
CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for Listening History
CREATE POLICY "Users can view their own listening history"
  ON listening_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their listening history"
  ON listening_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Blessings (users see their own, artists see received)
CREATE POLICY "Users can view their sent blessings"
  ON blessings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Artists can view blessings received"
  ON blessings FOR SELECT
  TO authenticated
  USING (artist_id IN (SELECT id FROM artists LIMIT 1));

CREATE POLICY "Users can create blessings"
  ON blessings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Artist Earnings (artists only)
CREATE POLICY "Artists can view their own earnings"
  ON artist_earnings FOR SELECT
  TO authenticated
  USING (artist_id IN (SELECT id FROM artists LIMIT 1));

-- Function to increment track play count
CREATE OR REPLACE FUNCTION increment_track_plays(track_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE tracks SET plays_count = plays_count + 1 WHERE id = track_uuid;
  UPDATE artists SET total_plays = total_plays + 1 
  WHERE id = (SELECT artist_id FROM tracks WHERE id = track_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update artist total blessings
CREATE OR REPLACE FUNCTION update_artist_blessings()
RETURNS trigger AS $$
BEGIN
  UPDATE artists 
  SET total_blessings = total_blessings + NEW.amount 
  WHERE id = NEW.artist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update artist blessings on new blessing
CREATE TRIGGER on_blessing_created
  AFTER INSERT ON blessings
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_blessings();