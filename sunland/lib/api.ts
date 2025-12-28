import { supabase } from './supabase';
import { Artist, Track, Playlist } from '@/types';

export const fetchFeaturedPlaylists = async (): Promise<Playlist[]> => {
  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      artist:artists(*)
    `)
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }

  return data.map(playlist => ({
    ...playlist,
    artist: playlist.artist as Artist
  })) as Playlist[];
};

export const fetchPlaylistsByCategory = async (category: string): Promise<Playlist[]> => {
  let query = supabase
    .from('playlists')
    .select(`
      *,
      artist:artists(*)
    `);

  if (category !== 'All') {
    query = query.eq('category', category);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching playlists by category:', error);
    return [];
  }

  return data.map(playlist => ({
    ...playlist,
    artist: playlist.artist as Artist
  })) as Playlist[];
};

export const fetchPlaylistById = async (id: string): Promise<Playlist | null> => {
  const { data: playlist, error: playlistError } = await supabase
    .from('playlists')
    .select(`
      *,
      artist:artists(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (playlistError || !playlist) {
    console.error('Error fetching playlist:', playlistError);
    return null;
  }

  const { data: playlistTracks, error: tracksError } = await supabase
    .from('playlist_tracks')
    .select(`
      position,
      track:tracks(
        *,
        artist:artists(*)
      )
    `)
    .eq('playlist_id', id)
    .order('position', { ascending: true });

  if (tracksError) {
    console.error('Error fetching playlist tracks:', tracksError);
    return {
      ...playlist,
      artist: playlist.artist as Artist,
      tracks: [],
      trackCount: 0,
      totalDuration: '0m'
    };
  }

  const tracks = playlistTracks.map(pt => ({
    ...(pt.track as any),
    artist: (pt.track as any).artist as Artist
  })) as Track[];

  const totalSeconds = tracks.reduce((sum, track) => sum + track.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const totalDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return {
    ...playlist,
    artist: playlist.artist as Artist,
    tracks,
    trackCount: tracks.length,
    totalDuration
  };
};

export const fetchTrackById = async (id: string): Promise<Track | null> => {
  const { data, error } = await supabase
    .from('tracks')
    .select(`
      *,
      artist:artists(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching track:', error);
    return null;
  }

  return {
    ...data,
    artist: data.artist as Artist
  } as Track;
};

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching artist:', error);
    return null;
  }

  return data as Artist;
};

export const incrementTrackPlays = async (trackId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_track_plays', {
    track_uuid: trackId
  });

  if (error) {
    console.error('Error incrementing track plays:', error);
  }
};

export const getAllCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('playlists')
    .select('category')
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return ['All'];
  }

  const categories = Array.from(new Set(data.map(p => p.category)));
  return ['All', ...categories.sort()];
};
