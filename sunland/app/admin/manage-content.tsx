import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { getAllTracks, getAllPlaylists, deleteTrack, deletePlaylist } from '@/lib/adminApi';

type Tab = 'tracks' | 'playlists';

export default function ManageContentScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('tracks');
  const [tracks, setTracks] = useState<Array<any>>([]);
  const [playlists, setPlaylists] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [tracksData, playlistsData] = await Promise.all([
      getAllTracks(),
      getAllPlaylists(),
    ]);
    setTracks(tracksData);
    setPlaylists(playlistsData);
    setLoading(false);
  };

  const handleDeleteTrack = (trackId: string, trackTitle: string) => {
    Alert.alert(
      'Delete Track',
      `Are you sure you want to delete "${trackTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTrack(trackId);
            if (result.success) {
              Alert.alert('Success', 'Track deleted successfully');
              loadData();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete track');
            }
          },
        },
      ]
    );
  };

  const handleDeletePlaylist = (playlistId: string, playlistTitle: string) => {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlistTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePlaylist(playlistId);
            if (result.success) {
              Alert.alert('Success', 'Playlist deleted successfully');
              loadData();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete playlist');
            }
          },
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTracks = tracks.filter(
    (track) =>
      searchQuery === '' ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      searchQuery === '' ||
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tracks' && styles.tabActive]}
          onPress={() => {
            setActiveTab('tracks');
            setSearchQuery('');
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="musical-notes"
            size={20}
            color={activeTab === 'tracks' ? colors.background : colors.text}
          />
          <Text style={[styles.tabText, activeTab === 'tracks' && styles.tabTextActive]}>
            Tracks ({tracks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'playlists' && styles.tabActive]}
          onPress={() => {
            setActiveTab('playlists');
            setSearchQuery('');
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="albums"
            size={20}
            color={activeTab === 'playlists' ? colors.background : colors.text}
          />
          <Text style={[styles.tabText, activeTab === 'playlists' && styles.tabTextActive]}>
            Playlists ({playlists.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${activeTab}...`}
          placeholderTextColor={colors.textSecondary}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {activeTab === 'tracks' ? (
            <View style={styles.contentContainer}>
              {filteredTracks.length === 0 ? (
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No tracks found' : 'No tracks uploaded yet'}
                </Text>
              ) : (
                filteredTracks.map((track) => (
                  <View key={track.id} style={styles.item}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{track.title}</Text>
                      <Text style={styles.itemSubtitle}>{track.artist?.name}</Text>
                      <View style={styles.itemMetadata}>
                        <Text style={styles.metadataText}>{track.genre}</Text>
                        <Text style={styles.metadataDivider}>•</Text>
                        <Text style={styles.metadataText}>{formatDuration(track.duration)}</Text>
                        <Text style={styles.metadataDivider}>•</Text>
                        <Text style={styles.metadataText}>{track.plays_count} plays</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTrack(track.id, track.title)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash" size={24} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.contentContainer}>
              {filteredPlaylists.length === 0 ? (
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No playlists found' : 'No playlists created yet'}
                </Text>
              ) : (
                filteredPlaylists.map((playlist) => (
                  <View key={playlist.id} style={styles.item}>
                    <View style={styles.itemInfo}>
                      <View style={styles.playlistTitleRow}>
                        <Text style={styles.itemTitle}>{playlist.title}</Text>
                        {playlist.is_featured && (
                          <View style={styles.featuredBadge}>
                            <Ionicons name="star" size={14} color={colors.background} />
                            <Text style={styles.featuredText}>Featured</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.itemSubtitle}>{playlist.artist?.name}</Text>
                      <View style={styles.itemMetadata}>
                        <Text style={styles.metadataText}>{playlist.category}</Text>
                        <Text style={styles.metadataDivider}>•</Text>
                        <Text style={styles.metadataText}>{playlist.play_count} plays</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletePlaylist(playlist.id, playlist.title)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash" size={24} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
          <View style={styles.spacer} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  itemMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metadataDivider: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  playlistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 48,
  },
  spacer: {
    height: 40,
  },
});
