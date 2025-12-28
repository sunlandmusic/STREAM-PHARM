import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';
import { Image } from 'expo-image';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  // We'll use a fixed image for "PLAYLISTS" and fallback to text for other titles
  const isPlaylistsTitle = title.toUpperCase() === "PLAYLISTS";
  
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {isPlaylistsTitle ? (
          // Use the provided image URL for "PLAYLISTS"
          <Image
            source="https://cdn.shopify.com/s/files/1/2682/9856/files/C-3.png?v=1747786601"
            style={styles.titleImage}
            contentFit="contain"
          />
        ) : (
          // For other titles, use regular text
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        )}
      </View>
      
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the title
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleContainer: {
    position: 'relative',
    height: 50, // Increased from 40 to 50 (25% increase)
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  titleImage: {
    width: 250, // Increased from 200 to 250 (25% increase)
    height: 50, // Increased from 40 to 50 (25% increase)
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
    color: colors.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20, // Position it on the right while keeping the title centered
  },
  seeAllText: {
    color: colors.primary,
    marginRight: 4,
  },
});

export default SectionHeader;