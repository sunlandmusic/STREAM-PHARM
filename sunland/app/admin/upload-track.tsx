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
  Platform,
} from 'react-native';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  uploadAudioFile,
  uploadImage,
  getAudioDuration,
  createOrGetArtist,
  createTrack,
  getAllArtists,
} from '@/lib/adminApi';

const GENRES = ['Hip-Hop', 'Afrobeats', 'Chill', 'Beats', 'R&B', 'Pop', 'Jazz', 'Electronic', 'Other'];

export default function UploadTrackScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([]);

  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Hip-Hop');
  const [audioFile, setAudioFile] = useState<{ uri: string; name: string } | null>(null);
  const [coverImage, setCoverImage] = useState<{ uri: string; name: string } | null>(null);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    const data = await getAllArtists();
    setArtists(data);
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setAudioFile({
          uri: asset.uri,
          name: asset.name,
        });
      }
    } catch (error) {
      console.error('Error picking audio file:', error);
      Alert.alert('Error', 'Failed to pick audio file');
    }
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
          name: 'cover.jpg',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a track title');
      return;
    }

    if (!artistName.trim()) {
      Alert.alert('Error', 'Please enter an artist name');
      return;
    }

    if (!audioFile) {
      Alert.alert('Error', 'Please select an audio file');
      return;
    }

    if (!coverImage) {
      Alert.alert('Error', 'Please select a cover image');
      return;
    }

    setLoading(true);

    try {
      const artist = await createOrGetArtist(artistName.trim());
      if (!artist) {
        Alert.alert('Error', 'Failed to create or get artist');
        setLoading(false);
        return;
      }

      const audioUpload = await uploadAudioFile(audioFile.uri, audioFile.name);
      if (!audioUpload.success) {
        Alert.alert('Error', audioUpload.error || 'Failed to upload audio file');
        setLoading(false);
        return;
      }

      const imageUpload = await uploadImage(coverImage.uri, coverImage.name, 'cover-art');
      if (!imageUpload.success) {
        Alert.alert('Error', imageUpload.error || 'Failed to upload cover image');
        setLoading(false);
        return;
      }

      const duration = await getAudioDuration(audioFile.uri);

      const result = await createTrack({
        title: title.trim(),
        artistId: artist.id,
        album: album.trim() || 'Single',
        duration,
        fileUrl: audioUpload.url!,
        coverImageUrl: imageUpload.url!,
        genre,
      });

      setLoading(false);

      if (result.success) {
        Alert.alert(
          'Success',
          'Track uploaded successfully!',
          [
            {
              text: 'Upload Another',
              onPress: () => {
                setTitle('');
                setArtistName('');
                setAlbum('');
                setGenre('Hip-Hop');
                setAudioFile(null);
                setCoverImage(null);
                loadArtists();
              },
            },
            {
              text: 'Done',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create track');
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Track Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter track title"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Artist Name *</Text>
            <TextInput
              style={styles.input}
              value={artistName}
              onChangeText={setArtistName}
              placeholder="Enter or select artist name"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
            {artists.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistSuggestions}>
                {artists.map((artist) => (
                  <TouchableOpacity
                    key={artist.id}
                    style={styles.artistChip}
                    onPress={() => setArtistName(artist.name)}
                  >
                    <Text style={styles.artistChipText}>{artist.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Album Name</Text>
            <TextInput
              style={styles.input}
              value={album}
              onChangeText={setAlbum}
              placeholder="Enter album name (optional)"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreContainer}>
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genreChip, genre === g && styles.genreChipActive]}
                  onPress={() => setGenre(g)}
                  disabled={loading}
                >
                  <Text style={[styles.genreChipText, genre === g && styles.genreChipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Audio File *</Text>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={pickAudioFile}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="musical-note" size={24} color={audioFile ? colors.primary : colors.text} />
              <Text style={[styles.fileButtonText, audioFile && styles.fileButtonTextActive]}>
                {audioFile ? audioFile.name : 'Select Audio File'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cover Art *</Text>
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

          <TouchableOpacity
            style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={24} color={colors.background} />
                <Text style={styles.uploadButtonText}>Upload Track</Text>
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
  genreContainer: {
    marginTop: 8,
  },
  genreChip: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  genreChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genreChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  genreChipTextActive: {
    color: colors.background,
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});
