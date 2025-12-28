-- Seed Sample Data for Sunland Music
--
-- This migration adds sample data for testing the application
-- Including artists, tracks, playlists, and playlist-track relationships
--
-- Note: This uses placeholder URLs for audio files and images
-- Replace these with actual uploaded files later

-- Insert sample artists
INSERT INTO artists (id, name, bio, profile_image, total_blessings, total_plays)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'SUNLAND MUSIC', 'Curated playlists and original music from Sunland', '', 0, 0),
  ('22222222-2222-2222-2222-222222222222', 'HAKSMUSIC', 'Producer and curator of diverse soundscapes', '', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tracks (Note: file_url should point to actual files in Supabase Storage)
INSERT INTO tracks (id, title, artist_id, album, duration, file_url, cover_image_url, genre, is_premium)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Sunset Dreams', '11111111-1111-1111-1111-111111111111', 'Evening Vibes', 240, 'placeholder/track1.mp3', '', 'Chill', false),
  ('22222222-2222-2222-2222-222222222222', 'Golden Hour', '11111111-1111-1111-1111-111111111111', 'Evening Vibes', 195, 'placeholder/track2.mp3', '', 'Chill', false),
  ('33333333-3333-3333-3333-333333333333', 'Midnight Flow', '22222222-2222-2222-2222-222222222222', 'WIZ FOLDER', 210, 'placeholder/track3.mp3', '', 'Beats', false),
  ('44444444-4444-4444-4444-444444444444', 'Urban Pulse', '22222222-2222-2222-2222-222222222222', 'WIZ FOLDER', 185, 'placeholder/track4.mp3', '', 'Beats', false),
  ('55555555-5555-5555-5555-555555555555', 'Afro Nights', '11111111-1111-1111-1111-111111111111', 'AFRO SEPT 2024', 220, 'placeholder/track5.mp3', '', 'Afrobeats', false),
  ('66666666-6666-6666-6666-666666666666', 'Lagos Vibes', '11111111-1111-1111-1111-111111111111', 'AFRO SEPT 2024', 200, 'placeholder/track6.mp3', '', 'Afrobeats', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample playlists
INSERT INTO playlists (id, title, description, cover_image, artist_id, category, is_featured)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'WIZ FOLDER', 'A collection of wizard-level beats and tracks', '', '22222222-2222-2222-2222-222222222222', 'Beats', true),
  ('22222222-2222-2222-2222-222222222222', 'VIBES', 'Smooth vibes and atmospheric sounds', '', '11111111-1111-1111-1111-111111111111', 'Chill', true),
  ('33333333-3333-3333-3333-333333333333', 'AFRO SEPT 2024', 'The best Afrobeats tracks from September 2024', '', '11111111-1111-1111-1111-111111111111', 'Afrobeats', true),
  ('44444444-4444-4444-4444-444444444444', 'MORE MUSIC', 'A diverse collection of tracks for every mood', '', '11111111-1111-1111-1111-111111111111', 'Mix', true)
ON CONFLICT (id) DO NOTHING;

-- Insert playlist-track relationships
INSERT INTO playlist_tracks (playlist_id, track_id, position)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 1),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 2),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 1),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 2),
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 1),
  ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 2),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 1),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 2),
  ('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 3)
ON CONFLICT (playlist_id, track_id) DO NOTHING;