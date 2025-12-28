import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Playlist } from '@/types';
import { colors } from '@/constants/colors';
import usePlayerStore from '@/store/playerStore';
import { Image } from 'expo-image';

interface FeaturedPlaylistCardProps {
  playlist: Playlist;
}

const FeaturedPlaylistCard: React.FC<FeaturedPlaylistCardProps> = ({ playlist }) => {
  const router = useRouter();
  const { play } = usePlayerStore();
  
  const handlePress = () => {
    console.log('Navigating to playlist:', playlist.id);
    
    // Navigate to the playlist detail page
    try {
      router.push(`/playlist/${playlist.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Could not open playlist details.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Border frame image */}
        <Image
          source={{ uri: "https://cdn.shopify.com/s/files/1/2682/9856/files/C-6.png?v=1747724007" }}
          style={styles.borderImage}
          contentFit="fill"
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {playlist.title}
          </Text>
          <Text style={styles.creator} numberOfLines={1}>
            {playlist.artist?.name || 'SUNLAND MUSIC'}
          </Text>

          <View style={styles.statsContainer}>
            <Text style={styles.stats}>
              {playlist.trackCount || 0} tracks • {playlist.totalDuration || '0m'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
    width: (Dimensions.get('window').width - 40),
    height: 180, // Fixed height to ensure proper sizing
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    height: '100%', // Take full height of wrapper
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  infoContainer: {
    width: '80%', // Increased width to better fit inside the border
    height: '80%', // Increased height to better fit inside the border
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure content is above the border image
  },
  title: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 22, // Increased font size
    marginBottom: 8,
    textAlign: 'center',
  },
  creator: {
    color: colors.textSecondary,
    fontSize: 16, // Increased font size
    marginBottom: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    color: colors.textSecondary,
    fontSize: 14, // Increased font size
  },
});

export default FeaturedPlaylistCard;