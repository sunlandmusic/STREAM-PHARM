import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import usePlayerStore from '@/store/playerStore';
import { colors } from '@/constants/colors';

interface SoundCloudEmbedProps {
  embedCode: string;
  playlistId: string;
  height?: number;
}

const SoundCloudEmbed: React.FC<SoundCloudEmbedProps> = ({ 
  embedCode, 
  playlistId,
  height = 450
}) => {
  const { isPlaying, currentPlaylistId } = usePlayerStore();
  
  // Extract the src URL from the embed code
  const srcRegex = /src="([^"]+)"/;
  const match = embedCode.match(srcRegex);
  const srcUrl = match ? match[1] : '';
  
  // Add auto_play parameter based on player state
  const shouldAutoPlay = isPlaying && currentPlaylistId === playlistId;
  const autoPlayUrl = srcUrl.replace('auto_play=false', `auto_play=${shouldAutoPlay}`);
  
  // Make sure the player shows all controls
  const fullControlsUrl = autoPlayUrl
    .replace('hide_related=false', 'hide_related=false')
    .replace('show_comments=true', 'show_comments=true')
    .replace('show_user=true', 'show_user=true')
    .replace('show_reposts=false', 'show_reposts=false')
    .replace('show_teaser=true', 'show_teaser=true')
    .replace('visual=true', 'visual=true');
  
  if (Platform.OS === 'web') {
    // For web, we'll use a div with dangerouslySetInnerHTML
    return (
      <View style={[styles.container, { height }]}>
        <div 
          dangerouslySetInnerHTML={{ __html: embedCode }} 
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ uri: fullControlsUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(error) => console.error('WebView error:', error)}
        onHttpError={(error) => console.error('WebView HTTP error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});

export default SoundCloudEmbed;