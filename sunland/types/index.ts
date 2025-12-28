export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  embedCode: string;
  tracks: number;
  duration: string;
  creator: string;
  category?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentPlaylistId: string | null;
  volume: number;
}