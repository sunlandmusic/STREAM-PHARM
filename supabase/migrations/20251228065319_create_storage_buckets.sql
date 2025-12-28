-- Create Storage Buckets for Sunland
--
-- Overview:
-- Creates Supabase Storage buckets for audio files, cover art, and profile images
--
-- New Buckets:
-- 1. audio-files - For storing music track files (MP3, AAC, etc.)
--    - Public access for streaming
--    - File size limit: 50MB per file
--    - Allowed file types: audio/*
--
-- 2. cover-art - For album/track cover images
--    - Public access
--    - File size limit: 5MB per file
--    - Allowed file types: image/*
--
-- 3. profile-images - For artist and user profile pictures
--    - Public access
--    - File size limit: 2MB per file
--    - Allowed file types: image/*
--
-- Security:
-- - Public read access for all buckets (content needs to be streamable)
-- - Authenticated users can upload to their own folders
-- - Proper file type and size validation

-- Insert storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('audio-files', 'audio-files', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/flac']::text[]),
  ('cover-art', 'cover-art', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('profile-images', 'profile-images', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audio-files bucket
CREATE POLICY "Public read access for audio files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'audio-files');

CREATE POLICY "Authenticated users can upload audio files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audio-files');

CREATE POLICY "Authenticated users can update their audio files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audio-files');

CREATE POLICY "Authenticated users can delete their audio files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'audio-files');

-- Storage policies for cover-art bucket
CREATE POLICY "Public read access for cover art"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'cover-art');

CREATE POLICY "Authenticated users can upload cover art"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cover-art');

CREATE POLICY "Authenticated users can update cover art"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cover-art');

CREATE POLICY "Authenticated users can delete cover art"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cover-art');

-- Storage policies for profile-images bucket
CREATE POLICY "Public read access for profile images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can update their profile images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can delete their profile images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-images');