import { create } from 'zustand';
import { PlayerState, Track } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PlayerActions {
  playTrack: (track: Track, queue?: Track[]) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  setRepeat: (repeat: 'none' | 'all' | 'one') => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

const usePlayerStore = create<PlayerState & PlayerActions>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentTrack: null,
      queue: [],
      currentIndex: 0,
      volume: 0.8,
      shuffle: false,
      repeat: 'none',

      playTrack: (track: Track, queue?: Track[]) => {
        set({
          isPlaying: true,
          currentTrack: track,
          queue: queue || [track],
          currentIndex: 0
        });
      },

      playPlaylist: (tracks: Track[], startIndex: number = 0) => {
        if (tracks.length === 0) return;
        set({
          isPlaying: true,
          currentTrack: tracks[startIndex],
          queue: tracks,
          currentIndex: startIndex
        });
      },

      pause: () => {
        set({ isPlaying: false });
      },

      resume: () => {
        set({ isPlaying: true });
      },

      toggle: () => {
        set(state => ({ isPlaying: !state.isPlaying }));
      },

      skipNext: () => {
        const { currentIndex, queue, repeat } = get();

        if (repeat === 'one') {
          return;
        }

        if (currentIndex < queue.length - 1) {
          const nextIndex = currentIndex + 1;
          set({
            currentIndex: nextIndex,
            currentTrack: queue[nextIndex]
          });
        } else if (repeat === 'all') {
          set({
            currentIndex: 0,
            currentTrack: queue[0]
          });
        } else {
          set({ isPlaying: false });
        }
      },

      skipPrevious: () => {
        const { currentIndex, queue } = get();

        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          set({
            currentIndex: prevIndex,
            currentTrack: queue[prevIndex]
          });
        }
      },

      setVolume: (volume: number) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
      },

      toggleShuffle: () => {
        set(state => ({ shuffle: !state.shuffle }));
      },

      setRepeat: (repeat: 'none' | 'all' | 'one') => {
        set({ repeat });
      },

      addToQueue: (track: Track) => {
        set(state => ({
          queue: [...state.queue, track]
        }));
      },

      removeFromQueue: (index: number) => {
        set(state => {
          const newQueue = state.queue.filter((_, i) => i !== index);
          let newIndex = state.currentIndex;

          if (index < state.currentIndex) {
            newIndex = state.currentIndex - 1;
          } else if (index === state.currentIndex) {
            newIndex = Math.min(newIndex, newQueue.length - 1);
          }

          return {
            queue: newQueue,
            currentIndex: newIndex,
            currentTrack: newQueue[newIndex] || null
          };
        });
      },

      clearQueue: () => {
        set({
          queue: [],
          currentTrack: null,
          currentIndex: 0,
          isPlaying: false
        });
      },
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePlayerStore;