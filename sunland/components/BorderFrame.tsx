import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';

interface BorderFrameProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  style?: object;
}

const BorderFrame: React.FC<BorderFrameProps> = ({ 
  children, 
  width = '100%', 
  height = 'auto',
  style = {}
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Image
        source="https://cdn.shopify.com/s/files/1/2682/9856/files/C-6.png?v=1747724007"
        style={styles.borderImage}
        contentFit="fill"
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },
  borderImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  content: {
    width: '70%',
    height: '70%',
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BorderFrame;