import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import FeaturedPlaylistCard from '@/components/FeaturedPlaylistCard';
import SectionHeader from '@/components/SectionHeader';
import { playlists, categories } from '@/mocks/playlists';
import { Playlist } from '@/types';
import DecorativeBorder from '@/components/DecorativeBorder';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Playlist[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Beats', 'Afrobeats', 'Chill vibes'
  ]);

  // Group playlists by category for browse section
  const playlistsByCategory = categories.reduce((acc, category) => {
    if (category !== 'All') {
      acc[category] = playlists.filter(playlist => playlist.category === category);
    }
    return acc;
  }, {} as Record<string, Playlist[]>);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = playlists.filter(
      playlist =>
        playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search playlists, artists..."
      />

      {searchQuery.trim() === '' ? (
        // Browse content when not searching
        <View>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Recent Searches" />
              <View style={styles.recentSearchesContainer}>
                {recentSearches.map((search, index) => (
                  <View key={index} style={styles.recentSearchItem}>
                    <Text style={styles.recentSearchText}>{search}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <DecorativeBorder />

          <View style={styles.section}>
            <SectionHeader title="Browse Categories" />
            <View style={styles.categoriesContainer}>
              {Object.entries(playlistsByCategory).map(([category, categoryPlaylists]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryPlaylists}
                  >
                    {categoryPlaylists.slice(0, 3).map(playlist => (
                      <View key={playlist.id} style={styles.smallCardContainer}>
                        <FeaturedPlaylistCard playlist={playlist} />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        // Search results
        <View style={styles.searchResultsContainer}>
          <Text style={styles.resultsTitle}>
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </Text>
          {searchResults.map(playlist => (
            <FeaturedPlaylistCard key={playlist.id} playlist={playlist} />
          ))}
          {searchResults.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  recentSearchesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  recentSearchItem: {
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  recentSearchText: {
    color: colors.text,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoryPlaylists: {
    paddingRight: 20,
  },
  smallCardContainer: {
    width: 280,
    marginRight: 16,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  spacer: {
    height: 100, // Space for the mini player
  },
});