import { create } from 'zustand';
import { PlayerState } from '@/types';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

const usePlayerStore = create<PlayerState & {
  play: (playlistId: string) => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  skipNext: () => void;
  skipPrevious: () => void;
}>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentPlaylistId: null,
      volume: 0.8,
      
      play: (playlistId: string) => {
        console.log('Playing playlist:', playlistId);
        set({ isPlaying: true, currentPlaylistId: playlistId });
      },
      
      pause: () => {
        console.log('Pausing playback');
        set({ isPlaying: false });
      },
      
      toggle: () => {
        const currentState = get().isPlaying;
        console.log(currentState ? 'Pausing playback' : 'Resuming playback');
        set(state => ({ isPlaying: !state.isPlaying }));
      },
      
      setVolume: (volume: number) => {
        console.log('Setting volume to:', volume);
        set({ volume });
      },
      
      // These functions would normally handle track navigation
      skipNext: () => {
        console.log('Skip to next track');
        // In a real app, this would change the current track
        // For now, we'll just log the action
      },
      
      skipPrevious: () => {
        console.log('Skip to previous track');
        // In a real app, this would change the current track
        // For now, we'll just log the action
      },
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePlayerStore;