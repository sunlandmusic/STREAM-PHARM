import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import FeaturedPlaylistCard from '@/components/FeaturedPlaylistCard';
import SectionHeader from '@/components/SectionHeader';
import CategoryStrip from '@/components/CategoryStrip';
import SunlandLogo from '@/components/SunlandLogo';
import DecorativeBorder from '@/components/DecorativeBorder';
import PlayerBar from '@/components/PlayerBar';
import { useRouter } from 'expo-router';
import { Playlist } from '@/types';
import { fetchPlaylistsByCategory, getAllCategories } from '@/lib/api';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
    loadPlaylists('All');
  }, []);

  const loadCategories = async () => {
    const cats = await getAllCategories();
    setCategories(cats);
  };

  const loadPlaylists = async (category: string) => {
    setLoading(true);
    const data = await fetchPlaylistsByCategory(category);
    setPlaylists(data);
    setLoading(false);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    loadPlaylists(category);
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.playlistsContainer}>
            {playlists.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                onPress={() => handlePlaylistPress(playlist.id)}
                activeOpacity={0.7}
              >
                <FeaturedPlaylistCard playlist={playlist} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <PlayerBar />
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
    height: 150,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  }
});