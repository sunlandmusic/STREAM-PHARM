import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { getPlaylistById } from '@/mocks/playlists';
import SoundCloudEmbed from '@/components/SoundCloudEmbed';
import DecorativeBorder from '@/components/DecorativeBorder';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playlist = getPlaylistById(id);
  
  if (!playlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Playlist not found</Text>
      </View>
    );
  }

  return (
    <>
      {/* Remove the title from the header, keeping only the back button */}
      <Stack.Screen options={{ title: '' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{playlist.title}</Text>
            <Text style={styles.creator}>{playlist.creator}</Text>
            <Text style={styles.stats}>
              {playlist.tracks} tracks • {playlist.duration}
            </Text>
          </View>
        </View>
        
        <DecorativeBorder />
        
        <View style={styles.playerContainer}>
          <Text style={styles.playerTitle}>Listen</Text>
          <SoundCloudEmbed 
            embedCode={playlist.embedCode} 
            playlistId={playlist.id}
            height={450}
          />
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  playerContainer: {
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginTop: 40,
  },
  spacer: {
    height: 40, // Reduced since we no longer need space for controls
  },
});