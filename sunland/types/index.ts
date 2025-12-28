export interface Artist {
  id: string;
  name: string;
  bio: string;
  profile_image: string;
  total_blessings: number;
  total_plays: number;
  stripe_account_id: string | null;
  created_at: string;
}

export interface Track {
  id: string;
  title: string;
  artist_id: string;
  artist?: Artist;
  album: string;
  duration: number;
  file_url: string;
  cover_image_url: string;
  genre: string;
  release_date: string;
  plays_count: number;
  is_premium: boolean;
  created_at: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  artist_id: string | null;
  artist?: Artist;
  category: string;
  is_featured: boolean;
  play_count: number;
  created_at: string;
  tracks?: Track[];
  trackCount?: number;
  totalDuration?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  volume: number;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
}