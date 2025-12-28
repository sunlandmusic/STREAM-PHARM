import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { decode } from 'base64-arraybuffer';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const uploadAudioFile = async (
  fileUri: string,
  fileName: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    let fileData: ArrayBuffer;

    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      fileData = await response.arrayBuffer();
    } else {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      fileData = decode(base64);
    }

    const uniqueFileName = `${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(uniqueFileName, fileData, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from('audio-files')
      .getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Upload exception:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
};

export const uploadImage = async (
  fileUri: string,
  fileName: string,
  bucket: 'cover-art' | 'profile-images'
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    let fileData: ArrayBuffer;

    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      fileData = await response.arrayBuffer();
    } else {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      fileData = decode(base64);
    }

    const uniqueFileName = `${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, fileData, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });

    if (error) {
      console.error('Image upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Image upload exception:', error);
    return { success: false, error: error.message || 'Image upload failed' };
  }
};

export const getAudioDuration = async (fileUri: string): Promise<number> => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      const audio = new Audio(fileUri);
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.floor(audio.duration));
      });
      audio.addEventListener('error', () => {
        resolve(180);
      });
    } else {
      resolve(180);
    }
  });
};

export const createOrGetArtist = async (artistName: string): Promise<{ id: string } | null> => {
  const { data: existingArtist } = await supabase
    .from('artists')
    .select('id')
    .eq('name', artistName)
    .maybeSingle();

  if (existingArtist) {
    return existingArtist;
  }

  const { data: newArtist, error } = await supabase
    .from('artists')
    .insert({ name: artistName })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating artist:', error);
    return null;
  }

  return newArtist;
};

export const createTrack = async (trackData: {
  title: string;
  artistId: string;
  album: string;
  duration: number;
  fileUrl: string;
  coverImageUrl: string;
  genre: string;
}): Promise<{ success: boolean; trackId?: string; error?: string }> => {
  const { data, error } = await supabase
    .from('tracks')
    .insert({
      title: trackData.title,
      artist_id: trackData.artistId,
      album: trackData.album,
      duration: trackData.duration,
      file_url: trackData.fileUrl,
      cover_image_url: trackData.coverImageUrl,
      genre: trackData.genre,
      release_date: new Date().toISOString().split('T')[0],
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating track:', error);
    return { success: false, error: error.message };
  }

  return { success: true, trackId: data.id };
};

export const createPlaylist = async (playlistData: {
  title: string;
  description: string;
  coverImage: string;
  artistId: string;
  category: string;
  isFeatured: boolean;
  trackIds: string[];
}): Promise<{ success: boolean; playlistId?: string; error?: string }> => {
  const { data: playlist, error: playlistError } = await supabase
    .from('playlists')
    .insert({
      title: playlistData.title,
      description: playlistData.description,
      cover_image: playlistData.coverImage,
      artist_id: playlistData.artistId,
      category: playlistData.category,
      is_featured: playlistData.isFeatured,
    })
    .select('id')
    .single();

  if (playlistError) {
    console.error('Error creating playlist:', playlistError);
    return { success: false, error: playlistError.message };
  }

  if (playlistData.trackIds.length > 0) {
    const playlistTracks = playlistData.trackIds.map((trackId, index) => ({
      playlist_id: playlist.id,
      track_id: trackId,
      position: index + 1,
    }));

    const { error: tracksError } = await supabase
      .from('playlist_tracks')
      .insert(playlistTracks);

    if (tracksError) {
      console.error('Error adding tracks to playlist:', tracksError);
    }
  }

  return { success: true, playlistId: playlist.id };
};

export const getAllArtists = async () => {
  const { data, error } = await supabase
    .from('artists')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching artists:', error);
    return [];
  }

  return data;
};

export const getAllTracks = async () => {
  const { data, error } = await supabase
    .from('tracks')
    .select(`
      id,
      title,
      duration,
      genre,
      plays_count,
      artist:artists(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }

  return data;
};

export const getAllPlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists')
    .select(`
      id,
      title,
      category,
      is_featured,
      play_count,
      artist:artists(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }

  return data;
};

export const deleteTrack = async (trackId: string): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('tracks')
    .delete()
    .eq('id', trackId);

  if (error) {
    console.error('Error deleting track:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const deletePlaylist = async (playlistId: string): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', playlistId);

  if (error) {
    console.error('Error deleting playlist:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};
