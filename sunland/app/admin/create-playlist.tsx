import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  uploadImage,
  createOrGetArtist,
  createPlaylist,
  getAllArtists,
  getAllTracks,
} from '@/lib/adminApi';

const CATEGORIES = ['Mix', 'Hip-Hop', 'Afrobeats', 'Chill', 'Beats', 'R&B', 'Pop', 'Favorites'];

export default function CreatePlaylistScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([]);
  const [tracks, setTracks] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [curatorName, setCuratorName] = useState('');
  const [category, setCategory] = useState('Mix');
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState<{ uri: string; name: string } | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [artistsData, tracksData] = await Promise.all([
      getAllArtists(),
      getAllTracks(),
    ]);
    setArtists(artistsData);
    setTracks(tracksData);
  };

  const pickCoverImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImage({
          uri: result.assets[0].uri,
          name: 'playlist-cover.jpg',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const toggleTrackSelection = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter((id) => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const moveTrackUp = (index: number) => {
    if (index > 0) {
      const newTracks = [...selectedTracks];
      [newTracks[index - 1], newTracks[index]] = [newTracks[index], newTracks[index - 1]];
      setSelectedTracks(newTracks);
    }
  };

  const moveTrackDown = (index: number) => {
    if (index < selectedTracks.length - 1) {
      const newTracks = [...selectedTracks];
      [newTracks[index], newTracks[index + 1]] = [newTracks[index + 1], newTracks[index]];
      setSelectedTracks(newTracks);
    }
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter((id) => id !== trackId));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a playlist title');
      return;
    }

    if (!curatorName.trim()) {
      Alert.alert('Error', 'Please enter a curator name');
      return;
    }

    if (!coverImage) {
      Alert.alert('Error', 'Please select a cover image');
      return;
    }

    if (selectedTracks.length === 0) {
      Alert.alert('Error', 'Please add at least one track to the playlist');
      return;
    }

    setLoading(true);

    try {
      const artist = await createOrGetArtist(curatorName.trim());
      if (!artist) {
        Alert.alert('Error', 'Failed to create or get curator');
        setLoading(false);
        return;
      }

      const imageUpload = await uploadImage(coverImage.uri, coverImage.name, 'cover-art');
      if (!imageUpload.success) {
        Alert.alert('Error', imageUpload.error || 'Failed to upload cover image');
        setLoading(false);
        return;
      }

      const result = await createPlaylist({
        title: title.trim(),
        description: description.trim(),
        coverImage: imageUpload.url!,
        artistId: artist.id,
        category,
        isFeatured,
        trackIds: selectedTracks,
      });

      setLoading(false);

      if (result.success) {
        Alert.alert(
          'Success',
          'Playlist created successfully!',
          [
            {
              text: 'Create Another',
              onPress: () => {
                setTitle('');
                setDescription('');
                setCuratorName('');
                setCategory('Mix');
                setIsFeatured(false);
                setCoverImage(null);
                setSelectedTracks([]);
                loadData();
              },
            },
            {
              text: 'Done',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create playlist');
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  const filteredTracks = tracks.filter(
    (track) =>
      !selectedTracks.includes(track.id) &&
      (searchQuery === '' ||
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSelectedTrackInfo = (trackId: string) => {
    return tracks.find((t) => t.id === trackId);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Playlist Info</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Playlist Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter playlist title"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter playlist description"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Curator Name *</Text>
            <TextInput
              style={styles.input}
              value={curatorName}
              onChangeText={setCuratorName}
              placeholder="Enter or select curator name"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
            {artists.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistSuggestions}>
                {artists.map((artist) => (
                  <TouchableOpacity
                    key={artist.id}
                    style={styles.artistChip}
                    onPress={() => setCuratorName(artist.name)}
                  >
                    <Text style={styles.artistChipText}>{artist.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                  disabled={loading}
                >
                  <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.featuredToggle}
            onPress={() => setIsFeatured(!isFeatured)}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFeatured ? 'checkbox' : 'square-outline'}
              size={24}
              color={isFeatured ? colors.primary : colors.text}
            />
            <Text style={styles.featuredText}>Mark as Featured on Homepage</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cover Image *</Text>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={pickCoverImage}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="image" size={24} color={coverImage ? colors.primary : colors.text} />
              <Text style={[styles.fileButtonText, coverImage && styles.fileButtonTextActive]}>
                {coverImage ? 'Cover Image Selected' : 'Select Cover Image'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Add Tracks</Text>

          {selectedTracks.length > 0 && (
            <View style={styles.selectedTracksSection}>
              <Text style={styles.selectedTracksTitle}>
                Selected Tracks ({selectedTracks.length})
              </Text>
              {selectedTracks.map((trackId, index) => {
                const track = getSelectedTrackInfo(trackId);
                if (!track) return null;
                return (
                  <View key={trackId} style={styles.selectedTrackItem}>
                    <View style={styles.selectedTrackInfo}>
                      <Text style={styles.selectedTrackPosition}>{index + 1}</Text>
                      <View style={styles.selectedTrackDetails}>
                        <Text style={styles.selectedTrackTitle}>{track.title}</Text>
                        <Text style={styles.selectedTrackArtist}>{track.artist?.name}</Text>
                      </View>
                    </View>
                    <View style={styles.selectedTrackActions}>
                      <TouchableOpacity onPress={() => moveTrackUp(index)} disabled={index === 0}>
                        <Ionicons
                          name="chevron-up"
                          size={24}
                          color={index === 0 ? colors.textSecondary : colors.text}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => moveTrackDown(index)}
                        disabled={index === selectedTracks.length - 1}
                      >
                        <Ionicons
                          name="chevron-down"
                          size={24}
                          color={index === selectedTracks.length - 1 ? colors.textSecondary : colors.text}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeTrack(trackId)}>
                        <Ionicons name="close-circle" size={24} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Search Tracks</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by track or artist name"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.tracksListSection}>
            {filteredTracks.map((track) => (
              <TouchableOpacity
                key={track.id}
                style={styles.trackItem}
                onPress={() => toggleTrackSelection(track.id)}
                activeOpacity={0.7}
              >
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackArtist}>{track.artist?.name}</Text>
                </View>
                <Ionicons name="add-circle" size={28} color={colors.primary} />
              </TouchableOpacity>
            ))}
            {filteredTracks.length === 0 && (
              <Text style={styles.noTracksText}>
                {searchQuery ? 'No tracks found' : 'All tracks added to playlist'}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color={colors.background} />
                <Text style={styles.createButtonText}>Create Playlist</Text>
              </>
            )}
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
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  sectionTitleSpaced: {
    marginTop: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  artistSuggestions: {
    marginTop: 8,
  },
  artistChip: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  artistChipText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryContainer: {
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.background,
  },
  featuredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featuredText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  fileButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  fileButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedTracksSection: {
    marginBottom: 24,
  },
  selectedTracksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  selectedTrackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  selectedTrackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedTrackPosition: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    width: 32,
  },
  selectedTrackDetails: {
    flex: 1,
  },
  selectedTrackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedTrackArtist: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectedTrackActions: {
    flexDirection: 'row',
    gap: 8,
  },
  tracksListSection: {
    marginBottom: 24,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  trackArtist: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  noTracksText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});
