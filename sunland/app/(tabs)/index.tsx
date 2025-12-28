import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { colors } from '@/constants/colors';
import FeaturedPlaylistCard from '@/components/FeaturedPlaylistCard';
import SectionHeader from '@/components/SectionHeader';
import CategoryStrip from '@/components/CategoryStrip';
import SunlandLogo from '@/components/SunlandLogo';
import { categories, getPlaylistsByCategory } from '@/mocks/playlists';
import DecorativeBorder from '@/components/DecorativeBorder';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredPlaylists = getPlaylistsByCategory(selectedCategory);
  const router = useRouter();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePlaylistPress = (id: string) => {
    router.push(`/playlist/${id}`);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SunlandLogo size={235} />
        </View>

        <DecorativeBorder />
        <CategoryStrip 
          categories={categories} 
          onSelectCategory={handleCategorySelect} 
        />
        <DecorativeBorder />

        <SectionHeader title="Playlists" />
        <View style={styles.playlistsContainer}>
          {filteredPlaylists.map((playlist) => (
            <TouchableOpacity 
              key={playlist.id} 
              onPress={() => handlePlaylistPress(playlist.id)}
              activeOpacity={0.7}
            >
              <FeaturedPlaylistCard playlist={playlist} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      {/* Fixed decorative border at the bottom */}
      <View style={styles.fixedBottomBorder}>
        <DecorativeBorder />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 67,
    paddingBottom: 16,
    alignItems: 'center',
  },
  playlistsContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  spacer: {
    height: 124,
  },
  fixedBottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  }
});