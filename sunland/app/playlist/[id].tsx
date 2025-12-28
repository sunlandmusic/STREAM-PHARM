import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Play } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { fetchPlaylistById } from '@/lib/api';
import { Playlist, Track } from '@/types';
import DecorativeBorder from '@/components/DecorativeBorder';
import AudioPlayer from '@/components/AudioPlayer';
import PlayerBar from '@/components/PlayerBar';
import usePlayerStore from '@/store/playerStore';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const { playPlaylist, playTrack, currentTrack } = usePlayerStore();

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const loadPlaylist = async () => {
    setLoading(true);
    const data = await fetchPlaylistById(id);
    setPlaylist(data);
    setLoading(false);
  };

  const handlePlayPlaylist = () => {
    if (playlist?.tracks && playlist.tracks.length > 0) {
      playPlaylist(playlist.tracks, 0);
    }
  };

  const handlePlayTrack = (track: Track, index: number) => {
    if (playlist?.tracks) {
      playPlaylist(playlist.tracks, index);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Playlist not found</Text>
      </View>
    );
  }

  return (
    <>
      {/* Remove the title from the header, keeping only the back button */}
      <Stack.Screen options={{ title: '' }} />
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{playlist.title}</Text>
              <Text style={styles.creator}>{playlist.artist?.name || 'SUNLAND MUSIC'}</Text>
              <Text style={styles.stats}>
                {playlist.trackCount || 0} tracks • {playlist.totalDuration || '0m'}
              </Text>

              <TouchableOpacity
                style={styles.playAllButton}
                onPress={handlePlayPlaylist}
                activeOpacity={0.8}
              >
                <Play size={20} color={colors.background} fill={colors.background} />
                <Text style={styles.playAllText}>Play All</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DecorativeBorder />

          <View style={styles.tracksContainer}>
            <Text style={styles.sectionTitle}>Tracks</Text>
            {playlist.tracks && playlist.tracks.length > 0 ? (
              playlist.tracks.map((track, index) => (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.trackItem,
                    currentTrack?.id === track.id && styles.trackItemActive
                  ]}
                  onPress={() => handlePlayTrack(track, index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.trackNumber}>
                    <Text style={styles.trackNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.trackInfo}>
                    <Text
                      style={[
                        styles.trackTitle,
                        currentTrack?.id === track.id && styles.trackTitleActive
                      ]}
                      numberOfLines={1}
                    >
                      {track.title}
                    </Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {track.artist?.name || 'Unknown Artist'}
                    </Text>
                  </View>
                  <Text style={styles.trackDuration}>
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noTracksText}>No tracks in this playlist</Text>
            )}
          </View>

          <DecorativeBorder />

          {currentTrack && (
            <View style={styles.playerContainer}>
              <AudioPlayer showControls={true} />
            </View>
          )}

          <View style={styles.spacer} />
        </ScrollView>

        <PlayerBar />
      </View>
    </>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 8,
    margin: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  creator: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  stats: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  playAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    marginTop: 8,
  },
  playAllText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  tracksContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  trackItemActive: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  trackNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trackNumberText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackTitleActive: {
    color: colors.primary,
  },
  trackArtist: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  trackDuration: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  noTracksText: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  playerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  spacer: {
    height: 150,
  },
});