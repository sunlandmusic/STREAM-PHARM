import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import DecorativeBorder from '@/components/DecorativeBorder';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalTracks: number;
  totalPlaylists: number;
  totalArtists: number;
  totalPlays: number;
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalTracks: 0,
    totalPlaylists: 0,
    totalArtists: 0,
    totalPlays: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [tracks, playlists, artists] = await Promise.all([
        supabase.from('tracks').select('plays_count', { count: 'exact' }),
        supabase.from('playlists').select('id', { count: 'exact' }),
        supabase.from('artists').select('id', { count: 'exact' }),
      ]);

      const totalPlays = tracks.data?.reduce((sum, track) => sum + (track.plays_count || 0), 0) || 0;

      setStats({
        totalTracks: tracks.count || 0,
        totalPlaylists: playlists.count || 0,
        totalArtists: artists.count || 0,
        totalPlays,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Admin Dashboard</Text>
          <Text style={styles.emailText}>Upload and manage your content</Text>
        </View>

        <DecorativeBorder height={30} />

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Dashboard Stats</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="musical-notes" size={32} color={colors.primary} />
                <Text style={styles.statNumber}>{stats.totalTracks}</Text>
                <Text style={styles.statLabel}>Total Tracks</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="albums" size={32} color={colors.accent} />
                <Text style={styles.statNumber}>{stats.totalPlaylists}</Text>
                <Text style={styles.statLabel}>Total Playlists</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="people" size={32} color={colors.secondary} />
                <Text style={styles.statNumber}>{stats.totalArtists}</Text>
                <Text style={styles.statLabel}>Total Artists</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="play-circle" size={32} color={colors.primary} />
                <Text style={styles.statNumber}>{stats.totalPlays.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Plays</Text>
              </View>
            </View>
          )}
        </View>

        <DecorativeBorder height={30} />

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/admin/upload-track')}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="cloud-upload" size={28} color={colors.text} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>Upload Track</Text>
                <Text style={styles.actionButtonSubtitle}>Add new music to the platform</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/admin/create-playlist')}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="list" size={28} color={colors.text} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>Create Playlist</Text>
                <Text style={styles.actionButtonSubtitle}>Build a new playlist</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/admin/manage-content')}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="settings" size={28} color={colors.text} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>Manage Content</Text>
                <Text style={styles.actionButtonSubtitle}>View, edit, and delete content</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  spacer: {
    height: 40,
  },
});
