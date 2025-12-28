import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react-native';
import usePlayerStore from '@/store/playerStore';
import { colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

interface AudioPlayerProps {
  showControls?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ showControls = true }) => {
  const {
    currentTrack,
    isPlaying,
    volume,
    toggle,
    skipNext,
    skipPrevious,
    setVolume
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && !audioRef.current) {
      audioRef.current = new Audio();

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        skipNext();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioUrl = supabase.storage.from('audio-files').getPublicUrl(currentTrack.file_url).data.publicUrl;
      audioRef.current.src = audioUrl;
      audioRef.current.load();

      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Play error:', err));
      }

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist?.name || 'Unknown Artist',
          album: currentTrack.album,
          artwork: currentTrack.cover_image_url ? [
            { src: currentTrack.cover_image_url, sizes: '512x512', type: 'image/jpeg' }
          ] : []
        });

        navigator.mediaSession.setActionHandler('play', () => toggle());
        navigator.mediaSession.setActionHandler('pause', () => toggle());
        navigator.mediaSession.setActionHandler('previoustrack', () => skipPrevious());
        navigator.mediaSession.setActionHandler('nexttrack', () => skipNext());
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!currentTrack) {
    return null;
  }

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>Audio playback is only available on web</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          style={{
            flex: 1,
            marginHorizontal: 12,
            accentColor: colors.primary,
          }}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
            <SkipBack size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggle} style={styles.playButton}>
            {isPlaying ? (
              <Pause size={32} color={colors.background} fill={colors.text} />
            ) : (
              <Play size={32} color={colors.background} fill={colors.text} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
            <SkipForward size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.volumeContainer}>
            <TouchableOpacity onPress={toggleMute} style={styles.volumeButton}>
              {isMuted || volume === 0 ? (
                <VolumeX size={20} color={colors.text} />
              ) : (
                <Volume2 size={20} color={colors.text} />
              )}
            </TouchableOpacity>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                width: 100,
                accentColor: colors.primary,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 12,
    minWidth: 40,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
    gap: 8,
  },
  volumeButton: {
    padding: 4,
  },
  warningText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
});

export default AudioPlayer;
