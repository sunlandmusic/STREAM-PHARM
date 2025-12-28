import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Play, Pause, SkipForward, SkipBack, Heart } from 'lucide-react-native';
import usePlayerStore from '@/store/playerStore';
import { colors } from '@/constants/colors';
import DecorativeBorder from './DecorativeBorder';

const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    toggle,
    skipNext,
    skipPrevious
  } = usePlayerStore();

  if (!currentTrack) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <DecorativeBorder height={20} />
      <View style={styles.container}>
        <View style={styles.trackInfo}>
          {currentTrack.cover_image_url ? (
            <Image
              source={{ uri: currentTrack.cover_image_url }}
              style={styles.coverImage}
            />
          ) : (
            <View style={[styles.coverImage, styles.placeholderCover]}>
              <Text style={styles.placeholderText}>♪</Text>
            </View>
          )}

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist?.name || 'Unknown Artist'}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={skipPrevious}
            style={styles.controlButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SkipBack size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggle}
            style={styles.playButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isPlaying ? (
              <Pause size={24} color={colors.background} fill={colors.text} />
            ) : (
              <Play size={24} color={colors.background} fill={colors.text} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={skipNext}
            style={styles.controlButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SkipForward size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.blessButton}>
          <Heart size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  container: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  coverImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
  },
  placeholderCover: {
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    padding: 4,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blessButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default PlayerBar;
