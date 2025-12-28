import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Playlist } from '@/types';
import { colors } from '@/constants/colors';
import { Play } from 'lucide-react-native';

interface PlaylistCardProps {
  playlist: Playlist;
  size?: 'small' | 'medium' | 'large';
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, size = 'medium' }) => {
  const router = useRouter();
  
  const handlePress = () => {
    console.log('Navigating to playlist:', playlist.id);
    router.push(`/playlist/${playlist.id}`);
  };

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return { width: 150, height: 150, titleSize: 14 };
      case 'large':
        return { width: Dimensions.get('window').width - 40, height: 200, titleSize: 18 };
      case 'medium':
      default:
        return { width: 180, height: 180, titleSize: 16 };
    }
  };

  const { width, height, titleSize } = getCardSize();

  return (
    <TouchableOpacity 
      style={[styles.container, { width, marginRight: size === 'large' ? 0 : 16 }]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { height: size === 'large' ? height : height - 50 }]}>
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Play size={24} color={colors.background} />
          </View>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={1}>
          {playlist.title}
        </Text>
        {size !== 'small' && (
          <Text style={styles.creator} numberOfLines={1}>
            {playlist.creator}
          </Text>
        )}
        {size === 'large' && (
          <View style={styles.statsContainer}>
            <Text style={styles.stats}>{playlist.tracks} tracks • {playlist.duration}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: colors.surfaceHighlight, // Simple background instead of the letter
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  creator: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  statsContainer: {
    marginTop: 8,
  },
  stats: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default PlaylistCard;