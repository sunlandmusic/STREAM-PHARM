import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import FeaturedPlaylistCard from '@/components/FeaturedPlaylistCard';
import SectionHeader from '@/components/SectionHeader';
import { playlists } from '@/mocks/playlists';
import { Plus, Clock, Heart } from 'lucide-react-native';
import DecorativeBorder from '@/components/DecorativeBorder';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState('playlists');
  
  // Mock data - in a real app, this would come from user's saved data
  const savedPlaylists = playlists.slice(0, 2);
  const recentlyPlayed = playlists.slice(2, 3);
  const likedPlaylists = playlists.slice(0, 2);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'playlists' && styles.activeTab]} 
          onPress={() => setActiveTab('playlists')}
        >
          <Text style={[styles.tabText, activeTab === 'playlists' && styles.activeTabText]}>
            Playlists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'artists' && styles.activeTab]} 
          onPress={() => setActiveTab('artists')}
        >
          <Text style={[styles.tabText, activeTab === 'artists' && styles.activeTabText]}>
            Artists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'albums' && styles.activeTab]} 
          onPress={() => setActiveTab('albums')}
        >
          <Text style={[styles.tabText, activeTab === 'albums' && styles.activeTabText]}>
            Albums
          </Text>
        </TouchableOpacity>
      </View>

      <DecorativeBorder />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Recently Played</Text>
        </View>
        {recentlyPlayed.map(playlist => (
          <FeaturedPlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </View>

      <DecorativeBorder />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Heart size={20} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Liked Playlists</Text>
        </View>
        {likedPlaylists.map(playlist => (
          <FeaturedPlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </View>

      <DecorativeBorder />

      <View style={styles.section}>
        <SectionHeader title="Your Playlists" />
        {savedPlaylists.map(playlist => (
          <FeaturedPlaylistCard key={playlist.id} playlist={playlist} />
        ))}
        {savedPlaylists.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>You haven't saved any playlists yet</Text>
            <TouchableOpacity style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse Playlists</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: colors.surfaceHighlight,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.text,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },
  browseButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  spacer: {
    height: 100, // Space for the mini player
  },
});